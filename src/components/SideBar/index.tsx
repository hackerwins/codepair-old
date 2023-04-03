import React, { ReactNode } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { favoriteSelector } from 'features/linkSlices';
import { Theme } from 'features/settingSlices';
import { NavTabType, toggleLinkTab } from 'features/navSlices';
import { makeStyles } from 'styles/common';
import EventNote from '@mui/icons-material/EventNote';
import Star from '@mui/icons-material/Star';
import ListAlt from '@mui/icons-material/ListAlt';
import AccountTree from '@mui/icons-material/AccountTree';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Tab,
  Typography,
} from '@mui/material';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { MimeType } from 'constants/editor';
import { PageButton } from 'components/NavBar/PageButton';
import { Delete } from '@mui/icons-material';
import { removeCurrentPage } from 'features/currentSlices';
import Mouse from '@mui/icons-material/Mouse';
import { HeadingView } from './HeadingView';
import { HeadingItem } from './HeadingItem';

import { SidebarItem } from './SidebarItem';
import { GroupView } from './GroupView';
import { LinkTreeView } from './LinkTreeView';

interface SideBarProps {
  open: boolean;
}

const SIDEBAR_WIDTH = 300;

const useStyles = makeStyles<SideBarProps>()((theme, props) => ({
  title: {
    flexGrow: 1,
    padding: '15px 16px',
    backgroundColor: '#f5f5f5',
  },
  tabListDark: {
    backgroundColor: '#33333',
  },
  tabListLight: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #e8e8e8',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexShrink: 0,
    transform: `translateX(${props.open ? 0 : -SIDEBAR_WIDTH}px) translateZ(0)`,
    [`& .MuiDrawer-paper`]: {
      width: SIDEBAR_WIDTH,
      boxSizing: 'border-box',
      position: 'absolute',
      transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
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
  listItemText: {
    [`& .MuiTypography-root`]: {
      fontSize: '0.875rem',
      paddingLeft: 8,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  listSubHeader: {
    lineHeight: 1.5,
    [`&:hover .group-item-button`]: {
      visibility: 'visible !important' as any,
    },
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  sidebarItem: {
    [`&:hover .sidebar-item-more`]: {
      visibility: 'visible !important' as any,
    },
  },
  level0: {
    paddingLeft: theme.spacing(0),
  },
  level1: {
    paddingLeft: theme.spacing(3),
  },
  level2: {
    paddingLeft: theme.spacing(6),
  },
  level3: {
    paddingLeft: theme.spacing(9),
  },
  level4: {
    paddingLeft: theme.spacing(12),
  },
  level5: {
    paddingLeft: theme.spacing(15),
  },
  level6: {
    paddingLeft: theme.spacing(18),
  },
  level7: {
    paddingLeft: theme.spacing(21),
  },
  level8: {
    paddingLeft: theme.spacing(24),
  },
  level9: {
    paddingLeft: theme.spacing(27),
  },
  level10: {
    paddingLeft: theme.spacing(30),
  },
  moreMenu: {},
  tooltip: {
    '& .MuiTooltip-tooltip': {
      fontSize: '1.5rem',
    },
  },
}));

interface TabLabelProps {
  children: ReactNode;
}
function TabLabel({ children }: TabLabelProps) {
  return <span style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>{children}</span>;
}

type TabPanelHeaderProps = {
  children: ReactNode;
  tools?: ReactNode;
};

function TabPanelHeader({ children, tools = '' }: TabPanelHeaderProps) {
  return (
    <ListSubheader>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h6"
          style={{ fontWeight: 400, fontSize: 14, height: 40, display: 'flex', alignItems: 'center' }}
        >
          {children}
        </Typography>
        {tools}
      </Box>
    </ListSubheader>
  );
}

TabPanelHeader.defaultProps = {
  tools: '',
};

export function SideBar() {
  const dispatch = useDispatch();
  const navState = useSelector((state: AppState) => state.navState);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const favorites = useSelector(favoriteSelector);
  const recents = useSelector((state: AppState) => state.currentState.recents);
  const open = navState.openTab;
  const { classes } = useStyles({
    open: useLocation().pathname === '/calendar' ? true : open,
  });
  const root = doc?.getRoot();
  const mimeType = root?.mimeType || MimeType.MARKDOWN;
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: NavTabType) => {
    dispatch(toggleLinkTab(newValue));
  };

  const handleDeleteRecentItem = (index: number) => {
    dispatch(removeCurrentPage({ index }));
  };

  return (
    <Drawer variant="permanent" className={classes.drawer} open={open}>
      <TabContext value={navState.openTabValue}>
        <Box>
          <TabList
            onChange={handleChange}
            className={menu.theme === Theme.Dark ? classes.tabListDark : classes.tabListLight}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <TabLabel>
                  <EventNote /> Notes
                </TabLabel>
              }
              value="notes"
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
        <TabPanel value="notes">
          <TabPanelHeader>
            <Button
              onClick={() => navigate('/calendar')}
              style={{
                color: 'GrayText',
              }}
            >
              <CalendarToday
                fontSize="small"
                style={{
                  marginRight: 6,
                }}
              />{' '}
              Calendar
            </Button>
          </TabPanelHeader>
          <Divider />
          <TabPanelHeader>
            <Mouse
              fontSize="small"
              style={{
                marginRight: 6,
              }}
            />
            Recents
          </TabPanelHeader>
          <List
            style={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
            dense
          >
            {recents?.map((it, index) => {
              if (!it) {
                return null;
              }

              return (
                <ListItem key={it.fullLink}>
                  <ListItemText
                    primary={it.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: {
                        fontSize: '0.875rem',
                        paddingLeft: 28,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => {
                      navigate(it.fileLink);
                    }}
                  />
                  <IconButton size="small" onClick={() => handleDeleteRecentItem(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <TabPanelHeader>
            <Star
              fontSize="small"
              style={{
                marginRight: 6,
              }}
            />{' '}
            Favorites
          </TabPanelHeader>
          {favorites.map((it) => {
            if (!it) {
              return null;
            }

            if (it.type === 'link' && it.linkType === 'heading') {
              return <HeadingItem key={it.id} item={it} level={0} loopType="favorite" />;
            }

            return it.type === 'group' ? (
              <GroupView key={it.id} group={it} loopType="favorite" />
            ) : (
              <SidebarItem key={it.id} item={it} level={0} loopType="favorite" />
            );
          })}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <TabPanelHeader
            tools={
              <PageButton
                insertTarget="root"
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              />
            }
          >
            <AccountTree
              fontSize="small"
              style={{
                marginRight: 6,
              }}
            />
            Workspaces
          </TabPanelHeader>
          <div>
            <LinkTreeView />
          </div>
          <Box height={100} />
        </TabPanel>

        {mimeType === MimeType.MARKDOWN ? <HeadingView /> : undefined}
      </TabContext>
    </Drawer>
  );
}
