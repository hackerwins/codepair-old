import { combineReducers } from 'redux';

import docReducer from 'features/docSlices';
import peerReducer from 'features/peerSlices';
import settingReducer from 'features/settingSlices';
import boardReducer from 'features/boardSlices';
import linkReducer from 'features/linkSlices';
import messageReducer from 'features/messageSlices';

const rootReducer = combineReducers({
  docState: docReducer,
  peerState: peerReducer,
  settingState: settingReducer,
  boardState: boardReducer,
  linkState: linkReducer,
  messageState: messageReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
