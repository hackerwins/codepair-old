import React, { useCallback } from 'react';
import { TabPanel } from '@mui/lab';
import { Box, Button, List, ToggleButton, ToggleButtonGroup } from '@mui/material';

import BasicCalendar from 'components/calendar/BasicCalendar';
import { makeStyles } from 'styles/common';
import { useDispatch, useSelector } from 'react-redux';
import { updateDateFilter, updateSelectedDate } from 'features/calendarSlices';
import dayjs from 'dayjs';
import { Theme } from 'features/settingSlices';
import { AppState } from 'app/rootReducer';
import { CalendarLinkView } from '../CalendarLinkView';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // gap: 8,
  },
  list: {
    flex: '1 1 auto',
    overflow: 'auto',
    padding: '0px 10px',
    boxSizing: 'border-box',
  },
  timeline: {
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    // paddingTop: 12,
    // borderRight: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  calendarArea: {
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    // borderBottom: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  timelineList: {
    flex: '1 1 auto',
    overflow: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',

    '& > * ': {
      flex: '1 1 auto',
    },
  },
  filter: {
    height: 40,
    borderRadius: 40,
    backgroundColor: theme.palette.mode === Theme.Dark ? '#555555' : '#fff',
    border: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: 40,
      },
      '&:first-of-type': {
        borderRadius: 40,
      },
    },
  },
  filterButton: {
    padding: '3px 7px',

    '&.Mui-selected': {
      boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',
    },
  },
}));

export function CalendarView() {
  const dispatch = useDispatch();
  const calendarDateFilter = useSelector((state: AppState) => state.calendarState.dateFilter);
  const { classes } = useStyles();

  const updateCalendarDate = useCallback(() => {
    dispatch(updateSelectedDate({ date: dayjs().format('YYYYMMDD') }));
  }, [dispatch]);

  const updateCalendarDateFilter = useCallback(
    (dateFilter: 'day' | 'week' | 'month' | 'year') => {
      dispatch(updateDateFilter({ dateFilter }));
    },
    [dispatch],
  );

  return (
    <TabPanel value="calendar" className={classes.root}>
      <div className={classes.timeline}>
        <div className={classes.calendarArea}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingLeft: '12px',
              paddingRight: '12px',
              '& > *': {
                m: 1,
              },
            }}
          >
            <ToggleButtonGroup
              value={calendarDateFilter}
              size="small"
              exclusive
              aria-label="text alignment"
              className={classes.filter}
              fullWidth
            >
              <ToggleButton
                value="day"
                aria-label="day"
                size="small"
                className={classes.filterButton}
                onClick={() => updateCalendarDateFilter('day')}
              >
                Day
              </ToggleButton>
              <ToggleButton
                value="week"
                aria-label="week"
                size="small"
                className={classes.filterButton}
                onClick={() => updateCalendarDateFilter('week')}
              >
                Week
              </ToggleButton>
              <ToggleButton
                value="month"
                aria-label="month"
                size="small"
                className={classes.filterButton}
                onClick={() => updateCalendarDateFilter('month')}
              >
                Month
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <BasicCalendar />
          <div
            style={{
              display: 'block',
              gap: 8,
              boxSizing: 'border-box',
              padding: '5px 20px',
              width: 310,
              margin: '0 auto',
              textAlign: 'right',
            }}
          >
            <Button size="small" disableElevation variant="contained" onClick={updateCalendarDate}>
              Today
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.list}>
        <List dense>
          <CalendarLinkView />
        </List>
        <Box height={100} />
      </div>
    </TabPanel>
  );
}
