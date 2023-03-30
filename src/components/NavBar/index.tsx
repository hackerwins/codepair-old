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
import SettingsSuggest from '@mui/icons-material/SettingsSuggest';
import SmartToy from '@mui/icons-material/SmartToy';

import ThemeButton from './ThemeButton';
import { LinkNavigation } from './LinkNavigation';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    flex: 'none',
    zIndex: 1,
    backgroundColor: theme.palette.mode === ThemeType.Dark ? '#333333' : '#ececec',
  },
  appBar: {
    backgroundColor: theme.palette.mode === ThemeType.Dark ? 'black' : '#fafafa',
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
    '@media only screen and (max-width: 600px)': {
      display: 'none',
    },
    flexGrow: 1,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    color: theme.palette.mode === ThemeType.Dark ? 'white' : 'black',
    display: 'flex',
    gap: 10,
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
          <div
            style={{
              width: 270,
              display: 'flex',
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                dispatch(toggleTab());
              }}
              className={classes.iconButton}
            >
              <svg
                width="40"
                height="38"
                viewBox="0 0 40 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: 30,
                  height: 30,
                }}
              >
                <path
                  d="M11.8574 11.4048L18.8525 21.4507C19.2947 22.086 20.1683 22.2423 20.8036 21.8001C20.9398 21.7052 21.0581 21.5869 21.153 21.4507L28.148 11.4048C29.0327 10.1343 28.7198 8.3872 27.4495 7.5027C26.9794 7.17549 26.4205 7 25.8477 7H14.1577C12.6095 7 11.3545 8.25503 11.3545 9.80322C11.3547 10.3758 11.5302 10.9347 11.8574 11.4048Z"
                  fill="#514C49"
                />
                <path
                  d="M22.8637 29.5446C23.3612 29.8283 23.9338 29.9528 24.5042 29.9014L37.2991 28.7469C38.3271 28.6542 39.0851 27.7457 38.9924 26.7178C38.9876 26.6636 38.9803 26.6096 38.9706 26.556C38.5862 24.4114 37.8296 22.3507 36.7352 20.4668C35.6407 18.5829 34.2255 16.9048 32.5532 15.5085C31.761 14.8471 30.5825 14.953 29.9211 15.7455C29.8862 15.7872 29.8532 15.8305 29.8219 15.8752L22.4807 26.418C22.1535 26.888 21.978 27.4469 21.978 28.0198V27.9849C21.978 28.3055 22.0604 28.6208 22.2176 28.9002C22.3826 29.1751 22.6155 29.4029 22.8942 29.5617"
                  fill="#FDC433"
                />
                <path
                  d="M17.8492 28.7605C17.6844 29.097 17.4222 29.376 17.0969 29.5616L17.1365 29.539C16.6391 29.8227 16.0665 29.9472 15.4961 29.8959L2.70114 28.7414C2.64694 28.7365 2.59295 28.7293 2.53935 28.7196C1.52348 28.5375 0.847507 27.5663 1.02965 26.5505C1.41407 24.4057 2.17064 22.3451 3.26489 20.4611C4.35914 18.577 5.77455 16.8993 7.44706 15.5028C7.48877 15.4679 7.53208 15.4349 7.57681 15.4037C8.42384 14.8139 9.58841 15.0225 10.1784 15.8695L17.5196 26.4124C17.8468 26.8825 18.0223 27.4414 18.0223 28.0142V27.9685C18.0223 28.343 17.9096 28.7091 17.6991 29.019"
                  fill="#FDC433"
                />
              </svg>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link href="/" underline="none">
                CodePair
              </Link>
            </Typography>
            <NetworkButton />
          </div>
          <div className={classes.grow}>
            <LinkNavigation />
            <PeerGroup />
            <div />
          </div>
          <div className={classes.items}>
            <ShareButton />
            <Tooltip title="Settings" arrow>
              <IconButton aria-label="settings" onClick={handleSettingsClick}>
                <SettingsSuggest />
              </IconButton>
            </Tooltip>
            {anchorEl && (
              <Popover
                open
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
                <Settings />
              </Popover>
            )}
            <ThemeButton />
          </div>
          {import.meta.env.MODE === 'development' && (
            <IconButton
              size="small"
              onClick={() => {
                dispatch(toggleInstant());
              }}
              className={menu.theme === ThemeType.Dark ? classes.instantIconButtonDark : classes.instantIconButton}
            >
              <SmartToy />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default memo(MenuAppBar);
