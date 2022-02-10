import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface EditorTabProps {
  isSelected: boolean;
  index: number;
}

export default function EditorTab({ isSelected, index }: EditorTabProps){
  return (
    <li className={`editor-tab ${isSelected ? 'selected' : ''}`}>
      <span className="tab-title">{ index }</span>
      <IconButton className="close-btn">
        <CloseIcon />
      </IconButton>
    </li>
  );
}
