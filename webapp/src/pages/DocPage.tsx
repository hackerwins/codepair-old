import React, { useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import Editor from 'components/Editor';

type DocPageParams = {
  docKey: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

export default function DocPage() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { docKey } = useParams<DocPageParams>();

  /**
   * @description
   * If user enter location like "/:dockey" only,
   * then should redirect "/:docKey?tabs=0"
   */
  useEffect(() => {
    if (!location.search) history.push(`${docKey}?tab=0`);
  }, []);

  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, [location]);

  return (
    <div className={classes.root}>
      <NavBar />
      <Editor docKey={docKey} />
    </div>
  );
}
