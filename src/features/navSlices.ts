import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NavTabType = 'notes' | 'toc';

export interface NavState {
  openTab: boolean;
  openTabValue: NavTabType;
}

const initialNavState: NavState = {
  openTab: false,
  openTabValue: 'notes',
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
  },
});

export const { toggleTab, toggleLinkTab } = navSlice.actions;
export default navSlice.reducer;
