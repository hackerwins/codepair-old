import React from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { Theme, CodeKeyMap, TabSize, setTheme, setCodeKeyMap, setTabSize } from 'features/settingSlices';
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
      padding: '12px 24px',
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
      border: '1px solid #aaa',
      borderRadius: '4px',
      textAlign: 'left',
    },
  }),
);

const Settings = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const menu = useSelector((state: AppState) => state.settingState.menu);

  function handleChange<T>(action: ActionCreatorWithPayload<T>) {
    return (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      dispatch(action(event.target.value as T));
    };
  }

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
          <div className={classes.itemTitle}>Theme</div>
          <FormControl className={classes.itemInfo}>
            <Select value={menu.theme} onChange={handleChange(setTheme)} disableUnderline displayEmpty>
              {Object.entries(Theme).map(([display, theme]: [string, string]) => {
                return (
                  <MenuItem value={theme} key={theme}>
                    {display}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Key binding</div>
          <FormControl className={classes.itemInfo}>
            <Select value={menu.codeKeyMap} onChange={handleChange(setCodeKeyMap)} disableUnderline displayEmpty>
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
          <div className={classes.itemTitle}>Tab Size</div>
          <FormControl className={classes.itemInfo}>
            <Select value={menu.tabSize} onChange={handleChange(setTabSize)} disableUnderline displayEmpty>
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
      </div>
    </div>
  );
};

export default Settings;
