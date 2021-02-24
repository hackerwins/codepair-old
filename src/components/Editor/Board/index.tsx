import React from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import Sidebar from './Sidebar';
import Content from './Content';
import './index.css';

const SIDEBAR_WIDTH = '40px';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    sidebar: {
      width: SIDEBAR_WIDTH,
      border: `1px solid ${grey[700]}`,
    },
    content: {
      borderTop: `1px solid ${grey[700]}`,
      width: `calc( 100% - ${SIDEBAR_WIDTH} )`,
    },
  }),
);

export default function Board() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.content}>
        <Content />
      </div>
    </div>
  );
}
