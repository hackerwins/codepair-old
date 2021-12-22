import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const SCREEN_PADDING = 8;

type Screen = {
  userScreenWidth: number;
  userScreenHeight: number;
  drawBoardScreenWidth: number;
  drawBoardScreenHeight: number;
};

const initialState: Screen = {
  userScreenWidth: 0,
  userScreenHeight: 0,
  drawBoardScreenWidth: 0,
  drawBoardScreenHeight: 0,
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setUserScreenWidth(state, action: PayloadAction<number>) {
      state.userScreenWidth = action.payload;

      if (state.drawBoardScreenWidth < action.payload) {
        state.drawBoardScreenWidth = action.payload;
      }
    },
    setUserScreenHeight(state, action: PayloadAction<number>) {
      state.userScreenHeight = action.payload;

      if (state.drawBoardScreenHeight < action.payload) {
        state.drawBoardScreenHeight = action.payload;
      }
    },

    setDrawBoardWidth(state, action: PayloadAction<number>) {
      if (state.userScreenWidth >= action.payload) {
        return;
      }

      state.drawBoardScreenWidth = action.payload;
    },
    setDrawBoardHeight(state, action: PayloadAction<number>) {
      if (state.userScreenHeight >= action.payload) {
        return;
      }

      state.drawBoardScreenHeight = action.payload;
    },

    setCodeMirrorHeight(state, action: PayloadAction<number>) {
      if (state.drawBoardScreenHeight < action.payload) {
        state.drawBoardScreenHeight = action.payload;
      }
    },
  },
});

export const {
  setUserScreenWidth,
  setUserScreenHeight,
  setDrawBoardWidth,
  setDrawBoardHeight,
  setCodeMirrorHeight,
} = screenSlice.actions;
export default screenSlice.reducer;
