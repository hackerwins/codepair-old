import React, { useState, useCallback, MouseEvent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

import { useSelector } from 'react-redux';

import Popover from 'components/Popover';
import ViewList from 'components/NavBar/ViewList';

import { AppState } from 'app/rootReducer';
import usePeer from 'hooks/usePeer';

const useStyles = makeStyles(() => ({
  group: {
    '& > *': {
      cursor: 'pointer',
    },
  },
}));

const MAX_PEER_VIEW = 4;

export default function Viewer() {
  const classes = useStyles();
  const client = useSelector((state: AppState) => state.docState.client);
  const { activePeers } = usePeer();
  const [anchorEl, setAnchorEl] = useState<Element | undefined>();

  const handleViewList = useCallback((event: MouseEvent<Element>) => {
    const target = event.target as HTMLTextAreaElement;

    // open view list
    if (target.getAttribute('data-id') === null) {
      setAnchorEl(event.currentTarget);
    }
  }, []);

  const handleViewListClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  if (!client) {
    return null;
  }

  return (
    <>
      <AvatarGroup className={classes.group} max={MAX_PEER_VIEW} onClick={handleViewList}>
        {activePeers.map((clientInfo) => {
          return (
            <Tooltip key={clientInfo.id} title={clientInfo.id} data-id={clientInfo.id} arrow>
              <Avatar
                alt="PeerImage"
                style={{ backgroundColor: clientInfo.color }}
                // TODO change image
                src="/static/images/avatar/1.jpg"
              />
            </Tooltip>
          );
        })}
      </AvatarGroup>
      <Popover anchorEl={anchorEl} onClose={handleViewListClose}>
        <ViewList />
      </Popover>
    </>
  );
}
