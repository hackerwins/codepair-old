import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

export default function AddButton() {
  return (
    <IconButton className="add-btn" type="button">
      <AddIcon />
    </IconButton>
  );
}
