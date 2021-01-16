import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DocActionTypes, attachDocAction, loadDocAction } from 'actions/docActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('yorkie-js-sdk');

describe('docActions', () => {
  it('should attach to a document', async () => {
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

    const initialState = {};
    const store = mockStore(initialState);

    const docKey = 'docKey';
    await store.dispatch(attachDocAction(docKey) as any);

    const actions = store.getActions();
    const expected = [
      {
        type: DocActionTypes.ATTACH_DOC,
        doc,
        client,
      },
      {
        type: DocActionTypes.LOAD_DOC,
        loading: false,
      },
    ];
    expect(actions).toEqual(expected);
  });

  it('should fail to attach a document', async () => {
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

    const initialState = {};
    const store = mockStore(initialState);

    const docKey = 'docKey';
    await store.dispatch(attachDocAction(docKey) as any);

    const actions = store.getActions();
    const expected = [
      {
        type: DocActionTypes.ERROR,
        errorMessage: 'Fail to activate',
      },
      {
        type: DocActionTypes.LOAD_DOC,
        loading: false,
      },
    ];
    expect(actions).toEqual(expected);
  });

  it('should load a doc', () => {
    const initialState = {};
    const store = mockStore(initialState);

    store.dispatch(loadDocAction(true) as any);

    const actions = store.getActions();
    const expected = [
      {
        type: DocActionTypes.LOAD_DOC,
        loading: true,
      },
    ];
    expect(actions).toEqual(expected);
  });

  it('should not load a doc', () => {
    const initialState = {};
    const store = mockStore(initialState);

    store.dispatch(loadDocAction(false) as any);

    const actions = store.getActions();
    const expected = [
      {
        type: DocActionTypes.LOAD_DOC,
        loading: false,
      },
    ];
    expect(actions).toEqual(expected);
  });
});
