import { names, uniqueNamesGenerator } from 'unique-names-generator';
import randomColor from 'randomcolor';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BrowserStorage from '../utils/storage';

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

export type MenuKey = 'theme' | 'codeKeyMap' | 'tabSize' | 'userID' | 'userName' | 'userColor' | 'userThemeColor';

export type Menu = Record<MenuKey, string>;

export interface SettingState {
  menu: Menu;
}

const SettingModel = new BrowserStorage<SettingState>('$$codepair$$setting');

const prefersDark: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const randomName = uniqueNamesGenerator({
  dictionaries: [names],
});

const initialState: SettingState = SettingModel.getValue({
  menu: {
    theme: prefersDark ? Theme.Dark : Theme.Light,
    codeKeyMap: CodeKeyMap.Sublime,
    tabSize: TabSize.Two,
    userID: '',
    userName: randomName,
    userColor: randomColor(),
    userThemeColor: 'yorkie',
  },
});

if (initialState.menu.userName === '') {
  initialState.menu.userName = randomName;
}

if (initialState.menu.userColor === '') {
  initialState.menu.userColor = randomColor();
}

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
    setUserID(state, action: PayloadAction<string>) {
      state.menu.userID = action.payload;
      SettingModel.setValue(state);
    },
    setUserName(state, action: PayloadAction<string>) {
      state.menu.userName = action.payload;
      SettingModel.setValue(state);
    },
    setUserColor(state, action: PayloadAction<string>) {
      state.menu.userColor = action.payload;
      SettingModel.setValue(state);
    },
    setUserThemeColor(state, action: PayloadAction<string>) {
      state.menu.userThemeColor = action.payload;
      SettingModel.setValue(state);
    },
  },
});

export const { setDarkMode, setCodeKeyMap, setTabSize, setUserID, setUserName, setUserColor, setUserThemeColor } =
  settingSlice.actions;
export default settingSlice.reducer;
