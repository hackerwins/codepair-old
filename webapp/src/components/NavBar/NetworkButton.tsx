import React, { useState, useCallback, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import Popover from 'components/commons/Popover';
import { AppState } from 'app/rootReducer';
import { DocStatus } from 'features/docSlices';

interface NetworkAlertProps {
  title: string;
  subTitle: string;
  content: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '380px',
    },
    title: {
      backgroundColor: 'hsla(0,0%,100%,0.1)',
      '& > *': {
        fontWeight: 'bold',
      },
    },
  }),
);

function NetworkAlert({ title, subTitle, content }: NetworkAlertProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box px={2} py={1.5} className={classes.title}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box px={2} p={1}>
        <Box py={1}>
          <Typography variant="body1">{subTitle}</Typography>
        </Box>

        <Box pb={2.5}>
          <Typography variant="body2">{content}</Typography>
        </Box>
      </Box>
    </div>
  );
}

function NetworkDisconnect(props: { hasLocalChanges: boolean }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const { hasLocalChanges } = props;
  const handleOpen = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  return (
    <>
      <Button aria-label="doc-status" color="secondary" onClick={handleOpen}>
        <CloudOffIcon />
      </Button>

      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <NetworkAlert
          title={hasLocalChanges ? "There are changes that couldn't be sent to Server" : 'All Changes saved to Server'}
          subTitle="This document is ready for offline use"
          content="Looks like you're offline. Changes will save to this memory now, and save to Server once reconnected."
        />
      </Popover>
    </>
  );
}

function NetworkConnect() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const handleOpen = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  return (
    <>
      <Button aria-label="doc-status" color="secondary" onClick={handleOpen}>
        <CloudDoneIcon />
      </Button>

      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <NetworkAlert
          title="All Changes saved to Server"
          subTitle="This document is ready for offline use"
          content="You can edit this document without an internet connection. Changes will save to Server once reconnected."
        />
      </Popover>
    </>
  );
}

export default function NetworkButton() {
  const status = useSelector((state: AppState) => state.docState.status);
  const hasLocalChanges = useSelector((state: AppState) => {
    return state.docState.doc ? state.docState.doc.hasLocalChanges() : false;
  });

  if (status === DocStatus.Connect) {
    return <NetworkConnect />;
  }
  return <NetworkDisconnect hasLocalChanges={hasLocalChanges} />;
}
