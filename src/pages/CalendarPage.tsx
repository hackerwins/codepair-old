import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import NavBar from 'components/NavBar';
import { hideMessage } from 'features/messageSlices';
import { AppState } from 'app/rootReducer';
import { recentFavoriteSelector } from 'features/linkSlices';
import EventNote from '@mui/icons-material/EventNote';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import GitHub from '@mui/icons-material/GitHub';
import { SideBar } from 'components/SideBar';
import Editor from 'components/Editor';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import BasicCalendar from 'components/calendar/BasicCalendar';
import { refreshCalendarStorage } from 'features/calendarSlices';
import { TimelineList } from 'components/calendar/TimelineList';

interface LayoutProps {
  open: boolean;
  openInstant: boolean;
}

const SIDEBAR_WIDTH = 300;

const useStyles = makeStyles<LayoutProps>()((theme, props) => {
  return {
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
      width: props.open ? SIDEBAR_WIDTH : 0,
      '@media only screen and (max-width: 600px)': {
        position: 'fixed',
        left: 0,
        top: 56,
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
      height: `calc(100vh - 64px)`,
      display: 'flex',
      flexDirection: 'row',
    },
    editorArea: {
      flex: '1 1 auto',
      display: 'flex',
      boxSizing: 'border-box',
      position: 'relative',
    },

    timeline: {
      flex: 'none',
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderRight: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    },
    calendarArea: {
      flex: 'none',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderBottom: theme.palette.mode === Theme.Dark ? '1px solid #555555' : '1px solid rgba(0, 0, 0, 0.12)',
    },
    timelineList: {
      flex: '1 1 auto',
      overflow: 'auto',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',

      '& > * ': {
        flex: '1 1 auto',
      },
    },
    currentEditorArea: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    instantArea: {
      flex: 'none',
      width: props.openInstant ? SIDEBAR_WIDTH : 0,
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
  };
});

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

export default function CalendarPage() {
  const dispatch = useDispatch();
  const navState = useSelector((state: AppState) => state.navState);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const { classes } = useStyles({
    open: true,
    openInstant: navState.openInstant,
  } as LayoutProps);
  const location = useLocation();
  const [docKey, setDocKey] = useState<string>('');

  useEffect(() => {
    if (`${import.meta.env.VITE_APP_GOOGLE_ANALYTICS}`) {
      ReactGA.send('pageview');
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener('storage', () => {
      dispatch(refreshCalendarStorage());
    });
  }, [dispatch]);

  return (
    <div className={classes.root} data-theme={menu.theme}>
      <NavBar />
      <div className={classes.layout}>
        <div
          className={classes.sidebarArea}
          onTransitionEnd={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        >
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
              <Button
                href="https://github.com/yorkie-team/codepair"
                style={{
                  fontSize: 16,
                }}
              >
                Yorkie
              </Button>
              <Button href="https://github.com/yorkie-team">
                <GitHub /> &nbsp;GitHub
              </Button>
            </Box>
          </div>
        </div>
        <div className={classes.editorArea}>
          <div className={classes.timeline}>
            <div className={classes.calendarArea}>
              <BasicCalendar />
            </div>
            <div className={classes.timelineList}>
              <TimelineList changeDocKey={setDocKey} />
            </div>
          </div>
          <div className={classes.currentEditorArea}>
            <Editor docKey={docKey} />
          </div>
        </div>
        <div className={classes.instantArea}>test</div>
      </div>
      <MessagePanel />
      <SpeedDialPanel />
    </div>
  );
}
