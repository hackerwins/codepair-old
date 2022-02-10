/* eslint-disable no-param-reassign */
import React, { MouseEvent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// import { selectDoc } from 'features/docSlices';
// import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

interface EditorTabProps {
  isSelected: boolean;
  index: number;
}

export default function EditorTab({ isSelected, index }: EditorTabProps) {
  const history = useHistory();
  // const doc = useSelector(selectDoc);

  // TODO: Need deletion
  const deleteTab = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    history.push({ search: `?tab=${index - 1}` });
  };

  return (
    <Link to={{ search: `?tab=${index}` }} className={`editor-tab ${isSelected ? 'selected' : ''}`}>
      <span className="tab-title">{index}</span>
      {index === 0 ? null : (
        <IconButton className="close-btn" onClick={(e) => deleteTab(e)}>
          <CloseIcon />
        </IconButton>
      )}
    </Link>
  );
}
