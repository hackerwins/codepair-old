import React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';

import BasicCalendar from 'components/calendar/BasicCalendar';
import { makeStyles } from 'styles/common';
import { Theme } from 'features/settingSlices';
import { CalendarLinkView } from '../CalendarLinkView';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 160px)',
    // gap: 8,
  },
  list: {
    flex: '1 1 auto',
    overflow: 'auto',

    padding: '0px 20px',
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
    padding: 10,
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
  const { classes } = useStyles();

  const navState = useSelector((state: AppState) => state.navState);
  const { openTabValue } = navState;
  return (
    <TabPanel
      value="calendar"
      className={classes.root}
      style={{
        display: openTabValue !== 'calendar' ? 'none' : '',
      }}
    >
      <div className={classes.timeline}>
        <div className={classes.calendarArea}>
          <BasicCalendar />
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
