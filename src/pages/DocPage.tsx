import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import Editor from 'components/Editor';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';

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
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const classes = useStyles();
  const location = useLocation();
  const {
    match: { params },
  } = props;
  const { docKey } = params;

  useEffect(() => {
    if (`${process.env.REACT_APP_GOOGLE_ANALYTICS}`) {
      ReactGA.send('pageview');
    }
  }, [location]);

  return (
    <div className={classes.root} data-theme={menu.theme}>
      <NavBar />
      <Editor docKey={docKey} />
    </div>
  );
}
