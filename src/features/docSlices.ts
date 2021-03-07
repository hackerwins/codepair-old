import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import yorkie, { Client, Document } from 'yorkie-js-sdk';
import anonymous from 'anonymous-animals-gen';
import randomColor from 'randomcolor';

export enum CodeMode {
  Markdown = 'gfm',
  Go = 'go',
  JavaScript = 'javascript',
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
  client: undefined,
  doc: undefined,
  mode: CodeMode.Markdown,
  loading: true,
  errorMessage: '',
};

export const activateClient = createAsyncThunk<ActivateClientResult, undefined, { rejectValue: string }>(
  'doc/activate',
  async (_: undefined, thunkApi) => {
    try {
      const { name, animal } = anonymous.generate();
      const client = yorkie.createClient(`${process.env.REACT_APP_YORKIE_RPC_ADDR}`, {
        metadata: {
          username: name,
          image: animal,
          color: randomColor(),
        },
      });

      await client.activate();
      return { client };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

export const attachDoc = createAsyncThunk<AttachDocResult, AttachDocArgs, { rejectValue: string }>(
  'doc/attach',
  async ({ client, doc }, thunkApi) => {
    try {
      await client.attach(doc);

      doc.update((root) => {
        // codeEditor
        if (!root.content) {
          root.createText('content');
        }
        // board
        if (!root.shapes) {
          root.shapes = [];
        }
      });
      await client.sync();
      return { doc, client };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
    deactivateClient(state) {
      const { client } = state;
      state.client = undefined;
      client?.deactivate();
    },
    createDocument(state, action: PayloadAction<string>) {
      state.doc = yorkie.createDocument('codepairs', action.payload);
    },
    detachDocument(state) {
      const { doc, client } = state;
      state.doc = undefined;
      client?.detach(doc as Document);
    },
    attachDocLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCodeMode(state, action: PayloadAction<CodeMode>) {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(activateClient.fulfilled, (state, { payload }) => {
      state.client = payload.client;
    });
    builder.addCase(activateClient.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
    builder.addCase(attachDoc.fulfilled, (state, { payload }) => {
      state.doc = payload.doc;
      state.client = payload.client;
    });
    builder.addCase(attachDoc.rejected, (state, { payload }) => {
      state.errorMessage = payload!;
    });
  },
});

export const { deactivateClient, createDocument, detachDocument, attachDocLoading, setCodeMode } = docSlice.actions;
export default docSlice.reducer;

type ActivateClientResult = { client: Client };
type AttachDocArgs = { doc: Document; client: Client };
type AttachDocResult = { doc: Document; client: Client };
