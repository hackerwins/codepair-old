import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import NavBar from 'components/NavBar';
import { hideMessage } from 'features/messageSlices';
import { AppState } from 'app/rootReducer';
import { recentFavoriteSelector, refreshStorage } from 'features/linkSlices';
import EventNote from '@mui/icons-material/EventNote';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import { SideBar } from 'components/SideBar';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import GitHub from '@mui/icons-material/GitHub';
import { saveLastDocument } from 'features/currentSlices';
import { refreshCalendarStorage } from 'features/calendarSlices';
import invert from 'invert-color';
import { setTool, ToolType } from 'features/boardSlices';
import { setSidebarWidth } from 'features/navSlices';
import { SettingsDialog } from './SettingsDialog';

type DocPageProps = {
  docKey: string;
};

interface LayoutProps {
  open: boolean;
  openInstant: boolean;
  sidebarWidth: number;
}

const useStyles = makeStyles<LayoutProps>()((theme, props) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  sidebarAreaBackground: {
    backgroundColor: theme.palette.mode === Theme.Dark ? '#121212' : '#fff',
  },
  sidebarArea: {
    width: props.open ? props.sidebarWidth : 0,
    '@media only screen and (max-width: 600px)': {
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 1,
    },
    flexGrow: 0,
    flex: 'none',
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  layout: {
    '@media only screen and (max-width: 600px)': {
      height: `100vh`,
    },
    flex: '1 1 auto',
    height: `100vh`,
    display: 'flex',
    flexDirection: 'row',
  },
  resizer: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    right: 0,
    width: 5,
    cursor: 'col-resize',
    // backgroundColor: 'rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: 'GrayText',
    },
    zIndex: 1,
  },
  editorArea: {
    flex: '1 1 auto',

    // height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'black',
    boxSizing: 'border-box',
    position: 'relative',
  },
  instantArea: {
    flex: 'none',
    width: props.openInstant ? props.sidebarWidth : 0,
    '@media only screen and (max-width: 600px)': {
      position: 'fixed',
      right: 0,
      top: 56,
      bottom: 0,
      zIndex: 1,
    },
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    borderColor: theme.palette.mode === Theme.Dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    position: 'relative',
    transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  colorView: {
    flex: 'none',
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userArea: {
    flex: 'none',
    height: 65,
    gap: 10,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    // boxSizing: 'border-box',
    borderBottom: '1px solid',
    borderRight: '1px solid',
    borderColor: theme.palette.mode === Theme.Dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.mode === Theme.Dark ? 'black' : '#fafafa',
  },
}));

