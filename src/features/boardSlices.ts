import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Tool {
  Line,
}

export interface BoardState {
  isOpen: boolean;

  tool: Tool;
}

const initialBoardState: BoardState = {
  isOpen: false,

  tool: Tool.Line,
};

const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,

  reducers: {
    toggleBoard(state) {
      state.isOpen = !state.isOpen;
    },

    setTool(state, action: PayloadAction<Tool>) {
      state.tool = action.payload;
    },
  },
});

export const { toggleBoard, setTool } = boardSlice.actions;
export default boardSlice.reducer;
