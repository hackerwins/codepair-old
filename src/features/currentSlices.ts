import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BrowserStorage from '../utils/storage';

interface CurrentPageState {
  docKey: string;
  recents?: {
    name: string;
    fileLink: string;
    docKey: string;
  }[];
}

const CurrentPageModel = new BrowserStorage<CurrentPageState>('$$codepair$$currentPage');

const currentPagestate: CurrentPageState = CurrentPageModel.getValue({
  docKey: '',
  recents: [],
});

const currentSlice = createSlice({
  name: 'current',
  initialState: currentPagestate,

  reducers: {
    saveLastDocument(state, action: PayloadAction<{ docKey: string }>) {
      CurrentPageModel.setValue({
        ...currentPagestate,
        ...action.payload,
      });
    },
    addRecentPage(
      state,
      action: PayloadAction<{
        docKey?: string;
        page: {
          name: string;
          fileLink: string;
        };
      }>,
    ) {
      const { docKey = '', page } = action.payload;

      if (!page.name) return;
      if (page.fileLink === '/calendar') return;

      let tempDocKey = docKey;
      if (!tempDocKey) {
        tempDocKey = page.fileLink.split('/').slice(1).join('/');
      }

      const foundItem = state.recents?.find((item) => item.fileLink === page.fileLink);

      if (foundItem) {
        return;
      }

      if (!state.recents?.length) {
        state.recents = [];
      }

      state.recents.unshift({
        ...page,
        docKey: tempDocKey,
      });

      state.recents = state.recents.slice(0, 10);

      CurrentPageModel.setValue(state);
    },
    removeCurrentPage(state, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;
      state.recents = state.recents?.filter((item, i) => i !== index) || [];

      CurrentPageModel.setValue(state);
    },
  },
});

export interface LinkListItem {
  id: string;
  name: string;
  fileLink: string;
  depth: number;
}

export function getCurrentPage(docKey: string) {
  return () =>
    CurrentPageModel.getValue({
      docKey,
    });
}

export const { saveLastDocument, addRecentPage, removeCurrentPage } = currentSlice.actions;
export default currentSlice.reducer;
