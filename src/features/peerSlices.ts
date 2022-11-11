import { ActorID } from 'yorkie-js-sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Presence {
  username: string;
  color: string;
  image: string; // Currently all anonymous images
  board: string;
}

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface Peer {
  id: ActorID;
  status: ConnectionStatus;
  presence: Presence;
  isMine: boolean;
}

export interface PeerState {
  peers: Record<string, Peer>;
}

export interface SyncPeerPayLoad {
  myClientID: ActorID;
  changedPeers: Record<string, Presence>;
}

const initialPeerState: PeerState = {
  peers: {},
};

const peerSlice = createSlice({
  name: 'peer',
  initialState: initialPeerState,
  reducers: {
    syncPeer(state, action: PayloadAction<SyncPeerPayLoad>) {
      const { myClientID, changedPeers } = action.payload;
      const { peers } = state;

      for (const clientID of Object.keys(peers)) {
        if (!changedPeers[clientID]) {
          peers[clientID].status = ConnectionStatus.Disconnected;
        }
      }

      for (const [clientID, presence] of Object.entries(changedPeers)) {
        if (!peers[clientID] || peers[clientID].status === ConnectionStatus.Disconnected) {
          const peer = {
            id: clientID,
            status: ConnectionStatus.Connected,
            presence,
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
