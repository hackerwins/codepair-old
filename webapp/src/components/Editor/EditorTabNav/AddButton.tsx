import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { selectDoc } from 'features/docSlices';
import { useSelector } from 'react-redux';
import { JSONObject } from 'yorkie-js-sdk';

export default function AddButton() {
  const doc = useSelector(selectDoc);
  const addTab = () => {
    doc?.update((root) => {
      root.contents.push({} as JSONObject);
      (root.contents[root.contents.length - 1] as JSONObject).createText('code');
    });
  };

  return (
    <IconButton className="add-btn" type="button" onClick={addTab}>
      <AddIcon />
    </IconButton>
  );
}
