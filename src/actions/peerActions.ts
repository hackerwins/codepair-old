export enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface Peer {
  id: string;
  color: string;
  status: ConnectionStatus;
}

export enum PeerActionTypes {
  CONNECT_PEER = 'CONNECT_PEER',
  DISCONNECT_PEER = 'DISCONNECT_PEER',
}

export interface ConnectPeerAction {
  type: PeerActionTypes.CONNECT_PEER;
  id: string;
  color: string;
}

export interface DisconnectPeerAction {
  type: PeerActionTypes.DISCONNECT_PEER;
  id: string;
}

export const AddPeer = (id: string, color: string): ConnectPeerAction => ({
  type: PeerActionTypes.CONNECT_PEER,
  id,
  color,
});

export const DisconnectPeer = (id: string): DisconnectPeerAction => ({
  type: PeerActionTypes.DISCONNECT_PEER,
  id,
});

export type PeerActions = ConnectPeerAction | DisconnectPeerAction;
