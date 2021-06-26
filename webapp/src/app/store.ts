import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['doc/attach/fulfilled', 'doc/activate/fulfilled'],
      ignoredPaths: ['docState.client', 'docState.doc'],
    },
    immutableCheck: {
      ignoredPaths: ['docState.client', 'docState.doc'],
    },
  }),
});

export default store;
