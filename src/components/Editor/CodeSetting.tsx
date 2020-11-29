import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { CodeTheme, CodeKeyMap, TabSize, SetCodeTheme, SetCodeKeyMap, SetTabSize } from '../../actions/settingActions';
import { MenuKey } from '../../reducers/settingReducer';
import { IAppState } from '../../store/store';

import { SettingModel } from '../../data/browser-storage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.primary.light,
      width: '400px',
      minWidth: '320px',
      borderRadius: '4px',
    },
    header: {
      backgroundColor: theme.palette.primary.main,
      borderBottom: `1px solid ${theme.palette.text.disabled}`,
    },
    title: {
      padding: '12px 16px',
    },
    list: {
      margin: '12px 24px',
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
      backgroundColor: 'transparent',
      border: '1px solid #aaa',
      borderRadius: '4px',
      textAlign: 'left',
    },
  }),
);

const CodeSetting = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const menu = useSelector((state: IAppState) => state.settingState.menu);

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name = '', value } = event.target;

    SettingModel.setValue(name as MenuKey, value as string);
    if ((event.target.name as string) === 'codeTheme') {
      dispatch(SetCodeTheme(event.target.value as CodeTheme));
      return;
    }

    if ((event.target.name as string) === 'codeKeyMap') {
      dispatch(SetCodeKeyMap(event.target.value as CodeKeyMap));
      return;
    }

    if ((event.target.name as string) === 'tabSize') {
      dispatch(SetTabSize(event.target.value as TabSize));
      return;
    }
  };

  return (
    <div className={classes.root}>
      <Box>
        <header className={classes.header}>
          <Typography className={classes.title} variant="h6">
            Editor Settings
          </Typography>
        </header>
      </Box>

      <div className={classes.list}>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Theme</div>
          <FormControl className={classes.itemInfo}>
            <Select name="codeTheme" value={menu.codeTheme} onChange={handleChange} disableUnderline displayEmpty>
              {Object.entries(CodeTheme).map(([display, theme]: [string, string]) => {
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
            <Select name="codeKeyMap" value={menu.codeKeyMap} onChange={handleChange} disableUnderline displayEmpty>
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
            <Select name="tabSize" value={menu.tabSize} onChange={handleChange} disableUnderline displayEmpty>
              {Object.entries(TabSize).map(([_, tabSize]: [string, string]) => {
                return (
                  <MenuItem value={tabSize} key={tabSize}>
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

export default CodeSetting;
