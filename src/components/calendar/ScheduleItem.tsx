import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { CalendarDate } from 'features/calendarSlices';
import { blue } from '@mui/material/colors';

interface ScheduleItemProps {
  changeDocKey: (docKey: string) => void;
  item: CalendarDate;
}

export function ScheduleItem({ changeDocKey, item }: ScheduleItemProps) {
  const color = item.color || blue[500];
  return (
    <ListItem
      style={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'start',
        padding: '0px 10px',
        margin: '4px 0px',
        marginLeft: -2,

        backgroundColor: color,
        color: 'white',
        boxSizing: 'border-box',
        borderRadius: 4,
        cursor: 'pointer',
      }}
      onClick={() => {
        changeDocKey(item.item.fileLink.split('/').pop() || '');
      }}
    >
      <ListItemAvatar
        style={{
          minWidth: 40,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          fontSize: 30,
        }}
      >
        {item.emoji || '📅'}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {item.name}
          </Typography>
        }
        secondary={item.item.name}
        sx={{
          '& .MuiListItemText-secondary': {
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        style={{
          maxWidth: 190,
        }}
      />
    </ListItem>
  );
}
