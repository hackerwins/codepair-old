import React from 'react';
import { AppState } from 'app/rootReducer';
import { LyingDown } from 'components/icon/LyingDown';
import { StandUp } from 'components/icon/StandUp';
import { toggleInstant } from 'features/navSlices';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@mui/material';

export function Guide() {
  const dispatch = useDispatch();
  const isOver = useSelector((state: AppState) => state.actionState.isOver);
  const navState = useSelector((state: AppState) => state.navState);

  return (
    <Badge
      badgeContent={navState.openInstant ? '✨' : ''}
      color="primary"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      invisible={!navState.openInstant}
      sx={{
        '& .MuiBadge-badge': {
          transform: 'translateY(-25px) translateX(-25px)',
          fontSize: '1.5rem',
          backgroundColor: '#484848',
          color: 'white',
          width: 36,
          height: 36,
          borderRadius: '50%',
          boxShadow: '-1px -1px 0.5rem 0 #484848',
        },
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          zIndex: 1000,
          cursor: 'pointer',
        }}
        role="button"
        tabIndex={-1}
        onClick={() => {
          dispatch(toggleInstant());
        }}
      >
        {isOver ? <LyingDown /> : <StandUp />}
      </div>
    </Badge>
  );
}
