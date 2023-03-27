import React from "react";
import { ListItem } from '@mui/material';
import { Peer } from 'features/peerSlices';
import { makeStyles } from 'styles/common';

interface PeerListItemProps {
  peer: Peer;
}

const useStyles = makeStyles<PeerListItemProps>()((theme, props) => ({
  root: {
    color: props.peer.presence.color,
  },
}));

export default function PeerListItem(props: PeerListItemProps) {
  const {classes} = useStyles(props);
  const { peer } = props;

  return <ListItem className={classes.root}>{peer.presence.username}</ListItem>;
}
