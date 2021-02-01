/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { ConnectionStatus } from 'features/peerSlices';

export default function usePeer() {
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);

  const activePeers = client
    ? Object.entries(peers)
        .filter(([clientId, clientInfo]) => {
          if (client.getID() === clientId) {
            return false;
          }
          return clientInfo.status === ConnectionStatus.Connected;
        })
        .map(([_, clientInfo]) => clientInfo)
    : [];

  return { activePeers };
}
