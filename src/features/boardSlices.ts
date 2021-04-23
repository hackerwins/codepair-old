import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Color {
  Red = '#d8453c',
  Blue = '#19abbf',
  Green = '#699e3d',
  White = '#cccccc',
  Yellow = '#f3b328',
  Black = '#444',
}

export enum Tool {
  None,
  Line,
  Eraser,
  Rect,
  Selector,
}

export interface BoardState {
  isOpen: boolean;

  color: Color;
  tool: Tool;
}

const initialBoardState: BoardState = {
  isOpen: false,

  color: Color.Red,
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

    setColor(state, action: PayloadAction<Color>) {
      state.color = action.payload;
    },
  },
});

export const { toggleBoard, setTool, setColor } = boardSlice.actions;
export default boardSlice.reducer;
