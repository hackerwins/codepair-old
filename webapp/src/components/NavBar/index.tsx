import React, { memo } from 'react';
import { Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PeerGroup from 'components/NavBar/PeerGroup';
import NameTextInput from 'components/NavBar/NameTextInput';
import ShareButton from 'components/NavBar/ShareButton';
import NetworkButton from 'components/NavBar/NetworkButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: 'black',
    },
    grow: {
      flexGrow: 1,
    },
    title: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1),
    },
    items: {
      display: 'flex',
      '& > *': {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(1),
      },
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
            <Link href="/" underline="none">
              CodePair
            </Link>
          </Typography>
          <NetworkButton />
          <div className={classes.grow} />
          <div className={classes.items}>
            <NameTextInput />
            <ShareButton />
            <PeerGroup />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default memo(MenuAppBar);
