import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import yorkie, { Client, DocumentReplica, PlainText, TimeTicket } from 'yorkie-js-sdk';
import anonymous from 'anonymous-animals-gen';
import randomColor from 'randomcolor';
import { Metadata } from 'features/peerSlices';

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

export type Point = {
  y: number;
  x: number;
};

export interface Box {
  y: number;
  x: number;
  width: number;
  height: number;
}

// TODO(ppeeou): refer to yorkie-sdk-js ArrayProxy
export interface BaseShape {
  type: string;
  getID(): TimeTicket;
}

export interface Line extends BaseShape {
  type: 'line';
  color: string;
  points: Array<Point>;
}

export interface EraserLine extends BaseShape {
  type: 'eraser';
  points: Array<Point>;
}

export interface Rect extends BaseShape {
  type: 'rect';
  points: Array<Point>;
  box: Box;
}

export type Shape = Line | EraserLine | Rect;

export type ShapeType = Shape['type'];

export type CodePairDoc = {
  mode: CodeMode;
  content: PlainText;
  shapes: Array<Shape>;
};

// TODO(ppeeou): refer to yorkie-sdk-js ArrayProxy
export interface Shapes {
  push(shape: Shape): number;

  getLast(): Shape;
  getElementByID(createdAt: TimeTicket): Shape;
  deleteByID(createdAt: TimeTicket): Shape;
  length: number;
  [index: number]: Shape;
  [Symbol.iterator](): IterableIterator<Shape>;
}

//  TODO(ppeeou) refer to yorkie-sdk-js JSONObject
export interface Root {
  shapes: Shapes & Array<Shape>;
}

export enum DocStatus {
  Disconnect = 'disconnect',
  Connect = 'connect',
}

export interface DocState {
  client?: Client<Metadata>;
  doc?: DocumentReplica<CodePairDoc>;
  mode: CodeMode;
  loading: boolean;
  errorMessage: string;
  status: DocStatus;
}

const initialState: DocState = {
  mode: CodeMode.Markdown,
  loading: true,
  errorMessage: '',
  status: DocStatus.Connect,
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
          board: '',
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
      state.doc = yorkie.createDocument<CodePairDoc>('codepairs', action.payload);
    },
    detachDocument(state) {
      const { doc, client } = state;
      state.doc = undefined;
      client?.detach(doc as DocumentReplica<CodePairDoc>);
    },
    attachDocLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCodeMode(state, action: PayloadAction<CodeMode>) {
      state.mode = action.payload;
    },
    setStatus(state, action: PayloadAction<DocStatus>) {
      state.status = action.payload;
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

export const {
  deactivateClient,
  createDocument,
  detachDocument,
  attachDocLoading,
  setCodeMode,
  setStatus,
} = docSlice.actions;
export default docSlice.reducer;

type ActivateClientResult = { client: Client<Metadata> };
type AttachDocArgs = { doc: DocumentReplica<CodePairDoc>; client: Client<Metadata> };
type AttachDocResult = { doc: DocumentReplica<CodePairDoc>; client: Client<Metadata> };
