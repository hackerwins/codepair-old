import { Reducer } from 'redux';
import { Client, Document } from 'yorkie-js-sdk';

import { DocActionTypes, DocActions } from '../actions/docActions';

export interface IDocState {
  client: Client | null;
  doc: Document | null;
  loading: boolean;
  errorMessage: string;
}

const initialDocState: IDocState = {
  client: null,
  doc: null,
  loading: false,
  errorMessage: '',
};

export const docReducer: Reducer<IDocState, DocActions> = (
  state = initialDocState,
  action,
) => {
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
