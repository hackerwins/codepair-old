import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActorID } from 'yorkie-js-sdk';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppState } from 'app/rootReducer';
import {
  attachDoc,
  detachDoc,
  createClient,
  createDocument,
  attachDocLoading,
  CodeMode,
  setCodeMode,
} from 'features/docSlices';
import { Metadata, ConnectionStatus, syncPeer } from 'features/peerSlices';

import Cursor from './Cursor';

import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';

import 'codemirror/mode/go/go';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/keymap/sublime';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/vim';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/material.css';
import './index.css';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: 'calc(100vh - 110px)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function CodeEditor(props: { docKey: string }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { docKey } = props;
  const doc = useSelector((state: AppState) => state.docState.doc);
  const codeMode = useSelector((state: AppState) => state.docState.mode);
  const client = useSelector((state: AppState) => state.docState.client);
  const loading = useSelector((state: AppState) => state.docState.loading);
  const errorMessage = useSelector((state: AppState) => state.docState.errorMessage);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const cursorMapRef = useRef<Map<ActorID, Cursor>>(new Map());

  const connectCursor = useCallback(
    (clientID: ActorID, metadata: Metadata) => {
      cursorMapRef.current.set(clientID, new Cursor(clientID, metadata));
    },
    [peers],
  );

  const disconnectCursor = useCallback((clientID: ActorID) => {
    if (cursorMapRef.current.has(clientID)) {
      cursorMapRef.current.get(clientID)!.clear();
      cursorMapRef.current.delete(clientID);
    }
  }, []);

  useEffect(() => {
    dispatch(attachDocLoading(true));
    dispatch(createClient());
    dispatch(createDocument(docKey));

    return () => {
      dispatch(detachDoc());
      dispatch(attachDocLoading(false));
    };
  }, [docKey]);

  useEffect(() => {
    if (!client || !doc) {
      return () => {};
    }

    const unsubscribe = client.subscribe((event) => {
      if (event.name === 'peers-changed') {
        const documentKey = doc.getKey().toIDString();
        const changedPeers = event.value[documentKey];
        dispatch(syncPeer(changedPeers));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [client, doc, peers]);

  useEffect(() => {
    for (const [id, peer] of Object.entries(peers)) {
      if (cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Disconnected) {
        disconnectCursor(id);
      } else if (!cursorMapRef.current.has(id) && peer.status === ConnectionStatus.Connected) {
        connectCursor(id, peer.metadata);
      }
    }
  }, [peers]);

  useEffect(() => {
    if (!client || !doc) {
      return;
    }

    const attachDocAsync = async () => {
      await dispatch(attachDoc({ client, document: doc }));
      dispatch(setCodeMode(doc.getRootObject().mode || CodeMode.PlainText));
      dispatch(attachDocLoading(false));
    };
    attachDocAsync();
  }, [client, doc]);

  if (loading) {
    return (
      <Box className={classes.root}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (errorMessage || !client || !doc) {
    return (
      <div className={classes.root}>
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="warning">{errorMessage || 'fail to attach document'}</Alert>
        </Snackbar>
      </div>
    );
  }

  return (
    <CodeMirror
      options={{
        mode: codeMode,
        theme: menu.codeTheme,
        keyMap: menu.codeKeyMap,
        tabSize: Number(menu.tabSize),
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      }}
      editorDidMount={(editor: CodeMirror.Editor) => {
        editor.focus();
        const updateCursor = (clientID: ActorID, pos: CodeMirror.Position) => {
          const cursor = cursorMapRef.current.get(clientID);
          cursor?.updateCursor(editor, pos);
        };

        const updateLine = (clientID: ActorID, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) => {
          const cursor = cursorMapRef.current.get(clientID);
          cursor?.updateLine(editor, fromPos, toPos);
        };

        // TODO Load user's cursor position
        doc.subscribe((event: any) => {
          if (event.name === 'remote-change') {
            event.value.forEach((change: any) => {
              const { actor } = change.getID();
              if (actor !== client.getID()) {
                if (!cursorMapRef.current.has(actor)) {
                  return;
                }

                const cursor = cursorMapRef.current.get(actor);
                if (cursor!.isActive()) {
                  return;
                }

                updateCursor(actor, editor.posFromIndex(0));
              }
            });
          }
        });

        // When there is a document modification connected to the yorkie
        const root = doc.getRootObject();
        root.content.onChanges((changes: any) => {
          changes.forEach((change: any) => {
            const { actor, from, to } = change;
            if (change.type === 'content') {
              const content = change.content || '';

              if (actor !== client.getID()) {
                const fromPos = editor.posFromIndex(from);
                const toPos = editor.posFromIndex(to);
                editor.replaceRange(content, fromPos, toPos, 'yorkie');
              }
            } else if (change.type === 'selection') {
              if (actor !== client.getID()) {
                let fromPos = editor.posFromIndex(from);
                let toPos = editor.posFromIndex(to);
                updateCursor(actor, toPos);

                if (from > to) {
                  [toPos, fromPos] = [fromPos, toPos];
                }
                updateLine(actor, fromPos, toPos);
              }
            }
          });
        });

        // We need to subtract the height of NavBar.
        editor.setSize('auto', 'calc(100vh - 110px)');
        editor.setValue(root.content.getValue());
      }}
      // Notifying other clients to move the cursor
      onSelection={(editor: CodeMirror.Editor, data: CodeMirror.EditorSelectionChange) => {
        if (data.origin === undefined) {
          return;
        }

        const from = editor.indexFromPos(data.ranges[0].anchor);
        const to = editor.indexFromPos(data.ranges[0].head);

        doc.update((root) => {
          root.content.updateSelection(from, to);
        });
      }}
      // Edit the yorkie document
      onBeforeChange={(editor: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
        if (change.origin === 'yorkie' || change.origin === 'setValue') {
          return;
        }

        const from = editor.indexFromPos(change.from);
        const to = editor.indexFromPos(change.to);
        const content = change.text.join('\n');

        doc.update((root) => {
          root.content.edit(from, to, content);
        });
      }}
    />
  );
}
