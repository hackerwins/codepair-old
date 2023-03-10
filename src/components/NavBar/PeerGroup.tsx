import React, { useState, useCallback, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import anonymous from 'anonymous-animals-gen';

import Popover from 'components/commons/Popover';
import PeerList from 'components/NavBar/PeerList';
import { AppState } from 'app/rootReducer';
import usePeer from 'hooks/usePeer';

const useStyles = makeStyles((theme) => ({
  group: {
    '& > *': {
      cursor: 'pointer',
    },
  },
  myAvatar: {
    borderColor: theme.palette.secondary.main,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: `2px solid ${theme.palette.secondary.main}`,
    },
  },
}));

const MAX_PEER_VIEW = 4;

export default function PeerGroup() {
  const classes = useStyles();
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const { activePeers } = usePeer();
  const [anchorEl, setAnchorEl] = useState<Element | undefined>();

  const handleViewList = useCallback(
    (event: MouseEvent<Element>) => {
      const target = event.target as HTMLTextAreaElement;
      if (!target.getAttribute('data-id')) {
        setAnchorEl(event.currentTarget);
      }
    },
    [setAnchorEl],
  );

  const handleViewListClose = useCallback(() => {
    setAnchorEl(undefined);
  }, [setAnchorEl]);

  if (!client) {
    // NOTE: We use null as an exception to prevent component from rendering.
    return null;
  }

  return (
    <>
      <AvatarGroup className={classes.group} max={MAX_PEER_VIEW} onClick={handleViewList}>
        {activePeers.map((peer) => {
          const { username, color, image } = peers[peer.id].presence;
          return (
            <Tooltip key={peer.id} title={peer.isMine ? `[ME] ${username}` : username} data-id={peer.id} arrow>
              <Avatar
                alt="Peer Image"
                className={peer.isMine ? classes.myAvatar : ''}
                style={{ backgroundColor: color }}
                src={anonymous.getImage(image)}
              />
            </Tooltip>
          );
        })}
      </AvatarGroup>
      <Popover anchorEl={anchorEl} onClose={handleViewListClose}>
        <PeerList />
      </Popover>
    </>
  );
}
