import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import { AppState } from 'app/rootReducer';
import usePeer from 'hooks/usePeer';


export default function NameTextInput() {
  const client = useSelector((state: AppState) => state.docState.client);
  const inputRef = useRef<HTMLInputElement>(null);

  const { activePeers } = usePeer();

  const onBlur = useCallback(() => {
    // TODO: UpdateMetadate with peerSlice action.
  }, []);

  if (!client) {
    // NOTE: We use null as an exception to prevent component from rendering.
    return null;
  }

  return (
    <>
      <TextField 
        ref={inputRef}
        id="standard-basic" 
        label="My name is..."
        value={activePeers.filter((peer) => peer.isMine)[0]?.metadata?.username ?? ''}
        variant="standard"
        onBlur={onBlur}
      />
    </>
  );
}
