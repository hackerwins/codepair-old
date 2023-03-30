import { TDShape, TDBinding, TDAsset } from '@tldraw/tldraw';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import yorkie, { Client, Document, Text, TimeTicket } from 'yorkie-js-sdk';
import anonymous from 'anonymous-animals-gen';
import randomColor from 'randomcolor';
import { MimeType } from 'constants/editor';
import { Presence } from './peerSlices';
import { SettingState } from './settingSlices';
import { LinkItemType } from './linkSlices';

export enum Preview {
  HTML = 'html',
  Slide = 'slide',
}

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
  color: string;
  points: Array<Point>;
  box: Box;
}

export type Shape = Line | EraserLine | Rect;

export type ShapeType = Shape['type'];

export type CodePairDoc = {
  mimeType: MimeType;
  mode: CodeMode;
  preview: Preview;
  content: Text;
  shapes: Array<Shape>;
  whiteboard?: {
    shapes: {
      [key: string]: TDShape;
    };
    bindings: {
      [key: string]: TDBinding;
    };
    assets: {
      [key: string]: TDAsset;
    };
  };
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
  client?: Client<Presence>;
  doc?: Document<CodePairDoc>;
  mode: CodeMode;
  preview: Preview;
  loading: boolean;
  errorMessage: string;
  status: DocStatus;
  headings: LinkItemType[];
}

const initialState: DocState = {
  mode: CodeMode.Markdown,
  preview: Preview.HTML,
  loading: true,
  errorMessage: '',
  status: DocStatus.Connect,
  headings: [],
};

interface Heading {
  level: number;
  text: string;
  originalText?: string;
}

function generateTableOfContents(editorInstance: CodeMirror.Editor, count = Number.MAX_SAFE_INTEGER): Heading[] {
  const doc = editorInstance.getDoc();
  const lineCount = doc.lineCount();
  const headings = [];

  for (let i = 0; i < lineCount; i += 1) {
    const line = doc.getLine(i);

    // check only header
    const tokens = editorInstance.getTokenTypeAt({ line: i, ch: 1 }) || '';
    if (tokens?.includes('header') === false) continue;

    const match = line.match(/^(#+)\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      headings.push({ level, text, originalText: line });

      if (headings.length >= count) {
        break;
      }
    }
  }

  return headings;
}

export function getTableOfContents(count = Number.MAX_SAFE_INTEGER): Heading[] {
  const cm = document.querySelector('.CodeMirror');

  if (cm) {
    const { CodeMirror } = cm as any;

    return generateTableOfContents(CodeMirror, count);
  }

  return [];
}

export const activateClient = createAsyncThunk<ActivateClientResult, undefined, { rejectValue: string }>(
  'doc/activate',
  async (_: undefined, thunkApi) => {
    try {
      const { name, animal } = anonymous.generate();
      const state: SettingState = (thunkApi.getState() as any).settingState;
      const { userName, userColor } = state.menu;
      const options = {
        apiKey: '',
        presence: {
          username: userName || name,
          image: animal,
          color: userColor || randomColor(),
          board: '',
        },
      };

      if (`${import.meta.env.VITE_APP_YORKIE_API_KEY}`) {
        options.apiKey = `${import.meta.env.VITE_APP_YORKIE_API_KEY}`;
      }

      const client = new yorkie.Client(`${import.meta.env.VITE_APP_YORKIE_RPC_ADDR}`, options);

      await client.activate();
      return { client };
    } catch (err) {
      return thunkApi.rejectWithValue((err as Error).message);
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
          root.content = new yorkie.Text();
        }
        // board
        if (!root.shapes) {
          root.shapes = [];
        }
      });
      await client.sync();
      (doc as any).attached = true;
      return { doc, client };
    } catch (err) {
      return thunkApi.rejectWithValue((err as Error).message);
    }
  },
);

export const createDoc = createAsyncThunk<boolean, CreateDocArgs, { rejectValue: string }>(
  'doc/create',
  async ({ client, docKey, init }, thunkApi) => {
    try {
      const doc = new yorkie.Document<CodePairDoc>(docKey);
      await client.attach(doc);

      if (init) {
        await doc.update(init);
      }

      await client.detach(doc);

      return true;
    } catch (err) {
      return thunkApi.rejectWithValue((err as Error).message);
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
      const { doc } = state;

      if (doc) {
        state.client?.detach(doc);
      }

      state.doc = new yorkie.Document<CodePairDoc>(`codepairs-${action.payload}`);
    },
    detachDocument(state) {
      const { doc, client } = state;
      client?.detach(doc as Document<CodePairDoc>);
      state.doc = undefined;
    },
    attachDocLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCodeMode(state, action: PayloadAction<CodeMode>) {
      state.mode = action.payload;
    },
    setPreview(state, action: PayloadAction<Preview>) {
      state.preview = action.payload;
    },
    setStatus(state, action: PayloadAction<DocStatus>) {
      state.status = action.payload;
    },

    updateHeadings(state) {
      state.headings = getTableOfContents().map((it, index) => {
        return {
          type: 'link',
          id: `heading-#${encodeURIComponent(it.originalText || '')}-${index}`,
          name: it.text,
          level: it.level - 1,
          fileLink: `${window.location.pathname}#${encodeURIComponent(it.originalText || '')}`,
          linkType: 'heading',
        } as LinkItemType;
      });
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
  setPreview,
  setCodeMode,
  setStatus,
  updateHeadings,
} = docSlice.actions;
export default docSlice.reducer;

type ActivateClientResult = { client: Client<Presence> };
type AttachDocArgs = { doc: Document<CodePairDoc>; client: Client<Presence> };
type CreateDocArgs = { docKey: string; client: Client<Presence>; init?: (root: CodePairDoc) => void };
type AttachDocResult = { doc: Document<CodePairDoc>; client: Client<Presence> };
