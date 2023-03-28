import React from 'react';
import { Tldraw, useFileSystem } from '@tldraw/tldraw';
import CustomCursor from './CustomCursor';
import { useMultiplayerState } from './hooks/useMultiPlayerState';

export default function WhiteBoardEditor() {
  const fileSystemEvents = useFileSystem();
  const { ...events } = useMultiplayerState(`tldraw-${new Date().toISOString().substring(0, 10).replace(/-/g, '')}`);
  const component = { Cursor: CustomCursor };

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
        disableAssets={true}
        showPages={false}
        showMultiplayerMenu={false}
        showMenu={false}
        {...fileSystemEvents}
        {...events}
      />
    </div>
  );
}
