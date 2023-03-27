import React from 'react';

import PeerListItem from 'components/NavBar/PeerListItem';
import usePeer from 'hooks/usePeer';
import { List, ListItem, Typography } from '@mui/material';

export default function PeerList() {
  const { activePeers } = usePeer();

  return (
    <List>
      <ListItem>
        <Typography>Total {activePeers.length}</Typography>
      </ListItem>
      {activePeers.map((peer) => {
        return <PeerListItem key={peer.id} peer={peer} />;
      })}
    </List>
  );
}
