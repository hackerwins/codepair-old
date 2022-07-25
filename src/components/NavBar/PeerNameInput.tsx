import React from 'react';
import Input from 'components/commons/Input';
import { makeStyles } from '@material-ui/core/styles';

interface PeerNameInputProps {
  username: string;
  color: string;
}

const useStyles = makeStyles((theme) => ({
  text: {
    color: theme.palette.primary.main,
    fontSize: '12px',
    marginBottom: '6px',
  },
  inputWrapper: {
    marginRight: '20px',
  },
  input: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    padding: '0 8px',
    fontSize: '14px',
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
    <div className={classes.inputWrapper}>
      <aside className={classes.text}>What should we call you?</aside>
      <Input id="peer-name-input" className={classes.input} value={inputValue} onChange={onChangeInput} />
    </div>
  );
}
