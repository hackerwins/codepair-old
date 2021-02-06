import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { Peer } from 'features/peerSlices';

interface PeerListItemProps {
  peer: Peer;
}

const useStyles = makeStyles(() => ({
  root: (props: PeerListItemProps) => ({
    color: props.peer.color,
  }),
}));

export default function PeerListItem(props: PeerListItemProps) {
  const classes = useStyles(props);
  const { peer } = props;

  return <ListItem className={classes.root}>{peer.username}</ListItem>;
}
