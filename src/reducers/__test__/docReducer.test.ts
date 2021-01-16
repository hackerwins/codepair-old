import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { IDocState, attachDocAction, DocActions } from 'actions/docActions';
import docReducer, { initialDocState } from 'reducers/docReducer';
import deepCopy from 'utils/deepCopy';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('yorkie-js-sdk');

describe('docReducer', () => {
  let state: IDocState;

  beforeEach(() => {
    state = deepCopy<IDocState>(initialDocState);
  });

  it('should return the initial state', () => {
    expect(docReducer(state, {} as DocActions)).toEqual(state);
  });

  it('should attach to the document and the client', async () => {
    const client = {
      activate: async () => {},
      attach: async () => {},
      sync: async () => {},
    };
    const doc = {
      update: async () => {},
    };

    // eslint-disable-next-line
    const yorkie = require('yorkie-js-sdk');
    yorkie.createClient.mockImplementation(() => {
      return client;
    });

    yorkie.createDocument.mockImplementation(() => {
      return doc;
    });

    const store = mockStore(state);

    store.subscribe(() => {
      const actions = store.getActions();
      const lastAction = actions[actions.length - 1];

      state = docReducer(state, lastAction);
    });

    const expected = {
      client,
      doc,
      loading: false,
      errorMessage: '',
    };

    await store.dispatch(attachDocAction('docKey') as any);
    expect(state).toEqual(expected);
  });

  it('should not attach to the document and the client with error messages', async () => {
    const client = {
      activate: async () => {
        throw new Error('Fail to activate');
      },
      attach: async () => {},
      sync: async () => {},
    };
    const doc = {
      update: async () => {},
    };

    // eslint-disable-next-line
    const yorkie = require('yorkie-js-sdk');
    yorkie.createClient.mockImplementation(() => {
      return client;
    });

    yorkie.createDocument.mockImplementation(() => {
      return doc;
    });

    const store = mockStore(state);

    store.subscribe(() => {
      const actions = store.getActions();
      const lastAction = actions[actions.length - 1];

      state = docReducer(state, lastAction);
    });

    const expected = {
      client: null,
      doc: null,
      loading: false,
      errorMessage: 'Fail to activate',
    };

    await store.dispatch(attachDocAction('docKey') as any);
    expect(state).toEqual(expected);
  });
});
