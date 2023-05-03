import React, { useCallback } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { makeStyles } from 'styles/common';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { updateSelectedDate } from 'features/calendarSlices';
import { blue } from '@mui/material/colors';
import { toFlatScheduleForDate } from 'features/linkSlices';
import { Theme } from 'features/settingSlices';

const useStyles = makeStyles()((theme) => ({
  calendar: {
    width: 310,

    borderRadius: 4,
    '& .MuiPickersCalendarHeader-root': {
      marginTop: 0,
    },
    '& .MuiPickersSlideTransition-root': {
      minHeight: 250,
    },
  },
  day: {
    borderRadius: 8,
    '&:not(.MuiPickersDay-dayOutsideMonth)': {
      fontWeight: 900,
      // border: theme.palette.mode === Theme.Dark ? '1px solid #595959' : '1px solid rgba(0, 0, 0, 0.12)',
    },

    '&.MuiPickersDay-daySelected': {
      backgroundColor: blue[500],
      color: '#fff',
    },

    '&.MuiPickersDay-today': {
      border: 0,
      backgroundColor: theme.palette.mode === Theme.Dark ? '#555555' : '#fff',
    },

    '&.MuiPickersDay-dayDisabled': {
      color: '#ccc',
    },
  },
  colorList: {
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateY(-50%)',

    filter: theme.palette.mode === Theme.Dark ? 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5))' : '',
  },
}));

function ScheduleDay(props: PickersDayProps<Dayjs>) {
  const { day, outsideCurrentMonth, ...other } = props;

  const dateString = day.format('YYYYMMDD');
  const list = useSelector(toFlatScheduleForDate(dateString, 'day')).map((it) => it.color);
  const { classes } = useStyles();

  return (
    <div key={day.toString()}>
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} className={classes.day} />
      <div
        className={classes.colorList}
        style={{
          marginLeft: Math.min(list.length, 4) * -1,
        }}
      >
        {list
          .filter((_, index) => index < 4)
          .map((color, index) => {
            const key = `${color || 'default'}-${index}`;
            return (
              <div
                key={key}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 4,
                  backgroundColor: color || blue[500],
                  marginRight: 1,
                  boxSizing: 'border-box',
                }}
              />
            );
          })}
      </div>
    </div>
  );
}

export default function BasicCalendar() {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: AppState) => state.calendarState.selectedDate);

  const { classes } = useStyles();

  const updateCalendarDate = useCallback(
    (date: string) => {
      dispatch(updateSelectedDate({ date }));
    },
    [dispatch],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6}
        value={dayjs(selectedDate, 'YYYYMMDD')}
        className={classes.calendar}
        onChange={(newValue: any) => {
          updateCalendarDate(newValue.format('YYYYMMDD'));
        }}
        onMonthChange={(newValue: any) => {
          updateCalendarDate(newValue.format('YYYYMM01'));
        }}
        slots={{
          day: ScheduleDay,
        }}
      />
    </LocalizationProvider>
  );
}
