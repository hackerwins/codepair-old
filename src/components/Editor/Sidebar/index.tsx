import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import EraserIcon from 'assets/icons/Eraser';
import MouseIcon from 'assets/icons/Mouse';
import RectIcon from 'assets/icons/Rect';
import LineButton from 'components/Editor/Sidebar/LineButton';
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
  const tool = useSelector((state: AppState) => state.boardState.tool);

  const handleSelectTool = (nextTool: ToolType) => () => {
    dispatch(setTool(nextTool));
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Code" arrow className={tool === ToolType.None ? classes.select : classes.button}>
        <IconButton aria-label="Code" onClick={handleSelectTool(ToolType.None)}>
          <CodeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Divider className={classes.divider} />
      <LineButton />
      <Tooltip title="Rect" arrow className={tool === ToolType.Rect ? classes.select : classes.button}>
        <IconButton aria-label="rect" onClick={handleSelectTool(ToolType.Rect)}>
          <RectIcon fontSize="small" />
        </IconButton>
      </Tooltip>
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
    </div>
  );
}
