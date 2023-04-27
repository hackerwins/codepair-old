import React, { ReactNode } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';
import { NavTabType, toggleLinkTab } from 'features/navSlices';
import { makeStyles } from 'styles/common';
import ListAlt from '@mui/icons-material/ListAlt';
import { useLocation } from 'react-router-dom';
import { Box, Drawer, Tab } from '@mui/material';

import { TabContext, TabList } from '@mui/lab';
import { MimeType } from 'constants/editor';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { DescriptionOutlined } from '@mui/icons-material';
import { findCurrentPageLink } from 'features/linkSlices';
import { CustomViewer } from './CustomViewer';
import { PagesView } from './CustomViewer/PagesView';
import { CalendarView } from './CustomViewer/CalendarView';

interface SideBarProps {
  open: boolean;
  sidebarWidth: number;
}

const useStyles = makeStyles<SideBarProps>()((theme, props) => ({
  title: {
    flexGrow: 1,
    padding: '15px 16px',
    // backgroundColor: '#f5f5f5',
  },
  tabListDark: {
    backgroundColor: '#33333',
  },
  tabListLight: {
    // backgroundColor: '#fafafa',
    borderBottom: '1px solid #e8e8e8',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexShrink: 0,
    transform: `translateX(${props.open ? 0 : -props.sidebarWidth}px) translateZ(0)`,
    [`& .MuiDrawer-paper`]: {
      width: props.sidebarWidth,
      boxSizing: 'border-box',
      position: 'absolute',
      transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
      backgroundColor: theme.palette.mode === Theme.Dark ? '#202020' : '#fafcfd',
    },

    [`& .MuiListItem-root`]: {
      paddingTop: 2,
      paddingBottom: 2,
    },

    [`& .MuiTabPanel-root`]: {
      padding: 0,
    },

    [`& .MuiTab-root`]: {
      minWidth: 0,
      padding: '0 16px',
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
}));

interface TabLabelProps {
  children: ReactNode;
}
function TabLabel({ children }: TabLabelProps) {
  return <span style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>{children}</span>;
}

export function SideBar() {
  const dispatch = useDispatch();
  const navState = useSelector((state: AppState) => state.navState);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const currentItem = useSelector(findCurrentPageLink);
  const { openTab: open, sidebarWidth } = navState;
  const { classes } = useStyles({
    open: useLocation().pathname === '/calendar' ? true : open,
    sidebarWidth,
  });
  const { mimeType } = currentItem;

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: NavTabType) => {
    dispatch(toggleLinkTab(newValue));
  };

  return (
    <Drawer variant="permanent" className={classes.drawer} open={open}>
      <TabContext value={navState.openTabValue}>
        <Box
          style={{
            padding: '0px 16px',
          }}
        >
          <TabList
            onChange={handleChange}
            className={menu.theme === Theme.Dark ? classes.tabListDark : classes.tabListLight}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <TabLabel>
                  <DescriptionOutlined /> Pages
                </TabLabel>
              }
              value="pages"
            />
            <Tab
              label={
                <TabLabel>
                  <CalendarMonth /> Date
                </TabLabel>
              }
              value="calendar"
            />
            {mimeType === MimeType.MARKDOWN ? (
              <Tab
                label={
                  <TabLabel>
                    <ListAlt /> H1
                  </TabLabel>
                }
                value="toc"
              />
            ) : undefined}
          </TabList>
        </Box>
        <PagesView />
        <CalendarView />
        <CustomViewer />
      </TabContext>
    </Drawer>
  );
}
