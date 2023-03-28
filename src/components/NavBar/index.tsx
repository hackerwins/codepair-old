import React, { memo, MouseEvent, useCallback, useState } from 'react';
import PeerGroup from 'components/NavBar/PeerGroup';
import ShareButton from 'components/NavBar/ShareButton';
import NetworkButton from 'components/NavBar/NetworkButton';
import { useDispatch, useSelector } from 'react-redux';
import { toggleInstant, toggleTab } from 'features/navSlices';
import { AppState } from 'app/rootReducer';
import { Theme as ThemeType } from 'features/settingSlices';
import Settings from 'components/Editor/Sidebar/Settings';
import { setTool, ToolType } from 'features/boardSlices';
import { makeStyles } from 'styles/common';
import { AppBar, IconButton, Link, Popover, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import SettingsSuggest from '@mui/icons-material/SettingsSuggest';
import SmartToy from '@mui/icons-material/SmartToy';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    flex: 'none',
    zIndex: 1,
    backgroundColor: theme.palette.mode === ThemeType.Dark ? '#333333' : '#ececec',
  },
  appBar: {
    backgroundColor: theme.palette.mode === ThemeType.Dark ? 'black' : 'white',
    color: theme.palette.mode === ThemeType.Dark ? 'white' : 'black',
    borderBottom: theme.palette.mode === ThemeType.Dark ? '1px solid #333333' : '1px solid #e9e9e9',
  },
  iconButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.mode === ThemeType.Dark ? 'white' : 'black',
  },
  instantIconButtonDark: {
    color: 'white',
  },
  instantIconButton: {
    color: 'black',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  yorkie: {
    '& > a': {
      textDecoration: 'none',
      color: '#b5b0a1',
      fontSize: 12,
    },
  },
  items: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function MenuAppBar() {
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const handleSettingsClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      dispatch(setTool(ToolType.Settings));
      setAnchorEl(event.currentTarget);
    },
    [dispatch],
  );

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
    dispatch(setTool(ToolType.None));
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar>
          <IconButton
            size="small"
            onClick={() => {
              dispatch(toggleTab());
            }}
            className={classes.iconButton}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link href="/" underline="none">
              CodePair
            </Link>
          </Typography>
          <NetworkButton />
          <div className={classes.grow} />
          <div className={classes.items}>
            <ShareButton />
            <PeerGroup />
            <Tooltip title="Settings" arrow>
              <IconButton aria-label="settings" onClick={handleSettingsClick}>
                <SettingsSuggest />
              </IconButton>
            </Tooltip>
            {anchorEl && (
              <Popover open anchorEl={anchorEl} onClose={handleSettingsClose}>
                <Settings />
              </Popover>
            )}
          </div>
          <IconButton
            size="small"
            onClick={() => {
              dispatch(toggleInstant());
            }}
            className={menu.theme === ThemeType.Dark ? classes.instantIconButtonDark : classes.instantIconButton}
          >
            <SmartToy />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default memo(MenuAppBar);
