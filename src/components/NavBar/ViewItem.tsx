import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { Peer } from 'features/peerSlices';

interface ViewItemProps {
  clientInfo: Peer;
}

const useStyles = makeStyles(() => ({
  root: (props: ViewItemProps) => ({
    color: props.clientInfo.color,
  }),
}));

export default function ViewItem(props: ViewItemProps) {
  const classes = useStyles(props);
  const { clientInfo } = props;

  return <ListItem className={classes.root}>{clientInfo.id}</ListItem>;
}
