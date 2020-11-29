export enum SettingActionTypes {
  CODE_MODE = 'CODE_MODE',
  CODE_KEYMAP = 'CODE_KEYMAP',
  THEME = 'THEME',
  TAB_SIZE = 'TAB_SIZE',
}

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

/**
 * Set Code mode
 */
export interface SettingCodeModeAction {
  type: SettingActionTypes.CODE_MODE;
  mode: CodeMode;
}

export interface SettingCodeModeAction {
  type: SettingActionTypes.CODE_MODE;
  mode: CodeMode;
}

export const SetCodeMode = (mode: CodeMode): SettingCodeModeAction => ({
  type: SettingActionTypes.CODE_MODE,
  mode,
});

/**
 * Set CodeTheme
 */
export interface SettingCodeThemeAction {
  type: SettingActionTypes.THEME;
  codeTheme: CodeTheme;
}

export const SetCodeTheme = (codeTheme: CodeTheme): SettingCodeThemeAction => ({
  type: SettingActionTypes.THEME,
  codeTheme,
});

/**
 * Set CodeKeyMap
 */
export interface SettingCodeKeyMapAction {
  type: SettingActionTypes.CODE_KEYMAP;
  codeKeyMap: CodeKeyMap;
}

export const SetCodeKeyMap = (codeKeyMap: CodeKeyMap): SettingCodeKeyMapAction => ({
  type: SettingActionTypes.CODE_KEYMAP,
  codeKeyMap,
});

/**
 * Set TabSize
 */
export interface SettingTabSizeAction {
  type: SettingActionTypes.TAB_SIZE;
  tabSize: TabSize;
}

export const SetTabSize = (tabSize: TabSize): SettingTabSizeAction => ({
  type: SettingActionTypes.TAB_SIZE,
  tabSize,
});

export type SettingActions =
  | SettingCodeModeAction
  | SettingCodeThemeAction
  | SettingCodeKeyMapAction
  | SettingTabSizeAction;
