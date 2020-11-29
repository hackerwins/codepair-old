import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SettingsIcon from '@material-ui/icons/Settings';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Modal from '../Modal';
import CodeSetting from './CodeSetting';

import { IAppState } from '../../store/store';
import { CodeMode, SetCodeMode } from '../../actions/settingActions';

import { LocalStorage, SettingModel } from '../../data/browser-storage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.grey['800'],
      padding: '6px',
      position: 'relative',
    },
    formControl: {
      minWidth: 140,
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.grey['800']}`,
      borderRadius: '4px',
    },
    selectEmpty: {
      paddingLeft: '12px',
    },
    box: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);

export default function CodeNavBar() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const menu = useSelector((state: IAppState) => state.settingState.menu);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCodeModeChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name = '', value } = event.target;

    dispatch(SetCodeMode(event.target.value as CodeMode));
  };

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="space-between" alignItems="flex-end">
        <Grid item>
          <FormControl className={classes.formControl}>
            <Select
              name="codeMode"
              value={menu.codeMode}
              onChange={handleCodeModeChange}
              className={classes.selectEmpty}
              disableUnderline
              displayEmpty
            >
              {Object.entries(CodeMode).map(([display, mode]: [string, string]) => {
                return (
                  <MenuItem value={mode} key={mode}>
                    {display}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <SettingsIcon onClick={() => setIsModalOpen(true)} />
        </Grid>
      </Grid>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CodeSetting />
      </Modal>
    </div>
  );
}
