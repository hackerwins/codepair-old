import { combineReducers } from 'redux';

import docReducer from 'features/docSlices';
import peerReducer from 'features/peerSlices';
import settingReducer from 'features/settingSlices';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  settingState: settingReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
