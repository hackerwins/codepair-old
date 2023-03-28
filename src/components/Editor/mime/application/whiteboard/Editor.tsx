import React from 'react';
import { Tldraw, useFileSystem } from '@tldraw/tldraw';
import { useParams } from 'react-router-dom';
import CustomCursor from './CustomCursor';
import { useMultiplayerState } from './hooks/useMultiPlayerState';

export default function WhiteBoardEditor() {
  const fileSystemEvents = useFileSystem();
  const { ...events } = useMultiplayerState(`tldraw-${new Date().toISOString().substring(0, 10).replace(/-/g, '')}`);
  const component = { Cursor: CustomCursor };
  const { docKey } = useParams<{ docKey: string }>();

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
        key={docKey}
        components={component}
        autofocus
        disableAssets
        showPages={false}
        showMultiplayerMenu={false}
        showMenu={false}
        {...fileSystemEvents}
        {...events}
      />
    </div>
  );
}
