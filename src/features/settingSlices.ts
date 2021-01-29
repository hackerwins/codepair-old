import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BrowserStorage from 'utils/storage';

export enum CodeMode {
  Go = 'go',
  Javascript = 'javascript',
  Clojure = 'clojure',
  Dart = 'dart',
  Python = 'python',
  Ruby = 'ruby',
  Rust = 'rust',
}

export enum CodeTheme {
  Material = 'material',
  Monokai = 'monokai',
}

export enum CodeKeyMap {
  Sublime = 'sublime',
  Vim = 'vim',
  Emacs = 'emacs',
}

export enum TabSize {
  Two = '2',
  Four = '4',
  Eight = '8',
}

export type MenuKey = 'codeMode' | 'codeTheme' | 'codeKeyMap' | 'tabSize';

export type Menu = {
  [key in MenuKey]: string;
};

export interface SettingState {
  menu: Menu;
}

const SettingModel = new BrowserStorage<SettingState>('$$codepair$$setting');

// TODO(hackerwins): We need to store code mode in the document, not the user's local storage.
const initialState: SettingState = SettingModel.getValue({
  menu: {
    codeMode: CodeMode.Go,
    codeTheme: CodeTheme.Monokai,
    codeKeyMap: CodeKeyMap.Sublime,
    tabSize: TabSize.Two,
  },
});

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setCodeMode(state, action: PayloadAction<CodeMode>) {
      state.menu.codeMode = action.payload;
      SettingModel.setValue(state);
    },

    setCodeTheme(state, action: PayloadAction<CodeTheme>) {
      state.menu.codeTheme = action.payload;
      SettingModel.setValue(state);
    },

    setCodeKeyMap(state, action: PayloadAction<CodeKeyMap>) {
      state.menu.codeKeyMap = action.payload;
      SettingModel.setValue(state);
    },

    setTabSize(state, action: PayloadAction<TabSize>) {
      state.menu.tabSize = action.payload;
      SettingModel.setValue(state);
    },
  },
});

export const { setCodeMode, setCodeTheme, setCodeKeyMap, setTabSize } = settingSlice.actions;
export default settingSlice.reducer;
