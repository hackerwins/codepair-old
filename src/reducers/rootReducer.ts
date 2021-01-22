import { combineReducers } from 'redux';

import docReducer from './docReducer';
import peerReducer from './peerReducer';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
