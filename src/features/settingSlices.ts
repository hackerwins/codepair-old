import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BrowserStorage from 'utils/storage';

export enum Theme {
  Dark = 'dark',
  Light = 'light',
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

export type MenuKey = 'theme' | 'codeKeyMap' | 'tabSize';

export type Menu = Record<MenuKey, string>;

export interface SettingState {
  menu: Menu;
}

const SettingModel = new BrowserStorage<SettingState>('$$codepair$$setting');

const initialState: SettingState = SettingModel.getValue({
  menu: {
    theme: Theme.Light,
    codeKeyMap: CodeKeyMap.Sublime,
    tabSize: TabSize.Two,
  },
});

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.menu.theme = action.payload ? Theme.Dark : Theme.Light;
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

export const { setDarkMode, setCodeKeyMap, setTabSize } = settingSlice.actions;
export default settingSlice.reducer;
