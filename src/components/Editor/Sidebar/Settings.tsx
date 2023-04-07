/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Preview, setPreview } from 'features/docSlices';
import { setUserName, setUserColor } from 'features/settingSlices';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import { updatePresenceColor } from 'features/peerSlices';
import { makeStyles } from 'styles/common';
import { debounce, FormControl, TextField } from '@mui/material';

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: '320px',
    borderRadius: '4px',
  },
  header: {
    borderBottom: `1px solid ${theme.palette.text.disabled}`,
  },
  title: {
    padding: '12px 16px',
  },
  list: {
    padding: '8px 18px 18px 18px',
    lineHeight: '19px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    marginTop: '12px',
    pointerEvents: 'none',
  },
  itemTitle: {
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  itemInfo: {
    minWidth: 140,
    paddingLeft: '12px',
    borderRadius: '4px',
    textAlign: 'left',
    pointerEvents: 'auto',
  },
}));

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const { classes } = useStyles();

  const client = useSelector((state: AppState) => state.docState.client);
  const doc = useSelector((state: AppState) => state.docState.doc);
  const menu = useSelector((state: AppState) => state.settingState.menu);

  const debounceSave = useCallback(
    debounce((value) => {
      dispatch(setUserName(value));
    }, 2000),
    [],
  );

  useEffect(() => {
    if (!doc) {
      return;
    }

    const unsubscribe = doc.subscribe((event) => {
      if (event.type === 'remote-change') {
        dispatch(setPreview(doc.getRoot().preview || Preview.HTML));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  const handleInputUserName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      debounceSave(value);
    },
    [debounceSave],
  );

  const handleInputUserColor = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (client) {
        dispatch(updatePresenceColor(value));
      }

      dispatch(setUserColor(value));
    },
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <div className={classes.list}>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Name</div>
          <FormControl className={classes.itemInfo}>
            <TextField
              id="standard-basic"
              variant="standard"
              defaultValue={menu.userName}
              onInput={handleInputUserName}
            />
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Color</div>
          <FormControl
            className={classes.itemInfo}
            style={{
              justifyContent: 'start',
            }}
          >
            <input type="color" defaultValue={menu.userColor} onChange={handleInputUserColor} />
          </FormControl>
        </div>
      </div>
    </div>
  );
}
