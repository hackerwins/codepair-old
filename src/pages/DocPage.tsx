import React from 'react';
import { RouteComponentProps } from 'react-router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import NavBar from '../components/NavBar';
import CodeEditor from '../components/CodeEditor';

type DocPageProps = {
  docKey: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

export default function DocPage(props: RouteComponentProps<DocPageProps>) {
  const classes = useStyles();
  const docKey = props.match.params.docKey;

  return (
    <div className={classes.root}>
      <NavBar />
      <CodeEditor docKey={docKey} />
    </div>
  );
}
