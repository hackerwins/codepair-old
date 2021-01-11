import { IPeerState, addPeerAction, disconnectPeerAction, PeerActions } from 'actions/peerActions';
import deepCopy from 'utils/deepCopy';
import peerReducer, { initialPeerState } from 'reducers/peerReducer';

describe('peerReducer', () => {
  let state: IPeerState;

  beforeEach(() => {
    state = deepCopy<IPeerState>(initialPeerState);
  });

  it('should return the initial state', () => {
    expect(peerReducer(state, {} as PeerActions)).toEqual(state);
  });

  it('should connect a peer to state', () => {
    const expected = {
      peers: {
        testId: { color: 'red', id: 'testId', status: 'connected' },
      },
    };

    expect(peerReducer(state, addPeerAction('testId', 'red'))).toEqual(expected);
  });

  it('should disconnect a peer to state', () => {
    const expected = {
      peers: {
        testId: { color: 'red', id: 'testId', status: 'disconnected' },
      },
    };

    const id = 'testId';
    state = peerReducer(state, addPeerAction(id, 'red'));
    expect(peerReducer(state, disconnectPeerAction(id))).toEqual(expected);
  });
});
