import React, { useMemo } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import store from 'store/store';
import DocPage from 'pages/DocPage';

import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () => createMuiTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode],
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Router>
          <Route
            path="/"
            exact
            render={() => {
              return <Redirect to={`/${Math.random().toString(36).substring(7)}`} />;
            }}
          />
          <Route path="/:docKey" exact component={DocPage} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
