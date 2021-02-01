import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { Peer } from 'features/peerSlices';

interface PeerListItemProps {
  clientInfo: Peer;
}

const useStyles = makeStyles(() => ({
  root: (props: PeerListItemProps) => ({
    color: props.clientInfo.color,
  }),
}));

export default function PeerListItem(props: PeerListItemProps) {
  const classes = useStyles(props);
  const { clientInfo } = props;

  return <ListItem className={classes.root}>{clientInfo.id}</ListItem>;
}
