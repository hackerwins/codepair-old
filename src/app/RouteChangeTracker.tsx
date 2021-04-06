import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

export default withRouter(({ history }: RouteComponentProps) => {
  history.listen((location) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });
  return <></>;
});
