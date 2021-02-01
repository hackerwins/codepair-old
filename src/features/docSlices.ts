import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import yorkie, { Client, Document } from 'yorkie-js-sdk';

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

export const attachDoc = createAsyncThunk<AttachDocResult, string, { rejectValue: string }>(
  'doc/attach',
  async (docKey: string, thunkApi) => {
    try {
      const client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`);
      const document = yorkie.createDocument('codepairs', docKey);

      await client.activate();
      await client.attach(document);

      document.update((root: any) => {
        if (!root.content) {
          root.createText('content');
        }
      });
      return { document, client };
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  },
);

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
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

export const { attachDocLoading, setCodeMode } = docSlice.actions;
export default docSlice.reducer;

type AttachDocResult = { document: Document; client: Client };
