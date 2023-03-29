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
    flexDirection: 'column',
    transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  layout: {
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
            style={{
              flex: 'none',
              display: 'flex',
              justifyContent: 'center',
              borderRight: '1px solid #e0e0e0',
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
                <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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
