import { combineReducers } from 'redux';

import docReducer from 'features/docSlices';
import peerReducer from 'features/peerSlices';
import settingReducer from 'features/settingSlices';
import boardReducer from 'features/boardSlices';
import screenReducer from 'features/screenSlice';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  settingState: settingReducer,
  boardState: boardReducer,
  screenState: screenReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
