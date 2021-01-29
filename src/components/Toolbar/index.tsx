import React, { useState, useCallback, MouseEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { AppState } from 'app/rootReducer';
import { CodeMode, setCodeMode } from 'features/settingSlices';
import Settings from './Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '6px',
      position: 'relative',
    },
    formControl: {
      minWidth: 140,
      border: `1px solid ${theme.palette.grey['800']}`,
      borderRadius: '4px',
    },
    selectEmpty: {
      paddingLeft: '12px',
    },
    settingsButton: {
      float: 'right',
      padding: '7px',
    },
  }),
);

export default function Toolbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const menu = useSelector((state: AppState) => state.settingState.menu);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();

  const handleCodeModeChange = useCallback((event: ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setCodeMode(event.target.value as CodeMode));
  }, [dispatch]);

  const handleSettingsClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);
  const isOpen = Boolean(anchorEl);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <Tooltip title="Syntax">
          <Select
            name="codeMode"
            value={menu.codeMode}
            onChange={handleCodeModeChange}
            className={classes.selectEmpty}
            disableUnderline
            displayEmpty
          >
            {Object.entries(CodeMode).map(([display, mode]: [string, string]) => {
              return (
                <MenuItem value={mode} key={mode}>
                  {display}
                </MenuItem>
              );
            })}
          </Select>
        </Tooltip>
      </FormControl>
      <Tooltip title="Settings">
        <IconButton className={classes.settingsButton} aria-label="settings" onClick={handleSettingsClick}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        id={isOpen ? 'simple-popover' : undefined}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Settings />
      </Popover>
    </div>
  );
}
