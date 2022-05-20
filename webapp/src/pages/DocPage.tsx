import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
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
    if (`${process.env.REACT_APP_GOOGLE_ANALYTICS}`) {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <NavBar />
      <Editor docKey={docKey} />
    </div>
  );
}
