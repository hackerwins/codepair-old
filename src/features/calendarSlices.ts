import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import BrowserStorage from '../utils/storage';

export interface CalendarState {
  selectedDate: string;
}

const CalendarModel = new BrowserStorage<CalendarState>('$$codepair$$calendar');

const initialCalendarState: CalendarState = CalendarModel.getValue({
  selectedDate: dayjs().format('YYYYMMDD'),
});

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: initialCalendarState,

  reducers: {
    updateSelectedDate(state, action: PayloadAction<{ date: string }>) {
      const { date } = action.payload;

      if (!date) {
        return;
      }

      state.selectedDate = date;

      CalendarModel.setValue(state);
    },
  },
});

export const { updateSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;
