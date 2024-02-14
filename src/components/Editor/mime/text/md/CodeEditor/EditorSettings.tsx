/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, ChangeEvent } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import { Preview, setPreview } from 'features/docSlices';
import { CodeKeyMap, TabSize, setCodeKeyMap, setTabSize } from 'features/settingSlices';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import { makeStyles } from 'styles/common';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

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

export default function EditorSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { classes } = useStyles();

  const doc = useSelector((state: AppState) => state.docState.doc);
  const preview = useSelector((state: AppState) => state.docState.preview);
  const menu = useSelector((state: AppState) => state.settingState.menu);

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

  const handlePreviewChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (!doc) {
        return;
      }
      const value = event.target.value as Preview;
      doc.update((root) => {
        // eslint-disable-next-line no-param-reassign
        root.preview = value;
      });

      dispatch(setPreview(value));
    },
    [doc, dispatch],
  );

  function handleChange<T>(action: ActionCreatorWithPayload<T>) {
    return (event: ChangeEvent<HTMLSelectElement>) => {
      dispatch(action(event.target.value as T));
    };
  }

  return (
    <div className={classes.root}>
      <div className={classes.list}>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Preview</div>
          <FormControl className={classes.itemInfo}>
            <NativeSelect name="preview" value={preview} onChange={handlePreviewChange}>
              {Object.entries(Preview).map(([display, value]: [string, string]) => {
                return (
                  <option value={value} key={value}>
                    {display}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Tab Size</div>
          <FormControl className={classes.itemInfo}>
            <NativeSelect value={menu?.tabSize} onChange={handleChange(setTabSize)}>
              {Object.entries(TabSize).map(([key, tabSize]: [string, string]) => {
                return (
                  <option value={tabSize} key={key}>
                    {`${tabSize} spaces`}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
        </div>
        <div className={classes.item}>
          <div className={classes.itemTitle}>Key Binding</div>
          <FormControl className={classes.itemInfo}>
            <NativeSelect name="codeKeyMap" value={menu?.codeKeyMap} onChange={handleChange(setCodeKeyMap)}>
              {Object.entries(CodeKeyMap).map(([display, codeKeyMap]: [string, string]) => {
                return (
                  <option value={codeKeyMap} key={codeKeyMap}>
                    {display}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
