/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

type EditorTabProps = {
  isSelected: boolean;
  onChange: Function;
  // test only
  id: number;
  title: string;
};

export default function EditorTab({ isSelected, onChange, title, id }: EditorTabProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li className={`editor-tab ${isSelected ? 'selected' : ''}`} onClick={() => onChange(id)}>
      <span className="tab-title">{ title }</span>
      <IconButton className="close-btn">
        <CloseIcon />
      </IconButton>
    </li>
  );
}
