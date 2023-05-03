import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BrowserStorage from 'utils/storage';

export type NavTabType = 'pages' | 'calendar' | 'toc';

export interface NavState {
  openTab: boolean;
  openRecents: boolean;
  openTabValue: NavTabType;
  openInstant: boolean;
  sidebarWidth: number;
}

const NavModel = new BrowserStorage<NavState>('$$codepair$$nav');

const initialNavState: NavState = NavModel.getValue({
  openTab: false,
  openRecents: false,
  openTabValue: 'pages',
  openInstant: false,
  sidebarWidth: 300,
});

const navSlice = createSlice({
  name: 'nav',
  initialState: initialNavState,

  reducers: {
    toggleTab(state) {
      state.openTab = !state.openTab;

      NavModel.setValue(state);
    },
    toggleRecents(state) {
      state.openRecents = !state.openRecents;

      NavModel.setValue(state);
    },
    toggleLinkTab(state, action: PayloadAction<NavTabType>) {
      state.openTabValue = action.payload;

      NavModel.setValue(state);
    },
    toggleInstant(state) {
      state.openInstant = !state.openInstant;

      NavModel.setValue(state);
    },
    setSidebarWidth(state, action: PayloadAction<number>) {
      state.sidebarWidth = action.payload;

      NavModel.setValue(state);
    },
  },
});

export const { setSidebarWidth, toggleTab, toggleLinkTab, toggleInstant, toggleRecents } = navSlice.actions;
export default navSlice.reducer;