function MessagePanel() {
  const dispatch = useDispatch();
  const message = useSelector((state: AppState) => state.messageState);
  const handleCloseSnackbar = () => {
    dispatch(hideMessage());
  };
  return (
    <div>
      {message.open && (
        <Snackbar
          open={message.open}
          autoHideDuration={1000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={message.type}>
            {message.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

function SpeedDialPanel() {
  const navigate = useNavigate();
  const favorites = useSelector(recentFavoriteSelector(3));
  const [openSpeedDial, setOpenSpeedDial] = React.useState(false);

  const handleSpeedDialOpen = () => {
    setOpenSpeedDial(true);
  };

  const handleSpeedDialClose = () => {
    setOpenSpeedDial(false);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      icon={<SpeedDialIcon />}
      onClose={handleSpeedDialClose}
      onOpen={handleSpeedDialOpen}
      open={openSpeedDial}
      direction="up"
      style={{
        position: 'fixed',
        bottom: 50,
        right: 20,
      }}
    >
      <SpeedDialAction
        icon={<QuestionAnswer />}
        tooltipTitle="Yorkie QnA"
        onClick={() => {
          navigate('/qna');
        }}
      />
      <SpeedDialAction
        icon={<RecordVoiceOver />}
        tooltipTitle="Yorkie Developer QnA"
        onClick={() => {
          navigate('/developer-qna');
        }}
      />
      {favorites.reverse().map((favorite) => {
        return (
          <SpeedDialAction
            key={`${favorite.fileLink}${Math.random()}`}
            icon={<EventNote />}
            tooltipTitle={favorite.name}
            onClick={() => {
              if (favorite.fileLink) {
                navigate(favorite.fileLink);
              }
            }}
          />
        );
      })}
    </SpeedDial>
  );
}

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const dispatch = useDispatch();
  const navState = useSelector((state: AppState) => state.navState);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const { classes } = useStyles({
    open: navState.openTab,
    openInstant: navState.openInstant,
    sidebarWidth: navState.sidebarWidth,
  } as LayoutProps);
  const location = useLocation();
  const { docKey = '' } = useParams<DocPageProps>();
  const resizerRef = useRef<any>({
    startWidth: navState.sidebarWidth,
  });

  useEffect(() => {
    if (`${import.meta.env.VITE_APP_GOOGLE_ANALYTICS}`) {
      ReactGA.send('pageview');
    }
  }, [location]);

  useEffect(() => {
    function refresh() {
      dispatch(refreshStorage());
      dispatch(refreshCalendarStorage());
    }

    function mouseMove(e: any) {
      if (resizerRef.current.target) {
        const { startX, startWidth } = resizerRef.current;
        const width = startWidth + (e.clientX - startX);
        if (width > 240 && width < 500) {
          resizerRef.current.endWidth = width;
          dispatch(setSidebarWidth(width));
        }
      }
    }
    function mouseUp() {
      if (resizerRef.current) {
        document.body.style.cursor = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.body.style.userSelect = 'auto';
        resizerRef.current.target = null;
        resizerRef.current.startWidth = resizerRef.current.endWidth;

        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mousemove', mouseMove);
      }
    }

    function mouseDown(e: any) {
      if (e.target.getAttribute('data-resizer') === 'true') {
        resizerRef.current.target = e.target;
        resizerRef.current.startX = e.clientX;

        document.body.style.cursor = 'col-resize';
        document.body.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';

        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);
      }
    }

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(saveLastDocument({ docKey }));
  }, [dispatch, docKey]);

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | undefined>();
  const handleSettingsClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
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
    <div className={classes.root} data-theme={menu.theme}>
      <div className={classes.layout}>
        <div
          className={classes.sidebarArea}
          onTransitionEnd={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        >
          <div className={classes.userArea}>
            <Tooltip title="Settings">
              <div
                role="button"
                tabIndex={0}
                className={classes.colorView}
                style={{
                  backgroundColor: menu.userColor,
                }}
                onClick={handleSettingsClick}
              >
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: 'bold',
                    color: invert(invert(menu.userColor, true), true),
                  }}
                >
                  {menu.userName.slice(0, 1).toUpperCase()}
                </Typography>
              </div>
            </Tooltip>
            <div
              className={classes.userInfo}
              role="button"
              tabIndex={0}
              style={{
                cursor: 'pointer',
              }}
              onClick={handleSettingsClick}
            >
              <Typography variant="body1">{menu.userName}</Typography>
            </div>
          </div>
          <div
            style={{
              flex: '1 1 auto',
              position: 'relative',
            }}
          >
            <SideBar />
          </div>
          <div
            className={classes.sidebarAreaBackground}
            style={{
              flex: 'none',
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(100, 100, 100, 0.12)',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0',
                gap: 8,
              }}
            >
              <Button href="https://github.com/yorkie-team/codepair">
                <GitHub /> &nbsp;GitHub
              </Button>
            </Box>
          </div>
          <div className={classes.resizer} data-resizer="true" />
        </div>
        <div className={classes.editorArea}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flex: 'none',
            }}
          >
            <NavBar />
          </div>
          <div
            style={{
              position: 'relative',
            }}
          >
            {children}
          </div>
        </div>
        <div className={classes.instantArea}>test</div>
      </div>
      <MessagePanel />
      <SpeedDialPanel />
      {anchorEl ? <SettingsDialog open handleClose={handleSettingsClose} /> : undefined}
    </div>
  );
}
