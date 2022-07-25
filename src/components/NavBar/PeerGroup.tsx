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
import PeerNameInput from './PeerNameInput';

const useStyles = makeStyles((theme) => ({
  group: {
    marginLeft: '20px',
    '& > *': {
      cursor: 'pointer',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
    },
  },
  myAvatar: {
    borderColor: theme.palette.secondary.main,
  },
}));

const MAX_PEER_VIEW = 4;

export default function PeerGroup() {
  const classes = useStyles();
  const client = useSelector((state: AppState) => state.docState.client);
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
          const { username, color, image } = peer.metadata;
          return (
            <div key={peer.id}>
              <PeerNameInput username={username} color={color} />
              <Tooltip title={peer.isMine ? `[ME] ${username}` : username} data-id={peer.id} arrow>
                <Avatar
                  alt="Peer Image"
                  className={peer.isMine ? classes.myAvatar : ''}
                  style={{ backgroundColor: color }}
                  src={anonymous.getImage(image)}
                />
              </Tooltip>
            </div>
          );
        })}
      </AvatarGroup>
      <Popover anchorEl={anchorEl} onClose={handleViewListClose}>
        <PeerList />
      </Popover>
    </>
  );
}
