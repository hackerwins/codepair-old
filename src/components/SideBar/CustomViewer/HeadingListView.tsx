import React from 'react';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { HeadingItem } from './HeadingItem';

export function HeadingListView() {
  const headings = useSelector((state: AppState) => state.docState.headings);
  return (
    <div>
      {headings.map((it) => {
        return <HeadingItem key={it.id} item={it} level={it.level || 0} loopType="links" />;
      })}
    </div>
  );
}
