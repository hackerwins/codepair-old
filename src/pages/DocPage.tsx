import React from 'react';
import { RouteComponentProps } from 'react-router';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import Toolbar from 'components/Toolbar';
import Editor from 'components/Editor';

type DocPageProps = {
  docKey: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

export default function DocPage(props: RouteComponentProps<DocPageProps>) {
  const classes = useStyles();
  const {
    match: { params },
  } = props;
  const { docKey } = params;

  return (
    <div className={classes.root}>
      <NavBar />
      <Toolbar />
      <Editor docKey={docKey} />
    </div>
  );
}
