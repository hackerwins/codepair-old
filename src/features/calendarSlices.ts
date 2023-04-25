import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import BrowserStorage from '../utils/storage';

export interface CalendarState {
  selectedDate: string;
  dateFilter: 'day' | 'week' | 'month' | 'year';
}

const CalendarModel = new BrowserStorage<CalendarState>('$$codepair$$calendar');

const initialCalendarState: CalendarState = CalendarModel.getValue({
  selectedDate: dayjs().format('YYYYMMDD'),
  dateFilter: 'day',
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

    updateDateFilter(state, action: PayloadAction<{ dateFilter: 'day' | 'week' | 'month' | 'year' }>) {
      const { dateFilter } = action.payload;

      if (!dateFilter) {
        return;
      }

      state.dateFilter = dateFilter;

      CalendarModel.setValue(state);
    },
  },
});

export const { updateSelectedDate, updateDateFilter } = calendarSlice.actions;
export default calendarSlice.reducer;
