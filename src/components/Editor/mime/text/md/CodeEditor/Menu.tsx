import React, { MouseEvent, useCallback, useState } from 'react';
import Help from '@mui/icons-material/Help';
import { IconButton, Popover, Tooltip } from '@mui/material';
import Keyboard from '@mui/icons-material/Keyboard';
import { makeStyles } from 'styles/common';
import EditorSettings from './EditorSettings';

const useStyles = makeStyles()(() => ({
  customToolbar: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '0 8px',
    justifyContent: 'center',
  },
}));

export function CodeEditorMenu() {
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const handleSettingsClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  return (
    <div className={classes.customToolbar}>
      <IconButton onClick={() => window.open('https://www.markdownguide.org/basic-syntax/')}>
        <Help />
      </IconButton>
      <Tooltip title="Settings" arrow>
        <IconButton aria-label="settings" onClick={handleSettingsClick}>
          <Keyboard />
        </IconButton>
      </Tooltip>
      {anchorEl && (
        <Popover
          open
          elevation={2}
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={handleSettingsClose}
        >
          <EditorSettings />
        </Popover>
      )}
    </div>
  );
}
