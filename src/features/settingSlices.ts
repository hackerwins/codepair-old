import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BrowserStorage from 'utils/storage';

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

export type MenuKey = 'codeTheme' | 'codeKeyMap' | 'tabSize';

export type Menu = {
  [key in MenuKey]: string;
};

export interface SettingState {
  menu: Menu;
}

const SettingModel = new BrowserStorage<SettingState>('$$codepair$$setting');

const initialState: SettingState = SettingModel.getValue({
  menu: {
    codeTheme: CodeTheme.Monokai,
    codeKeyMap: CodeKeyMap.Sublime,
    tabSize: TabSize.Two,
  },
});

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {

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

export const { setCodeTheme, setCodeKeyMap, setTabSize } = settingSlice.actions;
export default settingSlice.reducer;
