import React from 'react';
import Input from 'components/commons/Input';
import { makeStyles } from '@material-ui/core/styles';

interface PeerNameInputProps {
  username: string;
  color: string;
}

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.common.white,
  },
}));

export default function PeerNameInput({username, color}: PeerNameInputProps) {
  const classes = useStyles();
  const onChangeInput = () => {
    console.log('onChangeInput');
    console.log({username, color});
  };

  const inputValue = username;

  return (
    <div>
      <Input id="peer-name-input" className={classes.input} value={inputValue} onChange={onChangeInput} />
    </div>
  );
}
