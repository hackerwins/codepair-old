import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
  useLocation,
  useNavigationType,
  matchRoutes,
} from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Theme } from 'features/settingSlices';
import DocPage from 'pages/DocPage';
import CalendarPage from 'pages/CalendarPage';
import { EmptyPage } from 'pages/EmptyPage';
import { NewPage } from 'pages/NewPage';
import { AppState } from './rootReducer';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: `${import.meta.env.VITE_APP_SENTRY_DSN}`,
    release: `codepair@${import.meta.env.VITE_APP_GIT_HASH}`,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <EmptyPage />,
  },
  {
    path: '/new',
    element: <NewPage />,
  },
  {
    path: '/calendar',
    element: <CalendarPage />,
  },
  {
    path: '/:docKey',
    element: <DocPage />,
  },
]);

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
});

function createUserThemeColor(colorType: string) {
  if (colorType === 'mui') {
    return {};
  }

  return {
    primary: {
      main: 'rgb(253, 196, 51)',
    },
    secondary: {
      main: '#e6b602',
    },
  };
}

function App() {
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: menu.theme === Theme.Dark ? 'dark' : 'light',
          ...createUserThemeColor(menu.userThemeColor || 'yorkie'),
        },
      }),
    [menu],
  );

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
