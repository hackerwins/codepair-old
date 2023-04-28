import React from 'react';
import { TabPanel } from '@mui/lab';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { makeStyles } from 'styles/common';
import { HeadingItem } from './HeadingItem';

const useStyles = makeStyles()(() => ({
  root: {
    height: 'calc(100vh - 160px)',
  },
}));

export function HeadingView() {
  const { classes } = useStyles();
  const headings = useSelector((state: AppState) => state.docState.headings);
  const navState = useSelector((state: AppState) => state.navState);
  const { openTabValue } = navState;
  return (
    <TabPanel
      value="toc"
      className={classes.root}
      style={{
        display: openTabValue !== 'toc' ? 'none' : '',
        padding: 10,
      }}
    >
      {headings.map((it) => {
        return <HeadingItem key={it.id} item={it} level={it.level || 0} loopType="links" />;
      })}
    </TabPanel>
  );
}
