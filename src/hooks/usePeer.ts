/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus } from 'features/peerSlices';

export default function usePeer() {
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);

  const activePeers = useMemo(() => {
    return client
      ? Object.entries(peers)
          .filter(([clientID, clientInfo]) => {
            if (client.getID() === clientID) {
              return false;
            }
            return clientInfo.status === ConnectionStatus.Connected;
          })
          .map(([_, clientInfo]) => clientInfo)
      : [];
  }, [client, peers]);

  return { activePeers };
}
