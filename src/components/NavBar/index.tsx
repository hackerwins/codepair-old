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
import { AppBar, Button, IconButton, Link, Popover, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import SettingsSuggest from '@mui/icons-material/SettingsSuggest';
import SmartToy from '@mui/icons-material/SmartToy';
import EventNote from '@mui/icons-material/EventNote';
import Gesture from '@mui/icons-material/Gesture';
import { createDoc } from 'features/docSlices';
import { findCurrentPageLink, newLink } from 'features/linkSlices';

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
    flexGrow: 1,
    display: 'flex',
    gap: 10,
  },
  addButton: {
    color: theme.palette.mode === ThemeType.Dark ? 'white' : 'black',
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
  const client = useSelector((state: AppState) => state.docState.client);
  const currentItem = useSelector(findCurrentPageLink);

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

  const handleCreateWhiteboard = useCallback(
    async (name: string) => {
      const newDocKey = `${Math.random().toString(36).substring(7)}`;
      const fileLink = `/${newDocKey}`;
      const mimeType = 'application/vnd.pairy.whiteboard';

      if (client) {
        dispatch(
          createDoc({
            client,
            docKey: `codepairs-${newDocKey}`,
            init: (root: any) => {
              const newRoot = root;
              if (!newRoot.mimeType) {
                newRoot.mimeType = mimeType;
              }

              newRoot.whiteboard = {
                shapes: {},
                bindings: {},
                assets: {},
              };
            },
          }) as any,
        );

        setTimeout(() => {
          dispatch(newLink({ parentId: currentItem.id, name, mimeType, fileLink }));
        }, 1000);
      }
    },
    [currentItem?.id, dispatch, client],
  );

  const handleCreateLink = useCallback(
    (name: string) => {
      dispatch(newLink({ parentId: currentItem.id, name }));
    },
    [currentItem?.id, dispatch],
  );

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
              <Menu />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link href="/" underline="none">
                CodePair
              </Link>
            </Typography>
            <NetworkButton />
          </div>
          <div className={classes.grow}>
            <Button size="small" className={classes.addButton} onClick={() => handleCreateLink('Untitled note')}>
              <EventNote /> &nbsp;
              <Typography>Note</Typography>
            </Button>
            <Button
              size="small"
              className={classes.addButton}
              onClick={() => handleCreateWhiteboard('Untitled artboard')}
            >
              <Gesture fontSize="small" /> &nbsp;
              <Typography>Whiteboard</Typography>
            </Button>
          </div>
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
