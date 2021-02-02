import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import yorkie, { Client, Document } from 'yorkie-js-sdk';
import { AppState } from 'app/rootReducer';

export enum CodeMode {
  PlainText = 'text/plain',
  Go = 'go',
  Javascript = 'javascript',
  Clojure = 'clojure',
  Dart = 'dart',
  Python = 'python',
  Ruby = 'ruby',
  Rust = 'rust',
}

export interface DocState {
  client?: Client;
  doc?: Document;
  mode: CodeMode;
  loading: boolean;
  errorMessage: string;
}

const initialState: DocState = {
  mode: CodeMode.PlainText,
  loading: false,
  errorMessage: '',
};

export const attachDoc = createAsyncThunk<AttachDocResult, AttachDocArgs, { rejectValue: string }>(
  'doc/attach',
  async ({ client, document }, thunkApi) => {
    try {
      await client.activate();
      await client.attach(document);

      document.update((root: any) => {
        if (!root.content) {
          root.createText('content');
        }
      });
      await client.sync();
      return { document, client };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

// If it manages multiple documents, separate the client and document
export const detachDoc = createAsyncThunk<Object, undefined, { rejectValue: string }>(
  'doc/detach',
  async (_: undefined, thunkApi) => {
    try {
      const { docState } = thunkApi.getState() as AppState;
      const { client, doc } = docState;

      if (client && doc) {
        await client.detach(doc);
        await client.deactivate();
      }

      return {};
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
    createClient(state) {
      const client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`);
      state.client = client;
    },
    createDocument(state, action: PayloadAction<string>) {
      const document = yorkie.createDocument('codepairs', action.payload);
      state.doc = document;
    },
    attachDocLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCodeMode(state, action: PayloadAction<CodeMode>) {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(attachDoc.fulfilled, (state, { payload }) => {
      state.doc = payload.document;
      state.client = payload.client;
    });
    builder.addCase(attachDoc.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
  },
});

export const { createClient, createDocument, attachDocLoading, setCodeMode } = docSlice.actions;
export default docSlice.reducer;

type AttachDocArgs = { document: Document; client: Client };
type AttachDocResult = { document: Document; client: Client };
