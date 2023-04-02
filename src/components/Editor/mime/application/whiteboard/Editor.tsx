import React from 'react';
import { Tldraw, useFileSystem } from '@tldraw/tldraw';
import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';

import CustomCursor from './CustomCursor';
import { useMultiplayerState } from './hooks/useMultiPlayerState';

export default function WhiteBoardEditor() {
  const fileSystemEvents = useFileSystem();
  const { ...events } = useMultiplayerState(`tldraw-${new Date().toISOString().substring(0, 10).replace(/-/g, '')}`);
  const component = { Cursor: CustomCursor };
  const menu = useSelector((state: AppState) => state.settingState.menu);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
      }}
    >
      <Tldraw
        id="whiteboard-editor"
        components={component}
        autofocus
        disableAssets
        showPages={false}
        showMultiplayerMenu={false}
        showMenu={false}
        {...fileSystemEvents}
        {...events}
        darkMode={menu.theme === Theme.Dark}
      />
    </div>
  );
}
