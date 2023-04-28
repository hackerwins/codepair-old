import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActionState {
  isOver: boolean;
}

const initialActionState: ActionState = {
  isOver: false,
};

const actionSlice = createSlice({
  name: 'action',
  initialState: initialActionState,

  reducers: {
    setActionStatus(state, action: PayloadAction<{ isOver: boolean }>) {
      const { isOver } = action.payload;

      state.isOver = isOver;
    },
  },
});

export const { setActionStatus } = actionSlice.actions;
export default actionSlice.reducer;
