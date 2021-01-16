import { Reducer } from 'redux';

import { DocActionTypes, DocActions, IDocState } from 'actions/docActions';

export const initialDocState: IDocState = {
  client: null,
  doc: null,
  loading: false,
  errorMessage: '',
};

const docReducer: Reducer<IDocState, DocActions> = (state = initialDocState, action) => {
  switch (action.type) {
    case DocActionTypes.ATTACH_DOC: {
      return {
        ...state,
        client: action.client,
        doc: action.doc,
      };
    }
    case DocActionTypes.LOAD_DOC: {
      return {
        ...state,
        loading: action.loading,
      };
    }
    case DocActionTypes.ERROR: {
      return {
        ...state,
        errorMessage: action.errorMessage,
        doc: null,
      };
    }
    default:
      return state;
  }
};

export default docReducer;
