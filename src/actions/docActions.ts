import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import yorkie, { Client, Document } from 'yorkie-js-sdk';

export interface IDocState {
  client: Client | null;
  doc: Document | null;
  loading: boolean;
  errorMessage: string;
}

export enum DocActionTypes {
  ATTACH_DOC = 'ATTACH_DOC',
  LOAD_DOC = 'LOAD_DOC',
  ERROR = 'ERROR',
}

export interface IAttachDocAction {
  type: DocActionTypes.ATTACH_DOC;
  client: Client;
  doc: Document;
}

export interface ILoadDocAction {
  type: DocActionTypes.LOAD_DOC;
  loading: boolean;
}

export interface IErrorAction {
  type: DocActionTypes.ERROR;
  errorMessage: string;
}
export type DocActions = IAttachDocAction | ILoadDocAction | IErrorAction;

/** <Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const attachDocAction: ActionCreator<ThunkAction<Promise<any>, IDocState, null, IAttachDocAction>> = (
  docKey: string,
) => {
  return async (dispatch: Dispatch) => {
    try {
      const client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`);
      await client.activate();

      const doc = yorkie.createDocument('codepairs', docKey);
      await client.attach(doc);

      doc.update((root: any) => {
        if (!root.content) {
          root.createText('content');
        }
      });
      await client.sync();

      dispatch({ type: DocActionTypes.ATTACH_DOC, doc, client });
    } catch (err) {
      dispatch({ type: DocActionTypes.ERROR, errorMessage: err.message });
    }

    dispatch({ type: DocActionTypes.LOAD_DOC, loading: false });
  };
};

export const loadDocAction: ActionCreator<ThunkAction<any, IDocState, null, ILoadDocAction>> = (
  shouldLoad: boolean,
) => (dispatch: Dispatch) => dispatch({ type: DocActionTypes.LOAD_DOC, loading: shouldLoad });
