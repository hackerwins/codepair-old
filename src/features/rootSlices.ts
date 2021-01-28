import { combineReducers } from 'redux';

import docReducer from './docSlices';
import peerReducer from './peerSlices';
import settingReducer from './settingSlices';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  settingState: settingReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
