import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
    },
  }),
);

export default function Content() {
  const classes = useStyles();

  return <div className={classes.root}>Content</div>;
}
