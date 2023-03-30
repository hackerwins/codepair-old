import { CodePairDoc } from 'features/docSlices';
import { Theme } from 'features/settingSlices';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  TDUserStatus,
  TDAsset,
  TDBinding,
  TDShape,
  TDUser,
  TldrawApp,
  DrawShape,
  RectangleShape,
} from '@tldraw/tldraw';
import { useThrottleCallback } from '@react-hook/throttle';
import randomColor from 'randomcolor';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { Unsubscribe } from 'yorkie-js-sdk';

function updateDiff(oldV: TDShape, newV: TDShape) {
  const oldShape = oldV;
  const newShape = newV;

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
    const oldDrawShape = oldShape as DrawShape;

    if (oldDrawShape.points.length !== newShape.points.length) {
      oldDrawShape.points = newShape.points;
    } else {
      let hasChanged = false;
      for (let i = 0; i < newShape.points.length; i += 1) {
        if (
          oldDrawShape.points[i][0] !== newShape.points[i][0] ||
          oldDrawShape.points[i][1] !== newShape.points[i][1]
        ) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        oldDrawShape.points = newShape.points;
      }

      if (oldDrawShape.isComplete !== newShape.isComplete) {
        oldDrawShape.isComplete = newShape.isComplete;
      }
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
  } else if (newShape.type === 'rectangle') {
    const oldDrawShape = oldShape as RectangleShape;
    if (oldDrawShape.size[0] !== newShape.size[0] || oldDrawShape.size[1] !== newShape.size[1]) {
      oldDrawShape.size = newShape.size;
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
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const [app, setApp] = useState<TldrawApp>();
  const [loading, setLoading] = useState(true);
  const darkMode = menu.theme === Theme.Dark;

  // Callbacks --------------
  const onMount = useCallback(
    (tldrawApp: TldrawApp) => {
      tldrawApp.loadRoom(roomId);
      tldrawApp.setIsLoading(true);
      tldrawApp.pause();

      setApp(tldrawApp);

      const randomName = uniqueNamesGenerator({
        dictionaries: [names],
      });

      // On mount, create new user
      tldrawApp.updateUsers([
        {
          id: `${client!.getID()}`,
          point: [0, 0],
          color: menu?.userColor || randomColor(),
          status: TDUserStatus.Connected,
          activeShapes: [],
          selectedIds: [],
          metadata: { name: menu?.userName || randomName }, // <-- custom metadata
        },
      ]);
    },
    [roomId, client, menu],
  );

  // Update Yorkie doc when the app's shapes change.
  // Prevent overloading yorkie update api call by throttle
  const onChangePage = useThrottleCallback(
    (
      tldrawApp: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>,
    ) => {
      if (!tldrawApp || client === undefined || doc === undefined) return;

      doc.update((currentRoot: CodePairDoc) => {
        const root = currentRoot;
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
        Object.entries(tldrawApp.assets).forEach(([, asset]) => {
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
    (tldrawApp: TldrawApp, user: TDUser) => {
      if (!tldrawApp || client === undefined || !client.isActive()) return;

      client.updatePresence('whiteboardUser', {
        ...{
          id: `${client.getID()}`,
          point: [0, 0],
          color: menu?.userColor || randomColor(),
          status: TDUserStatus.Connected,
          activeShapes: [],
          selectedIds: [],
          metadata: { name: menu?.userName }, // <-- custom metadata
        },
        ...client.getPresence().whiteboardUser,
        ...user,
      });
    },
    10,
    false,
  );

  // Document Changes --------

  useEffect(() => {
    if (!app) return;
    let stillAlive = true;
    let unsubscribe: Unsubscribe;

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
            const peers = event.value.peers[doc!.getKey()];
            // Compare with local user list and get leaved user list
            // Then remove leaved users
            const localUsers = Object.values(app!.room!.users).filter(Boolean);

            const remoteUsers = Object.values(peers || {})
              .map((peer) => {
                if (!peer.presence.whiteboardUser) return null;
                return {
                  ...{
                    point: [0, 0],
                    activeShapes: [],
                    selectedIds: [],
                    id: `${peer?.clientID}`,
                    status: TDUserStatus.Connected,
                    color: peer.presence.color,
                    metadata: {
                      name: peer.presence.username,
                    },
                  },
                  ...(peer.presence.whiteboardUser || {}),
                };
              })
              .filter(Boolean);
            const leavedUsers = localUsers.filter(({ id: id1 }) => !remoteUsers.some((user) => user?.id === id1));

            leavedUsers.forEach((user) => {
              app?.removeUser(user.id);
            });

            // Then update users
            app?.updateUsers(remoteUsers as any);
          }
        });

        // 03. Initialize document if document not exists.
        doc!.update((currentRoot) => {
          const root = currentRoot;
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
          handleChanges();
          handleChanges();

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
      stillAlive = false;

      unsubscribe?.();
    };
  }, [app, client, doc, roomId]);

  return {
    onMount,
    onChangePage,
    loading,
    darkMode,
    onChangePresence,
  };
}
