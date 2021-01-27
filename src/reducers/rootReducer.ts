import { combineReducers } from 'redux';

import docReducer from './docReducer';
import peerReducer from './peerReducer';
import settingReducer from './settingReducer';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  settingState: settingReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
