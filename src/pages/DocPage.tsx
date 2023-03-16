import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import Editor from 'components/Editor';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { SideBar } from 'components/SideBar';

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

export default function DocPage(props: RouteComponentProps<DocPageProps>) {
  const openTab = useSelector((state: AppState) => state.linkState.openTab);
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
    </div>
  );
}
