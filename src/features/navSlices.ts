import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NavTabType = 'pages' | 'toc';

export interface NavState {
  openTab: boolean;
  openTabValue: NavTabType;
  openInstant: boolean;
}

const initialNavState: NavState = {
  openTab: false,
  openTabValue: 'pages',
  openInstant: false,
};

const navSlice = createSlice({
  name: 'nav',
  initialState: initialNavState,

  reducers: {
    toggleTab(state) {
      state.openTab = !state.openTab;
    },
    toggleLinkTab(state, action: PayloadAction<NavTabType>) {
      state.openTabValue = action.payload;
    },
    toggleInstant(state) {
      state.openInstant = !state.openInstant;
    },
  },
});

export const { toggleTab, toggleLinkTab, toggleInstant } = navSlice.actions;
export default navSlice.reducer;
