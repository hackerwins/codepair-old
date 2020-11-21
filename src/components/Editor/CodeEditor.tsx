import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import randomColor from 'randomcolor';

import ClientCursor from './ClientCursor';

import { IAppState } from '../../store/store';
import { AttachDocAction, loadDocAction } from '../../actions/docActions';
import { ConnectionStatus, AddPeer, DisconnectPeer } from '../../actions/peerActions';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

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

  const doc = useSelector((state: IAppState) => state.docState.doc);
  const client = useSelector((state: IAppState) => state.docState.client);
  const loading = useSelector((state: IAppState) => state.docState.loading);
  const errorMessage = useSelector((state: IAppState) => state.docState.errorMessage);
  const peerClients = useSelector((state: IAppState) => state.peerState.peers);
  const otherClientsCuror = useRef(new Map());

  const disconnectClient = (clientId: string) => {
    if (otherClientsCuror.current.has(clientId)) {
      otherClientsCuror.current.get(clientId).removeCursor();
      otherClientsCuror.current.delete(clientId);
    }
    dispatch(DisconnectPeer(clientId));
  };

  const connectClient = (clientId: string) => {
    const existedClient = peerClients[clientId];

    let color: string;
    if (existedClient && existedClient.status === ConnectionStatus.Disconnected) {
      color = existedClient.color;
    } else {
      color = randomColor();
    }

    const newClientCursor = ClientCursor.of(clientId, color);
    otherClientsCuror.current.set(clientId, newClientCursor);
    dispatch(AddPeer(clientId, color));
  };

  useEffect(() => {
    dispatch(loadDocAction(true));
    dispatch(AttachDocAction(props.docKey));
    // eslint-disable-next-line
  }, [props.docKey]);

  useEffect(() => {
    if (!client || !doc) {
      return;
    }

    const unsubscribe = client.subscribe((event: any) => {
      if (event.name === 'documents-watching-peer-changed') {
        const newPeerClientsId: string[] = event.value[doc.getKey().toIDString()];
        const setNewPeerClientsId = new Set(newPeerClientsId);

        for (const clientId of Object.keys(peerClients)) {
          if (setNewPeerClientsId.has(clientId) && peerClients[clientId].status === ConnectionStatus.Connected) {
            setNewPeerClientsId.delete(clientId);
          } else {
            disconnectClient(clientId);
          }
        }

        Array.from(setNewPeerClientsId).forEach(connectClient);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, [client, doc, JSON.stringify(peerClients)]);

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
      editorDidMount={(editor) => {
        const root = doc.getRootObject() as any;
        root.content.onChanges((changes: any) => {
          for (const change of changes) {
            if (change.type === 'content') {
              const actor = change.actor;
              const from = change.from;
              const to = change.to;
              const content = change.content || '';

              if (actor !== client.getID()) {
                console.log(`%c remote: ${from}-${to}: ${content}`, 'color: skyblue');
                const fromIdx = editor.posFromIndex(from);
                const toIdx = editor.posFromIndex(to);
                editor.replaceRange(content, fromIdx, toIdx, 'yorkie');
              }
            } else if (change.type === 'selection') {
              const actor = change.actor;
              if (actor !== client.getID()) {
                if (change.to === change.from) {
                  if (!otherClientsCuror.current.has(actor)) {
                    connectClient(actor);
                  }
                  const otherClientCursor = otherClientsCuror.current.get(actor);
                  otherClientCursor.updateCursor(change.to, editor);
                }
              }
            }
          }
        });
        // We need to subtract the height of NavBar.
        editor.setSize('auto', 'calc(100vh - 64px)');
        editor.setValue(root.content.getValue());
      }}
      onBeforeChange={(editor: any, change: any) => {
        console.log(change.origin, change.text);
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
