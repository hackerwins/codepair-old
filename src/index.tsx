import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from 'app/App';
import store from 'app/store';

import * as serviceWorker from 'serviceWorker';
import 'scss/global.scss';

ReactGA.initialize('UA-42438082-5');

Sentry.init({
  dsn: 'https://d287d6df8c6f423189266360055e6ca7@o553194.ingest.sentry.io/5680102',
  release: `yorkie-codepair@${process.env.REACT_APP_GIT_HASH}`,
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
