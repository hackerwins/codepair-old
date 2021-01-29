import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import rootReducer, { AppState } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['doc/attach/fulfilled'],
      ignoredPaths: ['docState.client', 'docState.doc'],
    },
    immutableCheck: {
      ignoredPaths: ['docState.client', 'docState.doc'],
    },
  }),
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

export default store;
