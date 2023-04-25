import { AppState } from 'app/rootReducer';
import { LyingDown } from 'components/icon/LyingDown';
import { StandUp } from 'components/icon/StandUp';
import React from 'react';
import { useSelector } from 'react-redux';

export function Guide() {
  const isOver = useSelector((state: AppState) => state.actionState.isOver);

  return (
    <div
      style={{
        width: 100,
        height: 100,
        zIndex: 1000,
      }}
    >
      {isOver ? <LyingDown /> : <StandUp />}
    </div>
  );
}
