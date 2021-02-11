import React, { useMemo, useCallback } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import DocPage from 'pages/DocPage';
import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const handleRender = useCallback(() => {
    return <Redirect to={`/${Math.random().toString(36).substring(7)}`} />;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Router>
        <Route path="/" exact render={handleRender} />
        <Route path="/:docKey" exact component={DocPage} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
