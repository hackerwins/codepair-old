import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import EraserIcon from 'assets/icons/Eraser';
import MouseIcon from 'assets/icons/Mouse';
import { AppState } from 'app/rootReducer';
import { Tool, setTool } from 'features/boardSlices';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    select: {
      color: theme.palette.primary.main,
    },
  }),
);

export default function Sidebar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tool = useSelector((state: AppState) => state.boardState.tool);

  const handleSelectTool = (nextTool: Tool) => () => {
    dispatch(setTool(nextTool));
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Text" arrow>
        <IconButton
          aria-label="Text"
          className={tool === Tool.None ? classes.select : ''}
          onClick={handleSelectTool(Tool.None)}
        >
          <MouseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Pencel" arrow>
        <IconButton
          aria-label="Pencel"
          className={tool === Tool.Line ? classes.select : ''}
          onClick={handleSelectTool(Tool.Line)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eraser" arrow>
        <IconButton
          aria-label="eraser"
          className={tool === Tool.Eraser ? classes.select : ''}
          onClick={handleSelectTool(Tool.Eraser)}
        >
          <EraserIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
