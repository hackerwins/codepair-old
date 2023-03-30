import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { makeStyles } from 'styles/common';
import { IconButton, Tooltip } from '@mui/material';

import { setDarkMode, Theme } from 'features/settingSlices';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';

const useStyles = makeStyles()(() => ({
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function ThemeButton() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const menu = useSelector((state: AppState) => state.settingState.menu);

  const handleThemeChanged = useCallback(() => {
    dispatch(setDarkMode(menu.theme !== Theme.Dark));
  }, [dispatch, menu.theme]);

  return (
    <div className={classes.box}>
      <Tooltip title={menu.theme === Theme.Dark ? 'Light Mode' : 'Dark Mode'}>
        <IconButton onClick={handleThemeChanged} size="small">
          {menu.theme === Theme.Dark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>
    </div>
  );
}
