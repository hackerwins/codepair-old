import React, { ChangeEvent, useEffect, useState } from 'react';
import Input from 'components/commons/Input';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { syncPeer } from 'features/peerSlices';

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

export default function PeerNameInput() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const client = useSelector((state: AppState)=> state.docState.client);
  const doc = useSelector((state: AppState)=> state.docState.doc);
  // const peers = useSelector((state: AppState)=> state.peerState.peers);

  const handleNameInput = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.currentTarget;
    setInputValue(value);
  };

  useEffect(()=> {
    const currentName = client?.getPresence().username;
    if (!currentName) return;
    setInputValue(currentName);
  }, []);

  useEffect(()=> {
    if (!client || !doc) {
      return;
    }

    client.updatePresence('username', inputValue);
    const clientId = client.getID();
    const documentKey = doc.getKey();

    const changedPeers = client.getPeers(documentKey);

    dispatch(syncPeer({
      myClientID: clientId || '',
      changedPeers,
    }));

  }, [inputValue]);


  return (
    <div className={classes.inputWrapper}>
      <aside className={classes.text}>What should we call you?</aside>
      <Input id="peer-name-input" className={classes.input} value={inputValue} onChange={handleNameInput} />
    </div>
  );
}
