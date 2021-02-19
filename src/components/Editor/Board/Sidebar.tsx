import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export default function Sidebar() {
  const classes = useStyles();

  return <div className={classes.root}>Sidebar</div>;
}
