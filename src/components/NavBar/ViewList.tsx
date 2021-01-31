import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ViewItem from 'components/NavBar/ViewItem';
import usePeer from 'hooks/usePeer';

export default function ViewList() {
  const { activePeers } = usePeer();

  return (
    <List>
      <ListItem>
        <Typography>Total {activePeers.length}</Typography>
      </ListItem>
      {activePeers.map((clientInfo) => {
        return <ViewItem key={clientInfo.id} clientInfo={clientInfo} />;
      })}
    </List>
  );
}
