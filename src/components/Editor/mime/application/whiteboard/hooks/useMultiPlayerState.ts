import { CodePairDoc } from 'features/docSlices';
import { Theme } from 'features/settingSlices';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { TDUserStatus, TDAsset, TDBinding, TDShape, TDUser, TldrawApp } from '@tldraw/tldraw';
import { useThrottleCallback } from '@react-hook/throttle';
import randomColor from 'randomcolor';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { Unsubscribe } from 'yorkie-js-sdk';

function updateDiff(oldShape: any, newShape: TDShape) {
  if (oldShape.type !== newShape.type) {
    oldShape.type = newShape.type;
  }

  if (oldShape.childIndex !== newShape.childIndex) {
    oldShape.childIndex = newShape.childIndex;
  }

  if (oldShape.id !== newShape.id) {
    oldShape.id = newShape.id;
  }

  if (newShape.type === 'draw') {
    if (oldShape.points.length !== newShape.points.length) {
      oldShape.points = newShape.points;
    } else {
      let hasChanged = false;
      for (let i = 0; i < newShape.points.length; i++) {
        if (oldShape.points[i][0] !== newShape.points[i][0] || oldShape.points[i][1] !== newShape.points[i][1]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        oldShape.points = newShape.points;
      }
    }

    if (oldShape.isComplete !== newShape.isComplete) {
      oldShape.isComplete = newShape.isComplete;
    }

    if (oldShape.name !== newShape.name) {
      oldShape.name = newShape.name;
    }

    if (oldShape.parentId !== newShape.parentId) {
      oldShape.parentId = newShape.parentId;
    }

    if (oldShape.point[0] !== newShape.point[0] || oldShape.point[1] !== newShape.point[1]) {
      oldShape.point = newShape.point;
    }
  }

  if (oldShape.rotation !== newShape.rotation) {
    oldShape.rotation = newShape.rotation;
  }

  if (oldShape.style.color !== newShape.style.color) {
    oldShape.style.color = newShape.style.color;
  }

  if (oldShape.style.size !== newShape.style.size) {
    oldShape.style.size = newShape.style.size;
  }

  if (oldShape.style.isFilled !== newShape.style.isFilled) {
    oldShape.style.isFilled = newShape.style.isFilled;
  }

  if (oldShape.style.dash !== newShape.style.dash) {
    oldShape.style.dash = newShape.style.dash;
  }

  if (oldShape.style.scale !== newShape.style.scale) {
    oldShape.style.scale = newShape.style.scale;
  }
}

export function useMultiplayerState(roomId: string) {
  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const mePeer = useSelector((state: AppState) => state.peerState.me);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const [app, setApp] = useState<TldrawApp>();
  const [loading, setLoading] = useState(true);
  const darkMode = menu.theme === Theme.Dark ? true : false;

  // Callbacks --------------
  const onMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(roomId);
      app.setIsLoading(true);
      app.pause();

      setApp(app);

      const randomName = uniqueNamesGenerator({
        dictionaries: [names],
      });

      // On mount, create new user
      app.updateUsers([
        {
          id: mePeer!.id,
          point: [0, 0],
          color: menu?.userColor || randomColor(),
          status: TDUserStatus.Connected,
          activeShapes: [],
          selectedIds: [],
          metadata: { name: menu?.userName || randomName }, // <-- custom metadata
        },
      ]);
    },
    [roomId],
  );

  // Update Yorkie doc when the app's shapes change.
  // Prevent overloading yorkie update api call by throttle
  const onChangePage = useThrottleCallback(
    (app: TldrawApp, shapes: Record<string, TDShape | undefined>, bindings: Record<string, TDBinding | undefined>) => {
      if (!app || client === undefined || doc === undefined) return;

      doc.update((root: CodePairDoc) => {
        Object.entries(shapes).forEach(([id, shape]) => {
          if (!shape) {
            delete root.whiteboard!.shapes[id];
          } else {
            const oldShape = root.whiteboard!.shapes[id];

            if (!oldShape) {
              root.whiteboard!.shapes[id] = shape;
            } else {
              updateDiff(oldShape, shape);
            }
          }
        });

        Object.entries(bindings).forEach(([id, binding]) => {
          if (!binding) {
            delete root.whiteboard!.bindings[id];
          } else {
            root.whiteboard!.bindings[id] = binding;
          }
        });

        // Should store app.document.assets which is global asset storage referenced by inner page assets
        // Document key for assets should be asset.id (string), not index
        Object.entries(app.assets).forEach(([, asset]) => {
          if (!asset.id) {
            delete root.whiteboard!.assets[asset.id];
          } else {
            root.whiteboard!.assets[asset.id] = asset;
          }
        });
      });
    },
    10,
    false,
  );

  // Handle presence updates when the user's pointer / selection changes
  const onChangePresence = useThrottleCallback(
    (app: TldrawApp, user: TDUser) => {
      if (!app || client === undefined || !client.isActive()) return;

      client.updatePresence('whiteboard.user', user);
    },
    10,
    false,
  );

  // Document Changes --------

  useEffect(() => {
    if (!app) return;
    // Detach & deactive yorkie client before unload
    function handleDisconnect() {
      if (client === undefined || doc === undefined) return;
    }

    let stillAlive = true;
    let unsubscribe: Unsubscribe;
    window.addEventListener('beforeunload', handleDisconnect);

    // Subscribe to changes
    function handleChanges() {
      const root = doc!.getRoot();

      // Parse proxy object to record
      const shapeRecord: Record<string, TDShape> = JSON.parse((root.whiteboard!.shapes as any).toJSON());
      const bindingRecord: Record<string, TDBinding> = JSON.parse((root.whiteboard!.bindings as any).toJSON());
      const assetRecord: Record<string, TDAsset> = JSON.parse((root.whiteboard!.assets as any).toJSON());

      // Replace page content with changed(propagated) records
      app?.replacePageContent(shapeRecord, bindingRecord, assetRecord);
    }

    // Setup the document's storage and subscriptions
    async function setupDocument() {
      try {
        // 01-1. Subscribe peers-changed event and update tldraw users state
        unsubscribe = client!.subscribe((event) => {
          if (event.type === 'peers-changed') {
            const peers = event.value[doc!.getKey()];

            // Compare with local user list and get leaved user list
            // Then remove leaved users
            const localUsers = Object.values(app!.room!.users);
            const remoteUsers = Object.values(peers || {})
              .map((presence) => {
                return {
                  ...{
                    point: [0, 0],
                    activeShapes: [],
                    selectedIds: [],
                  },
                  ...(presence['whiteboard.user'] || {
                    point: [0, 0],
                    color: presence.color,
                    activeShapes: [],
                    selectedIds: [],
                  }),
                  metadata: {
                    name: presence.username,
                  },
                };
              })
              .filter(Boolean);
            const leavedUsers = localUsers.filter(({ id: id1 }) => !remoteUsers.some(({ id: id2 }) => id2 === id1));

            leavedUsers.forEach((user) => {
              app?.removeUser(user.id);
            });

            // Then update users
            app?.updateUsers(remoteUsers);
          }
        });

        // 03. Initialize document if document not exists.
        doc!.update((root) => {
          if (!root.whiteboard) {
            root.whiteboard = {
              shapes: {},
              bindings: {},
              assets: {},
            };
          }

          if (!root.whiteboard?.shapes) {
            root.whiteboard.shapes = {};
          }
          if (!root.whiteboard.bindings) {
            root.whiteboard.bindings = {};
          }
          if (!root.whiteboard.assets) {
            root.whiteboard.assets = {};
          }
        }, 'create shapes/bindings/assets object if not exists');

        // 04. Subscribe document event and handle changes.
        doc!.subscribe((event) => {
          if (event.type === 'remote-change') {
            handleChanges();
          }
        });

        // 05. Sync client to sync document with other peers.
        await client!.sync();

        if (stillAlive) {
          // Update the document with initial content
          // handleChanges();

          // Zoom to fit the content & finish loading
          if (app) {
            app.zoomToFit();
            if (app.zoom > 1) {
              app.resetZoom();
            }
            app.setIsLoading(false);
          }

          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setupDocument();

    return () => {
      window.removeEventListener('beforeunload', handleDisconnect);
      stillAlive = false;

      unsubscribe?.();
    };
  }, [app]);

  return {
    onMount,
    onChangePage,
    loading,
    darkMode,
    onChangePresence,
  };
}
