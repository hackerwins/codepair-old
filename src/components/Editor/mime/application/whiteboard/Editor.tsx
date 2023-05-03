import React from 'react';
import { Tldraw, useFileSystem } from '@tldraw/tldraw';
import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import CustomCursor from './CustomCursor';
import { useMultiplayerState } from './hooks/useMultiPlayerState';

const useStyles = makeStyles()(() => ({
  root: {
    width: 'calc(100%)',

    height: 'calc(100vh - 75px)',
    overflow: 'hidden',
    position: 'absolute',
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,

    '& .tl-container': {
      backgroundColor: 'transparent',
    },
  },
}));

export default function WhiteBoardEditor() {
  const fileSystemEvents = useFileSystem();
  const { ...events } = useMultiplayerState(`tldraw-${new Date().toISOString().substring(0, 10).replace(/-/g, '')}`);
  const component = { Cursor: CustomCursor };
  const { classes } = useStyles();
  const menu = useSelector((state: AppState) => state.settingState.menu);

  return (
    <div className={classes.root}>
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
