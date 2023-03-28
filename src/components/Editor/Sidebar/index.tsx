import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonWithColor from 'components/Editor/Sidebar/ButtonWithColor';
import { AppState } from 'app/rootReducer';
import { ToolType, setTool } from 'features/boardSlices';
import { makeStyles } from 'styles/common';
import { IconButton, Tooltip } from '@mui/material';
import { Theme as ThemeType } from 'features/settingSlices';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import Brush from '@mui/icons-material/Brush';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Mouse from '@mui/icons-material/Mouse';
import Rectangle from '@mui/icons-material/Rectangle';
import TextFields from '@mui/icons-material/TextFields';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    flex: 'none',
    boxSizing: 'border-box',
    borderBottom: theme.palette.mode === ThemeType.Dark ? '1px solid #303030' : '1px solid #e9e9e9',
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
}));

export default function Sidebar() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const tool = useSelector((state: AppState) => state.boardState.toolType);

  const handleSelectTool = (nextTool: ToolType) => () => {
    dispatch(setTool(nextTool));
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Code" arrow className={tool === ToolType.None ? classes.select : classes.button}>
        <IconButton aria-label="Code" onClick={handleSelectTool(ToolType.None)}>
          <TextFields fontSize="small" />
        </IconButton>
      </Tooltip>
      <ButtonWithColor toolType={ToolType.Line} Icon={Brush} fontSize="small" tooltip="Brush" />
      <ButtonWithColor toolType={ToolType.Rect} Icon={Rectangle} fontSize="small" tooltip="Shape" />
      <Tooltip title="Selector" arrow className={tool === ToolType.Selector ? classes.select : classes.button}>
        <IconButton aria-label="selector" onClick={handleSelectTool(ToolType.Selector)}>
          <Mouse fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eraser" arrow className={tool === ToolType.Eraser ? classes.select : classes.button}>
        <IconButton aria-label="eraser" onClick={handleSelectTool(ToolType.Eraser)}>
          <AutoFixHigh fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Clear" arrow className={classes.button}>
        <IconButton aria-label="selector" onClick={handleSelectTool(ToolType.Clear)}>
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
