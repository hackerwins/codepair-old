import React from 'react';
import { ListItemButton, ListItemText, Typography } from '@mui/material';
import { CalendarDate } from 'features/calendarSlices';
import invert from 'invert-color';
import { blue } from '@mui/material/colors';

interface ScheduleItemProps {
  changeDocKey: (docKey: string) => void;
  item: CalendarDate;
}

export function ScheduleItem({ changeDocKey, item }: ScheduleItemProps) {
  const color = item.color || blue[500];
  return (
    <ListItemButton
      style={{
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
        justifyContent: 'center',
        // gap: 8,
        padding: '4px 10px',
        margin: '4px 4px',
        backgroundColor: color,
        color: 'white',
        boxSizing: 'border-box',
        borderRadius: 4,
      }}
      onClick={() => {
        changeDocKey(item.item.fileLink.split('/').pop() || '');
      }}
    >
      <Typography
        style={{
          color: invert(color, true),
        }}
      >
        {item.name}
      </Typography>
      <ListItemText
        secondary={item.item.name}
        sx={{
          '& .MuiListItemText-secondary': {
            color: invert(color, true),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        style={{
          maxWidth: 220,
        }}
      />
    </ListItemButton>
  );
}
