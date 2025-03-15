import React, { useCallback, useState } from 'react';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import Gesture from '@mui/icons-material/Gesture';
import { createDoc } from 'features/docSlices';
import { AppState } from 'app/rootReducer';
import { newLink } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import { MimeType } from 'constants/editor';
import { useNavigate } from 'react-router-dom';
import { createDocumentKey, createRandomColor } from 'utils/document';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import { Theme } from 'features/settingSlices';
import { ContentCopyOutlined } from '@mui/icons-material';
import { TemplateDialog } from 'components/commons/TemplateDialog';

const useStyles = makeStyles()((theme) => ({
  menu: {
    '& .MuiMenu-paper': {
      width: 200,
    },
  },
  button: {
    backgroundColor: theme.palette.mode === Theme.Dark ? '#494949 !important' : '#fff  !important',
    color: theme.palette.mode === Theme.Dark ? '#fff' : '#000',
    borderRadius: 30,
  },
  icon: {
    color: '#fff',
    backgroundColor: 'red',
    borderRadius: 30,
  },
}));

export function CreateButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector((state: AppState) => state.docState.client);
  const { classes } = useStyles();

  const parentId = '';

  const [templateOpen, setTemplateOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCloseTemplate = useCallback(() => {
    setTemplateOpen(false);
  }, []);

  const handleOpenTemplate = useCallback(() => {
    setTemplateOpen(true);
    handleMenuClose();
  }, [handleMenuClose]);

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
          dispatch(newLink({ parentId, name, mimeType, fileLink, color: createRandomColor().background, emoji: '🖌️' }));
          setTimeout(() => navigate(fileLink), 100);
          handleMenuClose();
        }, 1000);
      }
    },
    [dispatch, client, parentId, navigate, handleMenuClose],
  );

  // const handleCreateMilkdown = useCallback(
  //   async (name: string) => {
  //     const newDocKey = `${createDocumentKey()}`;
  //     const fileLink = `/${newDocKey}`;
  //     const mimeType = MimeType.MILKDOWN;

  //     if (client) {
  //       dispatch(
  //         createDoc({
  //           client,
  //           docKey: `codepairs-${newDocKey}`,
  //           init: (root: any) => {
  //             const newRoot = root;
  //             if (!newRoot.mimeType) {
  //               newRoot.mimeType = mimeType;
  //             }

  //             if (!newRoot.content) {
  //               newRoot.content = new yorkie.Text();
  //             }
  //           },
  //         }) as any,
  //       );

  //       setTimeout(() => {
  //         dispatch(newLink({ parentId, name, mimeType, fileLink, color: createRandomColor().background, emoji: '📅' }));
  //         setTimeout(() => navigate(fileLink), 100);
  //         handleMenuClose();
  //       }, 1000);
  //     }
  //   },
  //   [dispatch, client, parentId, navigate, handleMenuClose],
  // );

  const handleCreateLink = useCallback(
    (name: string) => {
      const newDocKey = `${createDocumentKey()}`;
      const fileLink = `/${newDocKey}`;
      const mimeType = MimeType.MARKDOWN;

      dispatch(newLink({ parentId, name, fileLink, mimeType, color: createRandomColor().background, emoji: '📅' }));
      setTimeout(() => navigate(fileLink), 100);
      handleMenuClose();
    },
    [dispatch, parentId, navigate, handleMenuClose],
  );

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        onClick={handleMenuOpen}
        className={classes.button}
        startIcon={<Add className={classes.icon} />}
      >
        Create
      </Button>
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
          style={{
            marginTop: 10,
          }}
        >
          <MenuItem onClick={() => handleCreateLink('Untitled note')}>
            <ListItemIcon>
              <DescriptionOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Note</ListItemText>
            <Typography variant="body2" color="text.secondary">
              1
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleCreateWhiteboard('Untitled whiteboard')}>
            <ListItemIcon>
              <Gesture fontSize="small" />
            </ListItemIcon>
            <ListItemText>Whiteboard</ListItemText>
            <Typography variant="body2" color="text.secondary">
              2
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleOpenTemplate()}>
            <ListItemIcon>
              <ContentCopyOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Template</ListItemText>
            <Typography variant="body2" color="text.secondary">
              3
            </Typography>
          </MenuItem>
        </Menu>
      ) : undefined}
      {templateOpen ? <TemplateDialog onClose={handleCloseTemplate} /> : undefined}
    </div>
  );
}
