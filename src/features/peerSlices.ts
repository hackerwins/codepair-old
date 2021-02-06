import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface Peer {
  id: string;
  username: string;
  color: string;
  status: ConnectionStatus;
}

export interface PeerState {
  peers: {
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
    connectPeer(state, action: PayloadAction<{ id: string; username: string, color: string; status: ConnectionStatus }>) {
      const { id, username, color, status } = action.payload;
      state.peers[id] = {
        id,
        username,
        color,
        status,
      };
    },
    disconnectPeer(state, action: PayloadAction<string>) {
      state.peers[action.payload].status = ConnectionStatus.Disconnected;
    },
  },
});

export const { connectPeer, disconnectPeer } = peerSlice.actions;
export default peerSlice.reducer;
