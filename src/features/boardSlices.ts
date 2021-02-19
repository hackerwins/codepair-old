import { createSlice } from '@reduxjs/toolkit';

export interface BoardState {
  isOpen: boolean;
}

const initialBoardState: BoardState = {
  isOpen: true,
};

const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,

  reducers: {
    toggleBoard(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleBoard } = boardSlice.actions;
export default boardSlice.reducer;
