import React, { useState } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Divider, Tooltip, Typography, IconButton, List, Switch } from '@mui/material';
import { getCalendarDateByDate } from 'features/calendarSlices';
import { useSelector } from 'react-redux';
import * as dayjs from 'dayjs';
import Add from '@mui/icons-material/Add';
import { AppState } from 'app/rootReducer';
import { TimelineDialog } from './TimelineDialog';
import { ScheduleItem } from './ScheduleItem';

interface TimelineListProps {
  changeDocKey: (docKey: string) => void;
}

const times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  .map((hour) => {
    return [dayjs().hour(hour).minute(0).second(0).millisecond(0).format('HHmm')];
  })
  .flat();

export function TimelineList({ changeDocKey }: TimelineListProps) {
  const selectedDate = useSelector((state: AppState) => state.calendarState.selectedDate);
  const currentTime = dayjs().format('HH') + (dayjs().add(30, 'minute').get('minute') >= 30 ? '30' : '00');
  const schedules = useSelector(getCalendarDateByDate(selectedDate));
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [filtedTimeline, setFiltedTimeline] = useState(false);

  const handleFilterTimeline = () => {
    setFiltedTimeline(!filtedTimeline);
  };

  const handleOpen = (currentSelectedTime: string) => {
    setSelectedTime(currentSelectedTime);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const newTimes = times
    .map((t, index) => {
      const startTime = dayjs(selectedDate + t).format('YYYYMMDDHHmm');
      const endTime = dayjs(selectedDate + times[index + 1]).format('YYYYMMDDHHmm');

      const scheduleList = schedules.filter((s) => {
        const time = dayjs(s.date).format('YYYYMMDDHHmm');
        return time >= startTime && time < endTime;
      });

      if (filtedTimeline) {
        if (scheduleList.length === 0) {
          return;
        }
      }

      return {
        startTime,
        endTime,
        time: t,
        scheduleList,
      };
    })
    .filter(Boolean);
  // .filter((t) => (t?.scheduleList?.length || 0) > 0);

  return (
    <>
      <div
        style={{
          flex: 'none',
          height: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
          // padding: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle2"
            style={{
              padding: '4px 14px',
            }}
          >
            <Switch checked={filtedTimeline} onChange={handleFilterTimeline} name="gilad" />
            {dayjs(selectedDate, 'YYYYMMDD').format('YY.MM.DD')} Timeline
          </Typography>
          <Tooltip title="Add timeline">
            <IconButton
              style={{
                color: 'GrayText',
              }}
              disableRipple
              onClick={() => {
                handleOpen(`${selectedDate}${currentTime}`);
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        </div>

        <Divider />
      </div>
      <div
        style={{
          overflow: 'auto',
        }}
      >
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0,
            },
            paddingRight: 0,
          }}
        >
          {newTimes.map((t) => {
            return (
              <TimelineItem key={t?.startTime}>
                <TimelineOppositeContent
                  style={{
                    padding: 0,
                    marginRight: 8,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase',
                    }}
                  >
                    {dayjs(t?.startTime).format('hh a')}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineContent
                  style={{
                    padding: 0,
                  }}
                >
                  <Divider
                    style={{
                      marginTop: 10,
                    }}
                  />
                  <List
                    dense
                    style={{
                      padding: 0,
                    }}
                  >
                    {t?.scheduleList?.map((s) => {
                      return <ScheduleItem key={s.id} item={s} changeDocKey={changeDocKey} />;
                    })}
                  </List>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
        {open ? <TimelineDialog open={open} selectedDateTime={selectedTime} handleClose={handleClose} /> : undefined}
      </div>
    </>
  );
}
