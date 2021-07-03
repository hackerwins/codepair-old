import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Color {
  Red = '#d8453c',
  Blue = '#19abbf',
  Green = '#699e3d',
  White = '#cccccc',
  Yellow = '#f3b328',
  Black = '#444',
}

export enum ToolType {
  None,
  Line,
  Eraser,
  Rect,
  Selector,
  Clear,
}

export interface BoardState {
  isOpen: boolean;

  color: Color;
  tool: ToolType;
}

const initialBoardState: BoardState = {
  isOpen: false,

  color: Color.Red,
  tool: ToolType.None,
};

const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,

  reducers: {
    toggleBoard(state) {
      state.isOpen = !state.isOpen;
    },

    setTool(state, action: PayloadAction<ToolType>) {
      state.tool = action.payload;
    },

    setColor(state, action: PayloadAction<Color>) {
      state.color = action.payload;
    },
  },
});

export const { toggleBoard, setTool, setColor } = boardSlice.actions;
export default boardSlice.reducer;
