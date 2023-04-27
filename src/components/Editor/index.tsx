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
  setErrorMessage,
} from 'features/docSlices';
import { makeStyles } from 'styles/common';
import { Presence, syncPeer } from 'features/peerSlices';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import WhiteBoardEditor from './mime/application/whiteboard/Editor';
import Editor from './mime/text/md/Editor';

const MilkdownEditor = lazy(() => import('./mime/text/milkdown/Editor'));

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

function ErrorView({ onClose, message }: { message?: string; onClose: () => void }) {
  return (
    <div>
      <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={1000} onClose={onClose}>
        <Alert severity="warning">{message || 'fail to attach document'}</Alert>
      </Snackbar>
    </div>
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

  const handleErrorMessageClose = () => {
    dispatch(setErrorMessage(''));
  };

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
    if (!docKey) {
      return;
    }

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

  if (loading || !client || !doc) {
    return <LoadingView />;
  }

  const { mimeType } = doc.getRoot();

  switch (mimeType) {
    case 'application/vnd.pairy.whiteboard':
      return (
        <>
          <WhiteBoardEditor />
          {errorMessage ? <ErrorView onClose={handleErrorMessageClose} message={errorMessage} /> : null}
        </>
      );
    case 'text/milkdown':
      return (
        <Suspense fallback={<LoadingView />}>
          <MilkdownEditor />
        </Suspense>
      );
    case 'application/json':
      return <Editor />;
    case 'text/markdown':
    default:
      return (
        <>
          <Editor />
          {errorMessage ? <ErrorView onClose={handleErrorMessageClose} message={errorMessage} /> : null}
        </>
      );
  }
}
