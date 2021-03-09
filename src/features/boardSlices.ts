import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Tool {
  None,
  Line,
  Eraser,
}

export interface BoardState {
  isOpen: boolean;

  tool: Tool;
}

const initialBoardState: BoardState = {
  isOpen: false,

  tool: Tool.None,
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
