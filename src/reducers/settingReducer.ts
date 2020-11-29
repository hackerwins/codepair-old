import produce from 'immer';

import { SettingActions, SettingActionTypes } from '../actions/settingActions';

export type MenuKey = 'codeMode' | 'codeTheme' | 'codeKeyMap' | 'tabSize';

export type Menu = {
  [key in MenuKey]: string;
};

export interface SettingState {
  menu: Menu;
  isLoading: boolean;
}

const initialState: SettingState = {
  menu: {
    codeMode: 'javascript',
    codeTheme: 'monokai',
    codeKeyMap: 'sublime',
    tabSize: '4',
  },
  isLoading: true, // If network use
};

export const settingReducer = (state = initialState, action: SettingActions) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SettingActionTypes.CODE_MODE: {
        draftState.isLoading = false;
        draftState.menu.codeMode = action.mode;
        return draftState;
      }
      case SettingActionTypes.THEME: {
        draftState.isLoading = false;
        draftState.menu.codeTheme = action.codeTheme;
        return draftState;
      }
      case SettingActionTypes.CODE_KEYMAP: {
        draftState.isLoading = false;
        draftState.menu.codeKeyMap = action.codeKeyMap;
        return draftState;
      }
      case SettingActionTypes.TAB_SIZE: {
        draftState.isLoading = false;
        draftState.menu.tabSize = action.tabSize;
        return draftState;
      }
      default:
        return draftState;
    }
  });
};
