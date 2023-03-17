import React, { useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import Editor from 'components/Editor';
import { AppState } from 'app/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { SideBar } from 'components/SideBar';
import { Snackbar } from '@material-ui/core';
import { hideMessage } from 'features/messageSlices';
import { Alert, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { EventNote, QuestionAnswer, RecordVoiceOver } from '@material-ui/icons';
import { recentFavoriteSelector, refreshStorage } from 'features/linkSlices';

type DocPageProps = {
  docKey: string;
};

interface LayoutProps {
  open: boolean;
}

const SIDEBAR_WIDTH = 300;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    sidebarArea: {
      width: (props: LayoutProps) => (props.open ? SIDEBAR_WIDTH : 0),
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
      transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    },
    layout: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    editorArea: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

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
  const history = useHistory();
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
          history.push('/qna');
        }}
      />
      <SpeedDialAction
        icon={<RecordVoiceOver />}
        tooltipTitle="Yorkie Developer QnA"
        onClick={() => {
          history.push('/developer-qna');
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
                history.push(favorite.fileLink);
              }
            }}
          />
        );
      })}
    </SpeedDial>
  );
}

export default function DocPage(props: RouteComponentProps<DocPageProps>) {
  const dispatch = useDispatch();
  const openTab = useSelector((state: AppState) => state.navState.openTab);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const classes = useStyles({
    open: openTab,
  } as LayoutProps);
  const location = useLocation();
  const {
    match: { params },
  } = props;
  const { docKey } = params;

  useEffect(() => {
    if (`${process.env.REACT_APP_GOOGLE_ANALYTICS}`) {
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
        <div className={classes.sidebarArea}>
          <SideBar />
        </div>
        <div className={classes.editorArea}>
          <Editor docKey={docKey} />
        </div>
      </div>
      <MessagePanel />
      <SpeedDialPanel />
    </div>
  );
}
