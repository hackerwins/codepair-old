import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import PeerListItem from 'components/NavBar/PeerListItem';
import usePeer from 'hooks/usePeer';

export default function PeerList() {
  const { activePeers } = usePeer();

  return (
    <List>
      <ListItem>
        <Typography>Total {activePeers.length}</Typography>
      </ListItem>
      {activePeers.map((clientInfo) => {
        return <PeerListItem key={clientInfo.id} peer={clientInfo} />;
      })}
    </List>
  );
}
