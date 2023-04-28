import React from 'react';
import { TabPanel } from '@mui/lab';
import Mouse from '@mui/icons-material/Mouse';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRecents } from 'features/navSlices';
import { removeCurrentPage } from 'features/currentSlices';
import { Box, Collapse, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import Star from '@mui/icons-material/Star';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { AppState } from 'app/rootReducer';
import { recentsSelector } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import { LinkTreeView } from '../LinkTreeView';

import { TabPanelHeader } from './TabPanelHeader';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 160px)',
  },
}));

export function PagesView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const navState = useSelector((state: AppState) => state.navState);
  const recents = useSelector(recentsSelector());

  const { openRecents } = navState;

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
        padding: 10,
      }}
    >
      <TabPanelHeader onClick={() => handleOpenRecents()} tools={openRecents ? <ExpandMore /> : <NavigateNext />}>
        <Mouse
          fontSize="small"
          style={{
            marginRight: 6,
          }}
        />
        Recents
      </TabPanelHeader>
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
              <ListItem key={it.fileLink}>
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
      <TabPanelHeader>
        <Star fontSize="small" style={{ marginRight: 6 }} /> Links
      </TabPanelHeader>
      <List dense>
        <LinkTreeView />
      </List>
      <Box height={100} />
    </TabPanel>
  );
}
