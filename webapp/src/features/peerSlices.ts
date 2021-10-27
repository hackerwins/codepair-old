import { ActorID } from 'yorkie-js-sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Metadata {
  username: string;
  color: string;
  image: string; // Currently all anonymous images
}

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface Peer {
  id: ActorID;
  status: ConnectionStatus;
  metadata: Metadata;
  isMine: boolean;
}

export interface PeerState {
  peers: Record<string, Peer>;
}

const initialPeerState: PeerState = {
  peers: {},
};

const peerSlice = createSlice({
  name: 'peer',
  initialState: initialPeerState,
  reducers: {
    syncPeer(state, action: PayloadAction<any>) {
      const { myClientID, changedPeers } = action.payload;
      const { peers } = state;

      for (const clientID of Object.keys(peers)) {
        if (!changedPeers[clientID]) {
          peers[clientID].status = ConnectionStatus.Disconnected;
        }
      }

      for (const [clientID, metadata] of Object.entries(changedPeers)) {
        if (!peers[clientID] || peers[clientID].status === ConnectionStatus.Disconnected) {
          const peer = {
            id: clientID,
            status: ConnectionStatus.Connected,
            metadata: metadata as Metadata,
            isMine: myClientID === clientID,
          };
          state.peers[clientID] = peer;
        }
      }
    },
  },
});

export const { syncPeer } = peerSlice.actions;
export default peerSlice.reducer;
