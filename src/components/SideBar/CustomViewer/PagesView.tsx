import React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRecents } from 'features/navSlices';
import { removeCurrentPage } from 'features/currentSlices';

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Delete from '@mui/icons-material/Delete';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { AppState } from 'app/rootReducer';
import { recentsSelector } from 'features/linkSlices';
import { makeStyles } from 'styles/common';

import { Theme } from 'features/settingSlices';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import MouseOutlined from '@mui/icons-material/MouseOutlined';

import { LinkTreeView } from '../LinkTreeView';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: 'calc(100vh - 150px)',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 900,
    cursor: 'pointer',
    color: theme.palette.mode === Theme.Dark ? '#fff' : '#000',
    backgroundColor: theme.palette.mode === Theme.Dark ? '#202020' : '#fafcfd',
  },
  recentItem: {
    borderRadius: 4,
    '&:hover': {
      backgroundColor: theme.palette.mode === Theme.Dark ? '#333333' : '#f5f5f5',
    },
  },
}));

export function PagesView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const navState = useSelector((state: AppState) => state.navState);
  const recents = useSelector(recentsSelector());
  const { openRecents, openTabValue } = navState;

  const handleOpenRecents = () => {
    dispatch(toggleRecents());
  };

  const handleDeleteRecentItem = (id: string) => {
    dispatch(removeCurrentPage({ id }));
  };

  return (
    <TabPanel
      value="pages"
      className={classes.root}
      style={{
        display: openTabValue !== 'pages' ? 'none' : 'flex',
        flexDirection: 'column',
        padding: 10,
      }}
    >
      <ListSubheader className={classes.header} onClick={() => handleOpenRecents()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <MouseOutlined fontSize="small" />
          Recents
        </div>
        <div>{openRecents ? <ExpandMore fontSize="small" /> : <NavigateNext fontSize="small" />}</div>
      </ListSubheader>

      <Collapse in={openRecents} timeout="auto" unmountOnExit>
        <List
          style={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
          dense
        >
          {recents?.map((it) => {
            return (
              <ListItem key={it.fileLink} className={classes.recentItem}>
                <ListItemText
                  primary={it.name}
                  primaryTypographyProps={{
                    noWrap: true,
                    style: {
                      fontSize: '0.875rem',
                      paddingLeft: 26,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    navigate(`${it.fileLink}`);
                  }}
                />
                <IconButton size="small" onClick={() => handleDeleteRecentItem(it.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>

      {openRecents ? <div style={{ height: 30, flex: 'none', backgroundColor: 'divider' }} /> : undefined}
      <ListSubheader className={classes.header}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <DescriptionOutlined fontSize="small" /> Links
        </div>
      </ListSubheader>
      <List
        dense
        style={{
          overflow: 'auto',
          height: 'calc(100vh - 200px)',
          paddingTop: 0,
        }}
      >
        <LinkTreeView />
      </List>
    </TabPanel>
  );
}
