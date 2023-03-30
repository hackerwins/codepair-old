import React from 'react';
import { TabPanel } from '@mui/lab';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { HeadingItem } from './HeadingItem';

export function HeadingView() {
  const headings = useSelector((state: AppState) => state.docState.headings);
  return (
    <TabPanel value="toc">
      {headings.map((it) => {
        return <HeadingItem key={it.id} item={it} level={it.level || 0} loopType="links" />;
      })}
    </TabPanel>
  );
}
