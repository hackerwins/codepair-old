/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppState } from 'app/rootReducer';
import { ToolType, setTool, Color, setColor } from 'features/boardSlices';
import { makeStyles } from 'styles/common';
import { Avatar, Badge, Box, IconButton, Popover, SvgIcon, SvgIconProps, Tooltip } from '@mui/material';

const useStyles = makeStyles<{ color: Color }>()((theme, { color }) => ({
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
    backgroundColor: color,
  },
}));

interface ButtonWithColorProps extends SvgIconProps {
  tooltip: string;
  toolType: ToolType;
  Icon: typeof SvgIcon;
}

export default function ButtonWithColor({ toolType, Icon, tooltip, fontSize }: ButtonWithColorProps) {
  const dispatch = useDispatch();
  const currentToolType = useSelector((state: AppState) => state.boardState.toolType);
  const color = useSelector((state: AppState) => state.boardState.color);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const { classes } = useStyles({ color });

  const handleOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [currentToolType],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  const handleSelectTool = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (currentToolType === toolType) {
        handleOpen(event);
        return;
      }

      dispatch(setTool(toolType));
    },
    [currentToolType, color],
  );

  const handleSelectColor = (nextColor: Color) => () => {
    dispatch(setTool(toolType));
    dispatch(setColor(nextColor));
    handleClose();
  };

  return (
    <>
      <Tooltip title={tooltip} arrow className={currentToolType === toolType ? classes.select : classes.button}>
        <IconButton aria-label={tooltip} onClick={handleSelectTool}>
          {currentToolType === toolType ? (
            <Badge
              variant="dot"
              classes={{ badge: classes.badge }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Icon fontSize={fontSize} />
            </Badge>
          ) : (
            <Icon fontSize={fontSize} />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
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
            const selected = color === _color && currentToolType === toolType;
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
