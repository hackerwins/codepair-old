import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';

import ReactGA from 'react-ga4';
import App from './app/App';
import store from './app/store';

const trackingCode = `${import.meta.env.VITE_APP_GOOGLE_ANALYTICS}`;
if (trackingCode) {
  ReactGA.initialize(trackingCode);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
