import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';

import DocPage from 'pages/DocPage';
import './App.scss';

const history = createBrowserHistory();

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://d287d6df8c6f423189266360055e6ca7@o553194.ingest.sentry.io/5680102',
    release: `yorkie-codepair@${process.env.REACT_APP_GIT_HASH}`,
    integrations: [new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    })],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function App() {
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: menu.theme === Theme.Dark ? 'dark' : 'light',
          primary: {
            main: '#d8b01a',
          },
          secondary: {
            main: '#e6b602',
          },
        },
      }),
    [menu],
  );

  const handleRender = useCallback(() => {
    return <Redirect to={`/${Math.random().toString(36).substring(7)}`} />;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Router history={history}>
        <Switch>
          <Route path="/" exact render={handleRender} />
          <Route path="/:docKey" exact component={DocPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
