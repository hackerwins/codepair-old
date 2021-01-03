import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import configureStore from 'store/store';
import DocPage from 'pages/DocPage';
import theme from 'theme';

import './App.css';

const store = configureStore();

function App() {
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
