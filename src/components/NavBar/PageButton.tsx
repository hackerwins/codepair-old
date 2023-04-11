import React, { useCallback, useState } from 'react';
import { Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import EventNote from '@mui/icons-material/EventNote';
import Gesture from '@mui/icons-material/Gesture';
import { createDoc } from 'features/docSlices';
import yorkie from 'yorkie-js-sdk';
import { AppState } from 'app/rootReducer';
import { findCurrentPageLink, ItemType, newLink } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import { MimeType } from 'constants/editor';
import { useNavigate } from 'react-router-dom';
import { createDocumentKey, createRandomColor } from 'utils/document';

const useStyles = makeStyles()(() => ({
  menu: {
    '& .MuiMenu-paper': {
      width: 200,
    },
  },
}));

interface PageButtonProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  insertTarget: 'root' | 'current' | ItemType;
  variant?: 'text' | 'outlined' | 'contained';
  transformOrigin?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
  anchorOrigin?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
  onClose?: () => void;
}

export function PageButton({
  insertTarget = 'root',
  title,
  icon = <Add />,
  variant,
  transformOrigin,
  anchorOrigin,
  onClose,
}: PageButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector((state: AppState) => state.docState.client);
  const currentItem = useSelector(findCurrentPageLink);
  const { classes } = useStyles();

  let parentId = '';

  switch (insertTarget) {
    case 'root':
      parentId = '';
      break;
    case 'current':
      parentId = currentItem?.id || '';
      break;
    default:
      parentId = insertTarget?.id;
      break;
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    onClose?.();
  }, [onClose]);

  const open = Boolean(anchorEl);

  const handleCreateWhiteboard = useCallback(
    async (name: string) => {
      const newDocKey = `${createDocumentKey()}`;
      const fileLink = `/${newDocKey}`;
      const mimeType = 'application/vnd.pairy.whiteboard';

      if (client) {
        await dispatch(
          createDoc({
            client,
            docKey: `codepairs-${newDocKey}`,
            init: (root: any) => {
              const newRoot = root;
              if (!newRoot.mimeType) {
                newRoot.mimeType = mimeType;
              }

              newRoot.whiteboard = {
                shapes: {},
                bindings: {},
                assets: {},
              };
            },
          }) as any,
        );

        setTimeout(() => {
          dispatch(newLink({ parentId, name, mimeType, fileLink, color: createRandomColor(), emoji: '📅' }));
          setTimeout(() => navigate(fileLink), 100);
          handleMenuClose();
        }, 1000);
      }
    },
    [dispatch, client, parentId, navigate, handleMenuClose],
  );

  const handleCreateMilkdown = useCallback(
    async (name: string) => {
      const newDocKey = `${createDocumentKey()}`;
      const fileLink = `/${newDocKey}`;
      const mimeType = MimeType.MILKDOWN;

      if (client) {
        dispatch(
          createDoc({
            client,
            docKey: `codepairs-${newDocKey}`,
            init: (root: any) => {
              const newRoot = root;
              if (!newRoot.mimeType) {
                newRoot.mimeType = mimeType;
              }

              if (!newRoot.content) {
                newRoot.content = new yorkie.Text();
              }
            },
          }) as any,
        );

        setTimeout(() => {
          dispatch(newLink({ parentId, name, mimeType, fileLink, color: createRandomColor(), emoji: '📅' }));
          setTimeout(() => navigate(fileLink), 100);
          handleMenuClose();
        }, 1000);
      }
    },
    [dispatch, client, parentId, navigate, handleMenuClose],
  );

  const handleCreateLink = useCallback(
    (name: string) => {
      const newDocKey = `${createDocumentKey()}`;
      const fileLink = `/${newDocKey}`;
      const mimeType = MimeType.MARKDOWN;

      dispatch(newLink({ parentId, name, fileLink, mimeType, color: createRandomColor(), emoji: '📅' }));
      setTimeout(() => navigate(fileLink), 100);
      handleMenuClose();
    },
    [dispatch, parentId, navigate, handleMenuClose],
  );

  const buttonTag =
    variant === 'contained' || variant === 'outlined' ? (
      <Button variant={variant} onClick={handleMenuOpen}>
        {icon} <Typography>{title || 'Page'}</Typography>
      </Button>
    ) : (
      <Typography
        onClick={handleMenuOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 4,
        }}
      >
        {icon} {title || 'Page'}
      </Typography>
    );

  return (
    <div>
      {title ? (
        buttonTag
      ) : (
        <Tooltip title="Add pages">
          <IconButton size="small" onClick={handleMenuOpen}>
            {icon}
          </IconButton>
        </Tooltip>
      )}

      {open ? (
        <Menu
          id="basic-menu"
          elevation={2}
          anchorEl={anchorEl}
          className={classes.menu}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          transformOrigin={transformOrigin}
          anchorOrigin={anchorOrigin}
        >
          <MenuItem onClick={() => handleCreateLink('Untitled note')}>
            <ListItemIcon>
              <EventNote fontSize="small" />
            </ListItemIcon>
            <ListItemText>Note</ListItemText>
            <Typography variant="body2" color="text.secondary">
              1
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleCreateWhiteboard('Untitled artboard')}>
            <ListItemIcon>
              <Gesture fontSize="small" />
            </ListItemIcon>
            <ListItemText>Whiteboard</ListItemText>
            <Typography variant="body2" color="text.secondary">
              2
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleCreateMilkdown('Untitled milkdown')}>
            <ListItemIcon>
              <EventNote fontSize="small" />
            </ListItemIcon>
            <ListItemText>Milkdown</ListItemText>
            <Typography variant="body2" color="text.secondary">
              3
            </Typography>
          </MenuItem>
        </Menu>
      ) : undefined}
    </div>
  );
}
