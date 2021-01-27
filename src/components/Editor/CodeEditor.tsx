import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import randomColor from 'randomcolor';

import { AppState } from 'reducers/rootReducer';
import { attachDoc, attachDocLoading } from 'reducers/docReducer';
import { ConnectionStatus, connectPeer, disconnectPeer } from 'reducers/peerReducer';

import ClientCursor from './ClientCursor';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import './CodeEditor.css';

type CodeEditorProps = {
  docKey: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CodeEditor(props: CodeEditorProps) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { docKey } = props;
  const doc = useSelector((state: AppState) => state.docState.doc);
  const client = useSelector((state: AppState) => state.docState.client);
  const loading = useSelector((state: AppState) => state.docState.loading);
  const errorMessage = useSelector((state: AppState) => state.docState.errorMessage);
  const peerClients = useSelector((state: AppState) => state.peerState.peers);
  const otherClientsCursor = useRef<Map<string, ClientCursor>>(new Map());

  const connectClient = (clientId: string) => {
    const existedClient = peerClients[clientId];

    let color: string;
    if (existedClient && existedClient.status === ConnectionStatus.Disconnected) {
      color = existedClient.color;
    } else {
      color = randomColor();
    }

    const newClientCursor = new ClientCursor(clientId, color);
    otherClientsCursor.current.set(clientId, newClientCursor);
    dispatch(connectPeer({ id: clientId, color, status: ConnectionStatus.Connected }));
  };

  // Attach document
  useEffect(() => {
    async function attachDocAsync() {
      dispatch(attachDocLoading(true));
      await dispatch(attachDoc(docKey));
      dispatch(attachDocLoading(false));
    }
    attachDocAsync();
  }, [docKey, dispatch]);

  // Subscribe other client
  useEffect(() => {
    if (!client || !doc) {
      return () => {};
    }

    const disconnectClient = (clientId: string) => {
      if (otherClientsCursor.current.has(clientId)) {
        otherClientsCursor.current.get(clientId)!.removeCursor();
        otherClientsCursor.current.delete(clientId);
      }
      dispatch(disconnectPeer(clientId));
    };

    const unsubscribe = client.subscribe((event: any) => {
      if (event.name === 'peers-changed') {
        const newPeerClients = event.value[doc.getKey().toIDString()];

        for (const clientId of Object.keys(peerClients)) {
          if (newPeerClients[clientId] && peerClients[clientId].status === ConnectionStatus.Connected) {
            continue;
          }
          disconnectClient(clientId);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [client, doc, peerClients, dispatch]);

  if (loading) {
    return (
      <Box height="100%">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (errorMessage || client === null || doc === null) {
    return (
      <div className={classes.root}>
        <Alert severity="error">{errorMessage || 'fail to attach document'}</Alert>
      </div>
    );
  }

  return (
    <CodeMirror
      options={{ mode: 'xml', theme: 'monokai', lineNumbers: true }}
      editorDidMount={(editor: CodeMirror.Editor) => {
        editor.focus();
        const updateCursor = (clientId: string, pos: CodeMirror.Position) => {
          const clientCursor = otherClientsCursor.current.get(clientId);
          clientCursor!.updateCursor(editor, pos);
        };

        const updateLine = (clientId: string, fromPos: CodeMirror.Position, toPos: CodeMirror.Position) => {
          const clientCursor = otherClientsCursor.current.get(clientId);
          clientCursor!.updateLine(editor, fromPos, toPos);
        };

        doc.subscribe((event: any) => {
          if (event.name === 'remote-change') {
            event.value.forEach((change: any) => {
              const { actor } = change.getID();
              if (actor !== client.getID()) {
                if (!otherClientsCursor.current.has(actor)) {
                  connectClient(actor);
                  updateCursor(actor, editor.posFromIndex(0));
                  // TODO Load user's cursor position
                }
              }
            });
          }
        });

        // When there is a document modification connected to the yorkie
        const root = doc.getRootObject() as any;
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
                if (!otherClientsCursor.current.has(actor)) {
                  connectClient(actor);
                }

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
        editor.setSize('auto', 'calc(100vh - 64px)');
        editor.setValue(root.content.getValue());
      }}
      // Notifying other clients to move the cursor
      onSelection={(editor: CodeMirror.Editor, data: CodeMirror.EditorSelectionChange) => {
        if (data.origin === undefined) {
          return;
        }

        const from = editor.indexFromPos(data.ranges[0].anchor);
        const to = editor.indexFromPos(data.ranges[0].head);

        doc.update((root: any) => {
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

        doc.update((root: any) => {
          root.content.edit(from, to, content);
        });
      }}
    />
  );
}
