import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { AppState } from 'app/rootReducer';
import CodeEditor from 'components/Editor/CodeEditor';
import Board from 'components/Editor/Board';

import {
  activateClient,
  deactivateClient,
  createDocument,
  detachDocument,
  attachDoc,
  attachDocLoading,
  CodeMode,
  setCodeMode,
} from 'features/docSlices';
import { syncPeer } from 'features/peerSlices';

const NAVBAR_HEIGHT = 110;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    },
    loading: {
      display: 'flex',
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export default function Editor(props: { docKey: string }) {
  const { docKey } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const loading = useSelector((state: AppState) => state.docState.loading);
  const errorMessage = useSelector((state: AppState) => state.docState.errorMessage);
  const isOpen = useSelector((state: AppState) => state.boardState.isOpen);

  const boardWidth = isOpen ? '650px' : '0px';
  const editorWidth = `calc( 100% - ${boardWidth} )`;

  useEffect(() => {
    dispatch(activateClient());
    return () => {
      dispatch(deactivateClient());
    };
  }, []);

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
  }, [client, doc]);

  useEffect(() => {
    dispatch(createDocument(docKey));
    return () => {
      dispatch(detachDocument());
    };
  }, [docKey]);

  useEffect(() => {
    async function attachDocAsync() {
      if (!client || !doc) {
        return;
      }

      dispatch(attachDocLoading(true));
      await dispatch(attachDoc({ client, doc }));
      dispatch(setCodeMode(doc.getRootObject().mode || CodeMode.Markdown));
      dispatch(attachDocLoading(false));
    }

    attachDocAsync();
    return () => {
      dispatch(attachDocLoading(true));
    };
  }, [docKey, client, doc]);

  if (errorMessage) {
    return (
      <div>
        <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="warning">{errorMessage || 'fail to attach document'}</Alert>
        </Snackbar>
      </div>
    );
  }

  if (loading) {
    return (
      <Box className={classes.loading}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <div style={{ width: editorWidth }}>
        <CodeEditor />
      </div>
      {isOpen && (
        <div style={{ width: boardWidth }}>
          <Board />
        </div>
      )}
    </div>
  );
}
