import React, { Fragment } from 'react';

import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { LinkItemType, toFlatScheduleForDate } from 'features/linkSlices';
import dayjs from 'dayjs';
import { ListSubheader } from '@mui/material';
import { HeadingItem } from './CustomViewer/HeadingItem';
import { SidebarItemView } from './CustomViewer/SidebarItem';

export function CalendarLinkView() {
  const calendarState = useSelector((state: AppState) => state.calendarState);
  const currentLinks = useSelector(toFlatScheduleForDate(calendarState.selectedDate, calendarState.dateFilter));

  // if (isDateWorkspace(linkState.workspace)) {
  let lastDate = '';

  return (
    <>
      {currentLinks.reverse().map((it) => {
        if (it.type === 'link' && it.linkType === 'heading') {
          return <HeadingItem key={`${it.id}${it.color}`} item={it as LinkItemType} level={0} loopType="date" />;
        }

        const currentDate = dayjs(it.createdAt, 'YYYYMMDDHHmm').format('YYYYMMDD');

        if (lastDate !== currentDate) {
          lastDate = currentDate;
          return (
            <Fragment key={`${it.id}${it.color}`}>
              <ListSubheader
                style={{
                  backgroundColor: 'inherit',
                }}
              >
                {dayjs(it.createdAt, 'YYYYMMDDHHmm').format('YYYY-MM-DD')}
              </ListSubheader>
              <SidebarItemView item={it as LinkItemType} loopType="date" />
            </Fragment>
          );
        }

        return <SidebarItemView key={`${it.id}${it.color}`} item={it as LinkItemType} loopType="date" />;
      })}
    </>
  );
  // }
}
