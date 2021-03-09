import React, { useState, useEffect, useCallback, MouseEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Popover from 'components/Popover';
import Settings from 'components/Toolbar/Settings';

import { AppState } from 'app/rootReducer';
import { CodeMode, setCodeMode } from 'features/docSlices';

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

    rightButtonControl: {
      float: 'right',
    },
    rightButton: {
      padding: '7px',
    },
  }),
);

export default function Toolbar() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const doc = useSelector((state: AppState) => state.docState.doc);
  const codeMode = useSelector((state: AppState) => state.docState.mode);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.name === 'remote-change') {
        dispatch(setCodeMode(doc.getRootObject().mode || CodeMode.Markdown));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  const handleCodeModeChange = useCallback(
    (event: ChangeEvent<{ name?: string; value: unknown }>) => {
      if (!doc) {
        return;
      }
      const mode = event.target.value as CodeMode;
      doc.update((root) => {
        // eslint-disable-next-line no-param-reassign
        root.mode = mode;
      });

      dispatch(setCodeMode(mode));
    },
    [doc, dispatch],
  );

  const handleSettingsClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <Tooltip title="Syntax" arrow>
          <Select
            name="codeMode"
            value={codeMode}
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

      <div className={classes.rightButtonControl}>
        <Tooltip className={classes.rightButton} title="Settings" arrow>
          <IconButton aria-label="settings" onClick={handleSettingsClick}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <Popover anchorEl={anchorEl} onClose={handleSettingsClose}>
        <Settings />
      </Popover>
    </div>
  );
}
