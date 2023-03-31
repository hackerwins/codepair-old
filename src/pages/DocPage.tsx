import React, { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import NavBar from 'components/NavBar';
import { hideMessage } from 'features/messageSlices';
import { AppState } from 'app/rootReducer';
import { recentFavoriteSelector, refreshStorage } from 'features/linkSlices';
import EventNote from '@mui/icons-material/EventNote';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import { SideBar } from 'components/SideBar';
import Editor from 'components/Editor';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import GitHub from '@mui/icons-material/GitHub';

type DocPageProps = {
  docKey: string;
};

interface LayoutProps {
  open: boolean;
  openInstant: boolean;
}

const SIDEBAR_WIDTH = 300;

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

    // height: '100%',
    display: 'flex',
    // flexDirection: 'column',
    // backgroundColor: 'black',
    boxSizing: 'border-box',
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

export default function DocPage() {
  const dispatch = useDispatch();
  const navState = useSelector((state: AppState) => state.navState);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const { classes } = useStyles({
    open: navState.openTab,
    openInstant: navState.openInstant,
  } as LayoutProps);
  const location = useLocation();
  const { docKey = '' } = useParams<DocPageProps>();

  useEffect(() => {
    if (`${import.meta.env.VITE_APP_GOOGLE_ANALYTICS}`) {
      ReactGA.send('pageview');
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener('storage', () => {
      dispatch(refreshStorage());
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
          <Editor docKey={docKey} />
        </div>
        <div className={classes.instantArea}>test</div>
      </div>
      <MessagePanel />
      <SpeedDialPanel />
    </div>
  );
}
