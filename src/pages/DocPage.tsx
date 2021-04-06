import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
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
  const location = useLocation();
  const {
    match: { params },
  } = props;
  const { docKey } = params;

  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, [location]);

  return (
    <div className={classes.root}>
      <NavBar />
      <Toolbar />
      <Editor docKey={docKey} />
    </div>
  );
}
