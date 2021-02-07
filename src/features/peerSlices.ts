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
}

export interface PeerState {
  peers: {
    /** @type {Object.<ActorID, Peer>} */
    [id: string]: Peer;
  };
}

const initialPeerState: PeerState = {
  peers: {},
};

const peerSlice = createSlice({
  name: 'peer',
  initialState: initialPeerState,
  reducers: {
    connectPeer(state, action: PayloadAction<Peer>) {
      const peer = action.payload;
      state.peers[peer.id] = peer;
    },
    disconnectPeer(state, action: PayloadAction<ActorID>) {
      state.peers[action.payload].status = ConnectionStatus.Disconnected;
    },
  },
});

export const { connectPeer, disconnectPeer } = peerSlice.actions;
export default peerSlice.reducer;
