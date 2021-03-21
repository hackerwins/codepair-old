import React, { memo } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import PeerGroup from 'components/NavBar/PeerGroup';
import ShareButton from 'components/NavBar/ShareButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: 'black',
    },
    items: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    title: {
      flexGrow: 1,
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
  }),
);

function MenuAppBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Yorkie CodePair
          </Typography>
          <div className={classes.items}>
            <ShareButton />
            <PeerGroup />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default memo(MenuAppBar);
