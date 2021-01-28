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

const initialState: SettingState = {
  menu: {
    codeMode: CodeMode.Go,
    codeTheme: CodeTheme.Monokai,
    codeKeyMap: CodeKeyMap.Sublime,
    tabSize: TabSize.Two,
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
      state.menu. codeKeyMap = action.payload;
    },

    setTabSize(state, action: PayloadAction<TabSize>) {
      state.menu. tabSize = action.payload;
    },
  },
});

export const { setCodeMode, setCodeTheme, setCodeKeyMap, setTabSize } = settingSlice.actions;
export default settingSlice.reducer;
