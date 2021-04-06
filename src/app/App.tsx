import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';

import DocPage from 'pages/DocPage';
import './App.css';

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
      <Router>
        <Route path="/" exact render={handleRender} />
        <Route path="/:docKey" exact component={DocPage} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
