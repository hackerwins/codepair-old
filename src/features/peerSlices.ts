import { TDUser } from '@tldraw/tldraw';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ActorID } from 'yorkie-js-sdk';
import { DocState } from './docSlices';

export interface Presence {
  username: string;
  color: string;
  image: string; // Currently all anonymous images
  board: string;
  'whiteboard.user': TDUser;
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
  me: Peer | null;
  peers: Record<string, Peer>;
}

export interface SyncPeerPayLoad {
  myClientID: ActorID;
  changedPeers: Record<string, Presence>;
}

const initialPeerState: PeerState = {
  me: null,
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

          if (peer.isMine) {
            state.me = peer;
          }
        }
      }
    },
  },
});

export const updatePresenceColor = createAsyncThunk<undefined, string, { rejectValue: string }>(
  'presence/update',
  (newColor, thunkApi) => {
    try {
      const state = thunkApi.getState() as any;
      const { docState }: { docState: DocState } = state;
      const { client } = docState;

      const userColor = newColor;
      client?.updatePresence('color', userColor);

      return undefined;
    } catch (err) {
      return thunkApi.rejectWithValue((err as Error).message);
    }
  },
);

export const { syncPeer } = peerSlice.actions;
export default peerSlice.reducer;
