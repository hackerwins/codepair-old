import React, { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import Fade from 'components/commons/Fade';
import { AppState } from 'app/rootReducer';
import { DocStatus } from 'features/docSlices';
import QRCode from 'react-qr-code';
import { makeStyles } from 'styles/common';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import { Close, FileCopy, Group } from '@mui/icons-material';

import CopyToClipboard from 'react-copy-to-clipboard';

const useStyles = makeStyles()(() => ({
  dialog: {
    borderRadius: '4px',
  },
  input: {
    width: '300px',
    padding: '12px 8px',
    fontSize: '18px',
    borderRadius: '5px',
    outline: 'none',
    backgroundColor: 'hsla(0,0%,100%,0.9)',
  },
  box: {
    '@media only screen and (max-width: 600px)': {
      display: 'none',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    lineHeight: '24px',
  },
}));

export default function ShareButton() {
  const {classes} = useStyles();
  const status = useSelector((state: AppState) => state.docState.status);
  const [open, setOpen] = useState(false);
  const [showCopyText, setShowCopyText] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const copyUrl = window.location.href.split('?')[0];

  const onFocus = useCallback(() => {
    inputRef.current?.select();
  }, []);

  const onCopy = useCallback(() => {
    setShowCopyText(true);
  }, []);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div className={classes.box}>
      <Button
        className={classes.button}
        size="small"
        color="primary"
        variant="contained"
        startIcon={<Group />}
        onClick={openModal}
        disabled={status === DocStatus.Disconnect}
      >
        Share
      </Button>
      <Dialog open={open} onClose={closeModal} className={classes.dialog}>
        <DialogTitle>Share Code
        
          <IconButton aria-label="close" onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box my={3}>
            <Typography>Anyone can access the code in real time through this URL.</Typography>
          </Box>
          <Box my={1}>
            <DialogContentText>Share this URL</DialogContentText>
          </Box>
          <Box display="flex">
            <input readOnly ref={inputRef} className={classes.input} value={copyUrl} onFocus={onFocus} />
            <CopyToClipboard text={copyUrl} onCopy={onCopy}>
              <IconButton color="primary">
                <FileCopy />
              </IconButton>
            </CopyToClipboard>
            <Fade show={showCopyText} onFadeout={() => setShowCopyText(false)}>
              <p>Copy!</p>
            </Fade>
          </Box>
          <Box my={1} style={{ marginTop: 10 }}>
            <DialogContentText>QRCode</DialogContentText>
          </Box>
          <Box>
            <IconButton aria-label="selector">
              <QRCode value={copyUrl} style={{ width: 150, height: 150 }} />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary" variant="contained" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
