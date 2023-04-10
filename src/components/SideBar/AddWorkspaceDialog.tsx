import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { addWorkspace } from 'features/linkSlices';

interface AddWorkspaceDialogProps {
  onClose: () => void;
}

export function AddWorkspaceDialog({ onClose }: AddWorkspaceDialogProps) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const workspaceList = useSelector((state: AppState) =>
    state.linkState.workspaceList?.length
      ? state.linkState.workspaceList
      : [
          {
            id: 'default',
            name: 'Default',
          },
        ],
  );

  const isError = Boolean(workspaceList.find((w) => w.name === name));

  const handleAddWorkspace = () => {
    if (!isError) {
      dispatch(
        addWorkspace({
          workspace: name,
        }),
      );
      onClose();
    }
  };

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>Add workspace</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          style={{
            width: 400,
          }}
          value={name}
          error={isError}
          helperText={isError ? 'Workspace name already exists' : 'Workspace name is able to use'}
          variant="standard"
          onKeyUp={(e: any) => {
            console.log(e);
            if (e.key === 'Enter') {
              handleAddWorkspace();
            }
          }}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" disableElevation onClick={handleAddWorkspace}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
