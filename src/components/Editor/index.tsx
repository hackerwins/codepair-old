import React, { lazy, Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import {
  activateClient,
  deactivateClient,
  createDocument,
  detachDocument,
  attachDoc,
  attachDocLoading,
  CodeMode,
  setCodeMode,
  Preview,
  setPreview,
  DocStatus,
  setStatus,
} from 'features/docSlices';
import { makeStyles } from 'styles/common';
import { Presence, syncPeer } from 'features/peerSlices';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import WhiteBoardEditor from './mime/application/whiteboard/Editor';

const Editor = lazy(() => import('./mime/text/md/Editor'));
const CellEditor = lazy(() => import('./mime/application/cell/Editor'));

const useStyles = makeStyles()(() => ({
  loading: {
    display: 'flex',
    height: `100%`,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
}));

function LoadingView() {
  const { classes } = useStyles();
  return (
    <Box className={classes.loading}>
      <CircularProgress />
    </Box>
  );
}

// eslint-disable-next-line func-names
export default function BaseEditor(props: { docKey: string }) {
  const { docKey } = props;
  const dispatch = useDispatch<AppDispatch>();
  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const status = useSelector((state: AppState) => state.docState.status);
  const loading = useSelector((state: AppState) => state.docState.loading);
  const errorMessage = useSelector((state: AppState) => state.docState.errorMessage);

  useEffect(() => {
    // To call other documents according to the docKey
    // Add logic to activate and deactivate the client.
    dispatch(activateClient());
    return () => {
      dispatch(deactivateClient());
    };
  }, [dispatch, docKey]);

  useEffect(() => {
    if (!client || !doc) {
      return;
    }

    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'peers-changed') {
        const changedPeers = client.getPeersByDocKey(doc.getKey()).reduce((acc, peer) => {
          acc[peer.clientID] = peer.presence;
          return acc;
        }, {} as Record<string, Presence>);
        dispatch(
          syncPeer({
            myClientID: client.getID()!,
            changedPeers,
          }),
        );
      }

      if (
        status === DocStatus.Connect &&
        ((event.type === 'status-changed' && event.value === 'deactivated') ||
          (event.type === 'stream-connection-status-changed' && event.value === 'disconnected') ||
          (event.type === 'document-synced' && event.value === 'sync-failed'))
      ) {
        dispatch(setStatus(DocStatus.Disconnect));
      } else if (
        status === DocStatus.Disconnect &&
        (event.type === 'peers-changed' ||
          event.type === 'documents-changed' ||
          (event.type === 'status-changed' && event.value === 'activated') ||
          (event.type === 'stream-connection-status-changed' && event.value === 'connected') ||
          (event.type === 'document-synced' && event.value === 'synced'))
      ) {
        dispatch(setStatus(DocStatus.Connect));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [client, doc, status, dispatch]);

  useEffect(() => {
    dispatch(createDocument(docKey));
    return () => {
      dispatch(detachDocument());
    };
  }, [docKey, dispatch]);

  useEffect(() => {
    async function attachDocAsync() {
      if (!client || !doc) {
        return;
      }

      dispatch(attachDocLoading(true));
      await dispatch(attachDoc({ client, doc }));
      dispatch(setCodeMode(doc.getRoot().mode || CodeMode.Markdown));
      dispatch(setPreview(doc.getRoot().preview || Preview.HTML));
      dispatch(attachDocLoading(false));
    }

    attachDocAsync();
    return () => {
      dispatch(attachDocLoading(true));
    };
  }, [client, doc, dispatch]);

  if (errorMessage) {
    return (
      <div>
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="warning">{errorMessage || 'fail to attach document'}</Alert>
        </Snackbar>
      </div>
    );
  }

  if (loading || !client || !doc) {
    return <LoadingView />;
  }

  const { mimeType } = doc.getRoot();

  switch (mimeType) {
    case 'application/vnd.pairy.whiteboard':
      return <WhiteBoardEditor />;
    case 'text/plain':
      return <Editor />;
    case 'application/json':
      return <Editor />;
    case 'application/cell':
      return (
        <Suspense fallback={<LoadingView />}>
          <CellEditor />
        </Suspense>
      );
    case 'text/markdown':
    default:
      return (
        <Suspense fallback={<LoadingView />}>
          <Editor />
        </Suspense>
      );
  }
}
