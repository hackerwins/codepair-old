import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ReactGA from 'react-ga4';

import { useDispatch, useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import NavBar from 'components/NavBar';
import { hideMessage } from 'features/messageSlices';
import { AppState } from 'app/rootReducer';
import { refreshStorage } from 'features/linkSlices';
import { SideBar } from 'components/SideBar';
import { Theme } from 'features/settingSlices';
import { makeStyles } from 'styles/common';
import { saveLastDocument } from 'features/currentSlices';
import { setSidebarWidth } from 'features/navSlices';
import { WorkspaceButton } from 'components/SideBar/WorkspaceButton';
import { ContentView } from 'components/Content';
import { LogoMenu } from 'components/application/LogoMenu';
import { Guide } from 'components/commons/Guide';

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
    // backgroundColor: theme.palette.mode === Theme.Dark ? '#121212' : '#fafafa',
    borderRight: '1px solid #e0e0e0',
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
    borderRight: theme.palette.mode === Theme.Dark ? '1px solid #333333' : '1px solid #e0e0e0',
    backgroundColor: theme.palette.mode === Theme.Dark ? '#202020' : '#fafafa',
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
  editorContentArea: {
    position: 'relative',
    height: 'calc(100% - 40px)',
    padding: '10px 0px',
    paddingTop: 0,
    backgroundColor: theme.palette.mode === Theme.Dark ? '#121212' : '#fff',
  },
  guideArea: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    display: 'flex',
    flexDirection: 'column',
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
  applicationArea: {
    padding: '10px 0px',
    paddingTop: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  userArea: {
    flex: 'none',
    // height: 65,
    display: 'block',
    // justifyContent: 'space-between',
    padding: '10px 16px',
    // boxSizing: 'border-box',
    // borderBottom: '1px solid',
    // borderRight: '1px solid',
    borderColor: theme.palette.mode === Theme.Dark ? 'rgba(255, 255, 255, 0.12)' : '#fafafa',
    // backgroundColor: theme.palette.mode === Theme.Dark ? 'black' : '#fafafa',
  },
}));

function MessagePanel() {
  const dispatch = useDispatch();
  const message = useSelector((state: AppState) => {
    return { ...state.messageState };
  });

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
            horizontal: 'right',
          }}
          style={{
            transform: 'translateY(-30px) translateX(-100px)',
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
  const minWidth = 320;

  useEffect(() => {
    if (`${import.meta.env.VITE_APP_GOOGLE_ANALYTICS}`) {
      ReactGA.send('pageview');
    }
  }, [location]);

  useEffect(() => {
    function refresh() {
      dispatch(refreshStorage());
    }

    function mouseMove(e: any) {
      if (resizerRef.current.target) {
        const { startX, startWidth } = resizerRef.current;
        const width = startWidth + (e.clientX - startX);

        if (width > minWidth && width < 500) {
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
  }, [dispatch, minWidth]);

  useEffect(() => {
    dispatch(saveLastDocument({ docKey }));
  }, [dispatch, docKey]);

  return (
    <div className={classes.root} data-theme={menu.theme}>
      <div className={classes.layout}>
        <div
          className={classes.sidebarArea}
          // onTransitionEnd={() => {
          //   console.log('transition end');
          //   window.dispatchEvent(new Event('resize'));
          // }}
        >
          <div className={classes.userArea}>
            <div className={classes.applicationArea}>
              <LogoMenu />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <WorkspaceButton />
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
          <div className={classes.editorContentArea}>
            <ContentView>{children}</ContentView>
          </div>
        </div>
        <div className={classes.instantArea}>test</div>
        <div className={classes.guideArea}>
          <Guide />
        </div>
      </div>
      <MessagePanel />
    </div>
  );
}
