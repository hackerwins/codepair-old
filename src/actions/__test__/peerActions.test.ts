import { PeerActionTypes, addPeerAction, disconnectPeerAction } from 'actions/peerActions';

describe('peerAction', () => {
  it('connect a peer', () => {
    const id = 'testId';
    const color = 'red';
    const expected = {
      type: PeerActionTypes.CONNECT_PEER,
      id,
      color,
    };
    expect(addPeerAction(id, color)).toEqual(expected);
  });

  it('disconnect a peer', () => {
    const id = 'testId';
    const expected = {
      type: PeerActionTypes.DISCONNECT_PEER,
      id,
    };
    expect(disconnectPeerAction(id)).toEqual(expected);
  });
});
