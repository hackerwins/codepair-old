import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { AppState } from 'app/rootReducer';
import Editor from 'components/Editor';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import BasicCalendar from 'components/calendar/BasicCalendar';
import { getCalendarDateByDate, refreshCalendarStorage } from 'features/calendarSlices';
import { TimelineList } from 'components/calendar/TimelineList';
import { TimelineDialog } from 'components/calendar/TimelineDialog';
import PageLayout from './PageLayout';

const useStyles = makeStyles()((theme) => {
  return {
    timeline: {
      flex: 'none',
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderRight: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    },
    calendarArea: {
      flex: 'none',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderBottom: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
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
    currentEditorArea: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
  };
});

export default function CalendarPage() {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: AppState) => state.calendarState.selectedDate);
  const schedules = useSelector(getCalendarDateByDate(selectedDate));
  const newDocKey = schedules[schedules.length - 1]?.item.fileLink.split('/').slice(1).join('/') || '';
  const [open, setOpen] = useState(false);
  const { classes } = useStyles();
  const [docKey, setDocKey] = useState<string>(newDocKey);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    window.addEventListener('storage', () => {
      dispatch(refreshCalendarStorage());
    });
  }, [dispatch]);

  return (
    <PageLayout>
      <div
        style={{
          display: 'flex',
          height: `calc(100vh - 64px)`,
        }}
      >
        <div className={classes.timeline}>
          <div className={classes.calendarArea}>
            <BasicCalendar />
          </div>
          <div className={classes.timelineList}>
            <TimelineList
              changeDocKey={(currentDocKey: string) => {
                setDocKey(currentDocKey);
              }}
            />
          </div>
        </div>
        <div className={classes.currentEditorArea}>
          {docKey === '' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                fontSize: 20,
                color: 'rgba(0, 0, 0, 0.54)',
              }}
            >
              <div>
                <div>Click the calendar to select a date.</div>
                <div>
                  <Button onClick={handleOpen}>Add timeline</Button>
                  {open ? <TimelineDialog open={open} selectedDateTime="" handleClose={handleClose} /> : undefined}
                </div>
              </div>
            </div>
          ) : (
            <Editor key={docKey} docKey={docKey} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
