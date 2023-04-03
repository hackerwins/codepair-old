import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as dayjs from 'dayjs';
import { AppState } from '../app/rootReducer';
import BrowserStorage from '../utils/storage';

export interface CalendarDate {
  date: string; // YYYYMMDDHH24MI
  end?: string;
  name: string;
  color?: string;
  emoji?: string;
  item: {
    fileLink: string;
    name: string;
  };
  id: string;
}

export interface CalendarState {
  selectedDate: string;
  schedules: CalendarDate[];
}

const CalendarModel = new BrowserStorage<CalendarState>('$$codepair$$calendar');

const initialCalendarState: CalendarState = CalendarModel.getValue({
  schedules: [],
  selectedDate: dayjs().format('YYYYMMDD'),
});

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: initialCalendarState,

  reducers: {
    refreshCalendarStorage(state) {
      const newValue = CalendarModel.getValue(state);

      state.schedules = newValue.schedules;
    },

    addSchedule(
      state,
      action: PayloadAction<{
        date: string;
        end?: string;
        name: string;
        color: string;
        emoji?: string;
        item: {
          fileLink: string;
          name: string;
        };
      }>,
    ) {
      const { date } = action.payload;

      if (!date) {
        return;
      }

      const { schedules } = state;

      schedules.push({
        id: `${Date.now()}`,
        ...action.payload,
      });

      CalendarModel.setValue(state);
    },
    updateSchedule(state, action: PayloadAction<{ id: string; name: string }>) {
      const { id, name } = action.payload;

      if (!id) {
        return;
      }

      const { schedules } = state;

      const index = schedules.findIndex((item) => item.id === id);

      if (index < 0) {
        return;
      }

      schedules[index].name = name;

      CalendarModel.setValue(state);
    },
    deleteSchedule(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;

      if (!id) {
        return;
      }

      const { schedules } = state;

      const index = schedules.findIndex((item) => item.id === id);

      if (index < 0) {
        return;
      }

      schedules.splice(index, 1);

      CalendarModel.setValue(state);
    },
    updateScheduleItem(
      state,
      action: PayloadAction<{
        id: string;
        item: {
          fileLink: string;
          name: string;
        };
      }>,
    ) {
      const { id, item } = action.payload;

      if (!id) {
        return;
      }

      const { schedules } = state;

      const index = schedules.findIndex((it) => it.id === id);

      if (index < 0) {
        return;
      }

      schedules[index].item = item;

      CalendarModel.setValue(state);
    },

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

export function getCalendarDate(state: AppState) {
  return state.calendarState.schedules;
}

export function getCalendarDateByDate(date: string) {
  return function (state: AppState) {
    return state.calendarState.schedules
      .filter((item) => item.date.startsWith(date))
      .sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        } else if (a.date < b.date) {
          return -1;
        } else {
          return 0;
        }
      });
  };
}

export const {
  addSchedule,
  updateSchedule,
  deleteSchedule,
  updateScheduleItem,
  refreshCalendarStorage,
  updateSelectedDate,
} = calendarSlice.actions;
export default calendarSlice.reducer;
