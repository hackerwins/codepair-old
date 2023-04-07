import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Settings from 'components/Editor/Sidebar/Settings';

export interface SettingsDialogProps {
  open: boolean;
  handleClose: () => void;
}

export function SettingsDialog({ open, handleClose }: SettingsDialogProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6">User Settings</Typography>
      </DialogTitle>
      <DialogContent>
        <Settings />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
