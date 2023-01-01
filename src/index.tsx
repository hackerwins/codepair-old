import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga4';
import App from 'app/App';
import store from 'app/store';

import * as serviceWorker from 'serviceWorker';
import './index.scss';

const trackingCode = `${process.env.REACT_APP_GOOGLE_ANALYTICS}`;
if (trackingCode) {
  ReactGA.initialize(trackingCode);
}

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
