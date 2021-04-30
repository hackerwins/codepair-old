/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ActorID } from 'yorkie-js-sdk';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus, Peer } from 'features/peerSlices';

export default function usePeer() {
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);

  const activePeers = useMemo(() => {
    if (!client) {
      return [];
    }
    return Object.values(peers).filter((peer) => peer.status === ConnectionStatus.Connected);
  }, [client, peers]);

  const activePeerMap = useMemo<Map<ActorID, Peer>>(() => {
    return activePeers.reduce((acc, activePeer) => acc.set(activePeer.id, activePeer), new Map());
  }, [activePeers]);

  return { activePeers, activePeerMap };
}
