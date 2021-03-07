import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import EraserIcon from 'assets/icons/Eraser';
import { AppState } from 'app/rootReducer';
import { Tool, setTool } from 'features/boardSlices';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    select: {
      color: indigo[300],
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
      <IconButton
        aria-label="edit"
        className={tool === Tool.Line ? classes.select : ''}
        onClick={handleSelectTool(Tool.Line)}
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <IconButton
        aria-label="eraser"
        className={tool === Tool.Eraser ? classes.select : ''}
        onClick={handleSelectTool(Tool.Eraser)}
      >
        <EraserIcon />
      </IconButton>
    </div>
  );
}
