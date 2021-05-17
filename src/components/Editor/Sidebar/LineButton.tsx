import React, { useCallback, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import BrushIcon from '@material-ui/icons/Brush';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import Popover from 'components/commons/Popover';
import { AppState } from 'app/rootReducer';
import { ToolType, setTool, Color, setColor } from 'features/boardSlices';

const useStyles = makeStyles((theme) =>
  createStyles({
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
    box: {
      width: '184px',
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    colorIcon: {
      '&:hover': {
        cursor: 'pointer',
      },
      width: theme.spacing(3.1),
      height: theme.spacing(3.1),
    },
    badge: {
      backgroundColor: ({ color }: { color: Color }) => color,
    },
  }),
);

export default function LineButton() {
  const dispatch = useDispatch();
  const tool = useSelector((state: AppState) => state.boardState.tool);
  const color = useSelector((state: AppState) => state.boardState.color);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const classes = useStyles({ color });

  const handleOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [tool],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  const handleSelectTool = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (tool === ToolType.Line) {
        handleOpen(event);
        return;
      }

      dispatch(setTool(ToolType.Line));
    },
    [tool, color],
  );

  const handleSelectColor = (nextColor: Color) => () => {
    dispatch(setTool(ToolType.Line));
    dispatch(setColor(nextColor));
    handleClose();
  };

  return (
    <>
      <Tooltip title="Brush" arrow className={tool === ToolType.Line ? classes.select : classes.button}>
        <IconButton aria-label="Brush" onClick={handleSelectTool}>
          {tool === ToolType.Line ? (
            <Badge
              variant="dot"
              classes={{ badge: classes.badge }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <BrushIcon fontSize="small" />
            </Badge>
          ) : (
            <BrushIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={2} className={classes.box}>
          {Object.entries(Color).map(([name, _color]: [string, Color]) => {
            const selected = color === _color && tool === ToolType.Line;
            return (
              <Tooltip key={name} title={name} arrow>
                <Box border={3} borderRadius="50%" borderColor={selected ? 'primary.main' : ''}>
                  <Avatar
                    className={classes.colorIcon}
                    style={{ backgroundColor: _color }}
                    onClick={handleSelectColor(_color)}
                  >
                    {/* If there are no spaces, the default svg is output. */}{' '}
                  </Avatar>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Popover>
    </>
  );
}
