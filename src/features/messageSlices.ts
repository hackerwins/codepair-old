import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MessageState {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  open?: boolean;
}

const initialMessageState: MessageState = {
  type: 'error',
  message: '',
  open: false,
};

const messageSlice = createSlice({
  name: 'message',
  initialState: initialMessageState,

  reducers: {
    showMessage(state, action: PayloadAction<MessageState>) {
      const { payload } = action;

      state.type = payload.type || 'error';
      state.message = payload.message;
      state.open = true;
    },
    hideMessage(state) {
      state.open = false;
    },
  },
});

export const { showMessage, hideMessage } = messageSlice.actions;
export default messageSlice.reducer;
