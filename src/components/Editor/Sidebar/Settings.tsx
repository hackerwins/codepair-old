import React, { useCallback, useEffect, ChangeEvent } from 'react';
import { DocEvent } from 'yorkie-js-sdk';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { CodeMode, setCodeMode } from 'features/docSlices';
import { Theme, CodeKeyMap, TabSize, setDarkMode, setCodeKeyMap, setTabSize } from 'features/settingSlices';
import { AppState } from 'app/rootReducer';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: '320px',
      borderRadius: '4px',
    },
    header: {
      borderBottom: `1px solid ${theme.palette.text.disabled}`,
    },
    title: {
      padding: '12px 16px',
    },
    list: {
      padding: '8px 18px 18px 18px',
      lineHeight: '19px',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '15px',
      marginTop: '12px',
    },
    itemTitle: {
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
    },
    itemInfo: {
      minWidth: 140,
      paddingLeft: '12px',
      borderRadius: '4px',
      textAlign: 'left',
    },
  }),
);

export default function Settings() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const doc = useSelector((state: AppState) => state.docState.doc);
  const codeMode = useSelector((state: AppState) => state.docState.mode);
  const menu = useSelector((state: AppState) => state.settingState.menu);

  useEffect(() => {
    if (!doc) {
      return () => {};
    }

    const unsubscribe = doc.subscribe((event: DocEvent) => {
      if (event.type === 'remote-change') {
        dispatch(setCodeMode(doc.getRoot().mode || CodeMode.Markdown));
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

  function handleChange<T>(action: ActionCreatorWithPayload<T>) {
    return (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      dispatch(action(event.target.value as T));
    };
  }

  const handleThemeChanged = useCallback((input, checked) => {
    dispatch(setDarkMode(checked));
  }, [dispatch, setDarkMode]);

  return (
    <div className={classes.root}>
      <Box>
        <header className={classes.header}>
          <Typography className={classes.title} variant="h6">
            Settings
          </Typography>
        </header>
      </Box>
      <div className={classes.list}>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Code Format</div>
          <FormControl className={classes.itemInfo}>
            <Select
              name="codeMode"
              value={codeMode}
              onChange={handleCodeModeChange}
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
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Tab Size</div>
          <FormControl className={classes.itemInfo}>
            <Select value={menu.tabSize} onChange={handleChange(setTabSize)} displayEmpty>
              {Object.entries(TabSize).map(([key, tabSize]: [string, string]) => {
                return (
                  <MenuItem value={tabSize} key={key}>
                    {`${tabSize} spaces`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Key Binding</div>
          <FormControl className={classes.itemInfo}>
            <Select value={menu.codeKeyMap} onChange={handleChange(setCodeKeyMap)} displayEmpty>
              {Object.entries(CodeKeyMap).map(([display, codeKeyMap]: [string, string]) => {
                return (
                  <MenuItem value={codeKeyMap} key={codeKeyMap}>
                    {display}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Dark Mode</div>
          <FormControl className={classes.itemInfo}>
            <Switch checked={menu.theme === Theme.Dark} onChange={handleThemeChanged} />
          </FormControl>
        </div>
      </div>
    </div>
  );
}
