import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum CodeMode {
  Javascript = 'javascript',
  Clojure = 'clojure',
  Dart = 'dart',
  Go = 'go',
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
  TWO = '2',
  FOUR = '4',
  EIGHT = '8',
}

export type MenuKey = 'codeMode' | 'codeTheme' | 'codeKeyMap' | 'tabSize';

export type Menu = {
  [key in MenuKey]: string;
};

export interface SettingState {
  menu: Menu;
}

const initialState: SettingState = {
  menu: {
    codeMode: 'javascript',
    codeTheme: 'monokai',
    codeKeyMap: 'sublime',
    tabSize: '4',
  },
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setCodeMode(state, action: PayloadAction<CodeMode>) {
      state.menu.codeMode = action.payload;
    },

    setCodeTheme(state, action: PayloadAction<CodeTheme>) {
      state.menu. codeTheme = action.payload;
    },

    setCodeKeyMap(state, action: PayloadAction<CodeKeyMap>) {
      state.menu.codeMode = action.payload;
    },

    setTabSize(state, action: PayloadAction<TabSize>) {
      state.menu.codeMode = action.payload;
    },
  },
});

export const { setCodeMode, setCodeTheme, setCodeKeyMap, setTabSize } = settingSlice.actions;
export default settingSlice.reducer;
