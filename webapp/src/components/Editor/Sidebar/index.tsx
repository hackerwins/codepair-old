import React, { useState, useCallback, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import SettingsIcon from '@material-ui/icons/Settings';
import BrushIcon from '@material-ui/icons/Brush';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GitHubIcon from '@material-ui/icons/GitHub';

import EraserIcon from 'assets/icons/Eraser';
import MouseIcon from 'assets/icons/Mouse';
import RectIcon from 'assets/icons/Rect';
import Popover from 'components/commons/Popover';
import Settings from 'components/Editor/Sidebar/Settings';
import ButtonWithColor from 'components/Editor/Sidebar/ButtonWithColor';
import { AppState } from 'app/rootReducer';
import { ToolType, setTool } from 'features/boardSlices';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    divider: {
      marginTop: 5,
      marginBottom: 5,
    },
    button: {
      marginLeft: 3,
      marginRight: 3,
      padding: 8,
    },
    select: {
      marginLeft: 3,
      marginRight: 3,
      padding: 8,
      color: theme.palette.primary.main,
    },
  }),
);

export default function Sidebar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tool = useSelector((state: AppState) => state.boardState.toolType);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();

  const handleSelectTool = (nextTool: ToolType) => () => {
    dispatch(setTool(nextTool));
  };

  const handleSettingsClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);



  return (
    <div className={classes.root}>
      <Tooltip title="Settings" arrow>
        <IconButton aria-label="settings" onClick={handleSettingsClick}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="GitHub" arrow className={classes.button}>
        <IconButton aria-label="selector" href="https://github.com/yorkie-team/codepair">
          <GitHubIcon fontSize="default" />
        </IconButton>
      </Tooltip>
      <Divider className={classes.divider} />
      <Tooltip title="Code" arrow className={tool === ToolType.None ? classes.select : classes.button}>
        <IconButton aria-label="Code" onClick={handleSelectTool(ToolType.None)}>
          <TextFieldsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <ButtonWithColor toolType={ToolType.Line} Icon={BrushIcon} fontSize="small" tooltip="Brush" />
      <ButtonWithColor toolType={ToolType.Rect} Icon={RectIcon} fontSize="small" tooltip="Shape" />
      <Tooltip title="Selector" arrow className={tool === ToolType.Selector ? classes.select : classes.button}>
        <IconButton aria-label="selector" onClick={handleSelectTool(ToolType.Selector)}>
          <MouseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eraser" arrow className={tool === ToolType.Eraser ? classes.select : classes.button}>
        <IconButton aria-label="eraser" onClick={handleSelectTool(ToolType.Eraser)}>
          <EraserIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Clear" arrow className={classes.button}>
        <IconButton aria-label="selector" onClick={handleSelectTool(ToolType.Clear)}>
          <DeleteOutlineIcon fontSize="default" />
        </IconButton>
      </Tooltip>

      <Popover anchorEl={anchorEl} onClose={handleSettingsClose}>
        <Settings />
      </Popover>
    </div>
  );
}
