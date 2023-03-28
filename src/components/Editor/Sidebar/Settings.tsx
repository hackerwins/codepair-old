/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, ChangeEvent } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import { Preview, setPreview } from 'features/docSlices';
import {
  Theme,
  CodeKeyMap,
  TabSize,
  setDarkMode,
  setCodeKeyMap,
  setTabSize,
  setUserName,
  setUserColor,
} from 'features/settingSlices';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import { updatePresenceColor } from 'features/peerSlices';
import { makeStyles } from 'styles/common';
import {
  Box,
  debounce,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

const useStyles = makeStyles()((theme) => ({
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
    pointerEvents: 'none',
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
    pointerEvents: 'auto',
  },
}));

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const { classes } = useStyles();

  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const preview = useSelector((state: AppState) => state.docState.preview);
  const menu = useSelector((state: AppState) => state.settingState.menu);

  const debounceSave = useCallback(
    debounce((value) => {
      dispatch(setUserName(value));
    }, 2000),
    [],
  );

  useEffect(() => {
    if (!doc) {
      return;
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        dispatch(setPreview(doc.getRoot().preview || Preview.HTML));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  const handleInputUserName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      debounceSave(value);
    },
    [debounceSave],
  );

  const handleInputUserColor = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (client) {
        dispatch(updatePresenceColor(value));
      }

      dispatch(setUserColor(value));
    },
    [dispatch],
  );

  const handlePreviewChange = useCallback(
    (event: SelectChangeEvent<{ name?: string; value: unknown }>) => {
      if (!doc) {
        return;
      }
      const value = event.target.value as Preview;
      doc.update((root) => {
        // eslint-disable-next-line no-param-reassign
        root.preview = value;
      });

      dispatch(setPreview(value));
    },
    [doc, dispatch],
  );

  function handleChange<T>(action: ActionCreatorWithPayload<T>) {
    return (event: SelectChangeEvent<{ name?: string; value: unknown }>) => {
      dispatch(action(event.target.value as T));
    };
  }

  const handleThemeChanged = useCallback(
    (_input: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      dispatch(setDarkMode(checked));
    },
    [dispatch, setDarkMode],
  );

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
          <div className={classes.itemTitle}>Name</div>
          <FormControl className={classes.itemInfo}>
            <TextField
              id="standard-basic"
              variant="standard"
              defaultValue={menu.userName}
              onInput={handleInputUserName}
            />
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Color</div>
          <FormControl className={classes.itemInfo}>
            <input type="color" defaultValue={menu.userColor} onChange={handleInputUserColor} />
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Preview</div>
          <FormControl className={classes.itemInfo}>
            <Select name="preview" value={{ value: `${preview}` }} onChange={handlePreviewChange} displayEmpty>
              {Object.entries(Preview).map(([display, value]: [string, string]) => {
                return (
                  <MenuItem value={value} key={value}>
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
            <Select value={{ value: `${menu?.tabSize}` }} onChange={handleChange(setTabSize)} displayEmpty>
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
            <Select value={{ value: `${menu?.codeKeyMap}` }} onChange={handleChange(setCodeKeyMap)} displayEmpty>
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
