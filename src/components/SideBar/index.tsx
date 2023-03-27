import React, { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import {
  copyMarkdownTextForGroup,
  favoriteSelector,
  GroupType,
  ItemType,
  LinkItemType,
  newChildGroupAt,
  newGroup,
  newGroupAt,
  newLink,
  newLinkByCurrentPage,
  removeGroup,
  removeLink,
  setLinkFileLink,
  setLinkName,
  setLinkOpens,
  toggleFavorite,
  toggleLinkOpen,
} from 'features/linkSlices';
import { Theme } from 'features/settingSlices';
import { showMessage } from 'features/messageSlices';
import { NavTabType, toggleLinkTab } from 'features/navSlices';
import { createDoc } from 'features/docSlices';
import { makeStyles } from 'styles/common';
import {
  AccountTree,
  Add,
  BorderAll,
  ChevronRight,
  CreateNewFolder,
  Delete,
  Edit,
  EventNote,
  ExpandMore,
  FileCopy,
  FolderOpen,
  Gesture,
  GitHub,
  InsertDriveFile,
  ListAlt,
  MoreHoriz,
  OpenInBrowser,
  Star,
  SubdirectoryArrowLeft,
  Update,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Snackbar,
  Tab,
  Tooltip,
  Typography,
} from '@mui/material';

import { TabContext, TabList, TabPanel } from '@mui/lab';

interface SideBarProps {
  open: boolean;
}

const SIDEBAR_WIDTH = 300;

function traverse(parent: any, data: any[], callback: (item: any, parent: any) => void) {
  data.forEach((item) => {
    callback(item, parent);
    traverse(item, item.links || [], callback);
  });
}

function findOne(data: any[], callback: (item: any) => boolean) {
  let result: any = null;
  traverse(null, data, (item) => {
    if (callback(item)) {
      result = item;
    }
  });
  return result;
}

function getTitle() {
  let { title } = document;

  const cm = document.querySelector('.CodeMirror');

  if (cm) {
    const { CodeMirror } = cm as any;
    const doc = CodeMirror.getDoc();
    const count = doc.lineCount();
    const headings = [];

    for (let i = 0; i < count; i += 1) {
      const line = doc.getLine(i).trim();
      const match = line.match(/^(#+)\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        headings.push({ level, text, originalText: line });
        break;
      }
    }

    if (headings.length > 0) {
      const { text } = headings[0];
      if (text) {
        title = text;
      }
    }
  }

  return title;
}

const useStyles = makeStyles<SideBarProps>()((theme, props) => ({
  title: {
    flexGrow: 1,
    padding: '15px 16px',
    backgroundColor: '#f5f5f5',
  },
  tabListDark: {
    backgroundColor: '#33333',
  },
  tabListLight: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #e8e8e8',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexShrink: 0,
    transform: `translateX(${props.open ? 0 : -SIDEBAR_WIDTH}px) translateZ(0)`,
    [`& .MuiDrawer-paper`]: {
      width: SIDEBAR_WIDTH,
      boxSizing: 'border-box',
      position: 'absolute',
      transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    },

    [`& .MuiListItem-root`]: {
      paddingTop: 2,
      paddingBottom: 2,
    },

    [`& .MuiTabPanel-root`]: {
      padding: 0,
    },

    [`& .MuiTab-root`]: {
      minWidth: 0,
      padding: '0 16px',
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  listItemText: {
    [`& .MuiTypography-root`]: {
      fontSize: '0.875rem',
      paddingLeft: 8,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  listSubHeader: {
    lineHeight: 1.5,
    [`&:hover .group-item-button`]: {
      visibility: 'visible !important' as any,
    },
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  sidebarItem: {
    [`&:hover .sidebar-item-more`]: {
      visibility: 'visible !important' as any,
    },
  },
  level0: {
    paddingLeft: theme.spacing(1),
  },
  level1: {
    paddingLeft: theme.spacing(3),
  },
  level2: {
    paddingLeft: theme.spacing(5),
  },
  level3: {
    paddingLeft: theme.spacing(7),
  },
  level4: {
    paddingLeft: theme.spacing(9),
  },
  level5: {
    paddingLeft: theme.spacing(10),
  },
  level6: {
    paddingLeft: theme.spacing(12),
  },
  level7: {
    paddingLeft: theme.spacing(14),
  },
  level8: {
    paddingLeft: theme.spacing(16),
  },
  level9: {
    paddingLeft: theme.spacing(18),
  },
  level10: {
    paddingLeft: theme.spacing(20),
  },
  moreMenu: {},
  tooltip: {
    '& .MuiTooltip-tooltip': {
      fontSize: '1.5rem',
    },
  },
}));

interface OpenState {
  [key: string]: boolean;
}

function MoreIcon({ open, onClick }: { open: boolean; onClick: () => void }) {
  return open ? (
    <ExpandMore
      fontSize="small"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  ) : (
    <ChevronRight
      fontSize="small"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  );
}

const options = [
  'Favorite',
  '-',
  'Add Note',
  'Add Whiteboard',
  'Add cell',
  'Add current note',
  'Rename',
  'Delete',
  'Update link',
  '-',
  'Open in Browser',
  'Copy',
];
const headingOptions = ['Favorite', '-', 'Open in Browser', 'Copy'];
const groupOptions = [
  'Favorite',
  '-',
  'Add Note',
  'Add Whiteboard',
  'Add current note',
  'Add child group',
  'Add next group',
  'Rename',
  '-',
  'Delete',
  '-',
  'Copy',
];

interface MoreMenuProps {
  item: LinkItemType;
  startRename: () => void;
}
function MoreMenu({ item, startRename }: MoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const client = useSelector((state: AppState) => state.docState.client);
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const { classes } = useStyles({ open: true });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { docKey } = useParams<{ docKey: string }>();
  const open = Boolean(anchorEl);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClickOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteLink = useCallback(() => {
    dispatch(removeLink({ id: item.id }));
  }, [dispatch, item.id]);

  const handleCreateLink = useCallback(
    (name: string) => {
      dispatch(newLink({ parentId: item.id, name }));
    },
    [item.id, dispatch],
  );

  const handleCreateWhiteboard = useCallback(
    async (name: string) => {
      const newDocKey = `${Math.random().toString(36).substring(7)}`;
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
          }),
        );

        dispatch(newLink({ parentId: item.id, name, mimeType, fileLink }));
      }
    },
    [item.id, dispatch, client],
  );

  const handleCreateCell = useCallback(
    async (name: string) => {
      const newDocKey = `${Math.random().toString(36).substring(7)}`;
      const fileLink = `/${newDocKey}`;
      const mimeType = 'application/cell';

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

              if (!newRoot.cell) {
                newRoot.cell = {
                  pages: [],
                };
              }
            },
          }),
        );

        dispatch(newLink({ parentId: item.id, name, mimeType, fileLink }));
      }
    },
    [item.id, dispatch, client],
  );

  const handleUpdateLink = useCallback(() => {
    dispatch(setLinkFileLink({ id: item.id, name: getTitle(), fileLink: `/${docKey}` }));
  }, [item.id, dispatch, docKey]);

  const handleCreateCurrentPage = useCallback(() => {
    dispatch(newLinkByCurrentPage({ parentId: item.id, name: getTitle(), fileLink: `/${docKey}` }));
  }, [item.id, docKey, dispatch]);

  const handleClose = (command: string) => {
    if (command === 'Favorite') {
      dispatch(toggleFavorite(item.id));
    } else if (command === 'Open in Browser') {
      if (item.fileLink) {
        switch (item.linkType) {
          case 'pairy':
            window.open(item.fileLink, item.fileLink);
            break;
          default:
            window.open(item.fileLink, '_blank');
        }
      }
    } else if (command === 'Rename') {
      startRename();
    } else if (command === 'Copy') {
      let link = item.fileLink || '';
      if (item.linkType === 'pairy') {
        link = `${window.location.origin}${item.fileLink}`;
      }

      window.navigator.clipboard.writeText(link).then(() => {
        handleClickOpenSnackbar();
      });
    } else if (command === 'Delete') {
      handleClickDialogOpen();
    } else if (command === 'Add Note') {
      handleCreateLink('Untitled name');
    } else if (command === 'Add Whiteboard') {
      handleCreateWhiteboard('Untitled whiteboard');
    } else if (command === 'Add cell') {
      handleCreateCell('Untitled Cell');
    } else if (command === 'Add current note') {
      handleCreateCurrentPage();
    } else if (command === 'Update link') {
      handleUpdateLink();
    }

    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="small">
        <MoreHoriz />
      </IconButton>
      <Menu
        id="long-menu"
        className={classes.moreMenu}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            // maxHeight: ITEM_HEIGHT * 4.5,
            // width: 200,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {options.map((option) =>
          option === '-' ? (
            <Divider key={`${option}-${Date.now()}-${Math.random()}`} />
          ) : (
            <MenuItem
              key={option}
              onClick={() => handleClose(option)}
              style={{
                color: option === 'Delete' ? 'red' : undefined,
              }}
            >
              <ListItemIcon
                style={{
                  minWidth: 30,
                }}
              >
                {option === 'Delete' ? (
                  <Delete
                    style={{
                      color: 'red',
                    }}
                  />
                ) : undefined}
                {option === 'Add Note' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Add Whiteboard' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Add cell' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Add current note' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Rename' ? <Edit /> : undefined}
                {option === 'Open in Browser' ? <OpenInBrowser /> : undefined}
                {option === 'Copy' ? <FileCopy /> : undefined}
                {option === 'Update link' ? <Update /> : undefined}
                {option === 'Favorite' ? (
                  <Star
                    style={{
                      color: favorite.includes(item.id) ? 'blue' : undefined,
                    }}
                  />
                ) : undefined}
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ),
        )}
      </Menu>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you delete the link, it cannot be recovered.Are you sure you want to delete it anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteLink} autoFocus variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={handleCloseSnackbar}
        message="Copy"
      />
    </div>
  );
}

interface HeadingMoreMenuProps {
  item: LinkItemType;
}

function HeadingMoreMenu({ item }: HeadingMoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const { classes } = useStyles({ open: true });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClickOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (command: string) => {
    if (command === 'Favorite') {
      dispatch(toggleFavorite(item));
    } else if (command === 'Open in Browser') {
      if (item.fileLink) {
        window.open(item.fileLink, '_blank');
      }
    } else if (command === 'Copy') {
      const link = `${window.location.origin}${item.fileLink}`;

      window.navigator.clipboard.writeText(link).then(() => {
        handleClickOpenSnackbar();
      });
    }

    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="small">
        <MoreHoriz />
      </IconButton>
      <Menu
        id="long-menu"
        className={classes.moreMenu}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            // maxHeight: ITEM_HEIGHT * 4.5,
            // width: 200,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {headingOptions.map((option) =>
          option === '-' ? (
            <Divider key={`${option}-${Date.now()}-${Math.random()}`} />
          ) : (
            <MenuItem key={option} onClick={() => handleClose(option)}>
              <ListItemIcon
                style={{
                  minWidth: 30,
                }}
              >
                {option === 'Open in Browser' ? <OpenInBrowser /> : undefined}
                {option === 'Copy' ? <FileCopy /> : undefined}
                {option === 'Favorite' ? (
                  <Star
                    style={{
                      color: favorite.includes(item.id) ? 'blue' : undefined,
                    }}
                  />
                ) : undefined}
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ),
        )}
      </Menu>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={handleCloseSnackbar}
        message="Copy"
      />
    </div>
  );
}

interface GroupMoreMenuProps {
  group: GroupType;
  startRename: () => void;
}

function GroupMoreMenu({ group, startRename }: GroupMoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const client = useSelector((state: AppState) => state.docState.client);
  const groups = useSelector((state: AppState) => state.linkState.groups);
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { docKey } = useParams<{ docKey: string }>();
  const open = Boolean(anchorEl);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateCurrentPage = useCallback(() => {
    dispatch(newLinkByCurrentPage({ parentId: group.id, name: getTitle(), fileLink: `/${docKey}` }));
  }, [group.id, docKey, dispatch]);

  const handleCreateLink = useCallback(
    (name: string) => {
      dispatch(newLink({ parentId: group.id, name }));
    },
    [group.id, dispatch],
  );

  const handleCreateWhiteboard = useCallback(
    async (name: string) => {
      const newDocKey = `${Math.random().toString(36).substring(7)}`;
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
          }),
        );

        dispatch(newLink({ parentId: group.id, name, mimeType, fileLink }));
      }
    },
    [group.id, dispatch, client],
  );

  const handleClose = (command: string) => {
    if (command === 'Rename') {
      startRename();
    } else if (command === 'Delete') {
      if (groups.length === 1) {
        dispatch(
          showMessage({
            type: 'warning',
            message: 'You can not delete the last group',
          }),
        );
        return;
      }

      handleClickDialogOpen();
    } else if (command === 'Add Note') {
      handleCreateLink('Untitled name');
    } else if (command === 'Add Whiteboard') {
      handleCreateWhiteboard('Untitled whiteboard');
    } else if (command === 'Add current note') {
      handleCreateCurrentPage();
    } else if (command === 'Add next group') {
      dispatch(newGroupAt({ id: group.id, name: 'New Group' }));
    } else if (command === 'Add child group') {
      dispatch(newChildGroupAt({ parentId: group.id, name: 'New Group' }));
    } else if (command === 'Favorite') {
      dispatch(toggleFavorite(group.id));
    } else if (command === 'Copy') {
      dispatch(copyMarkdownTextForGroup(group.id));
    }

    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size="small" disableRipple>
        <MoreHoriz />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {groupOptions.map((option) =>
          option === '-' ? (
            <Divider key={`${option}-${Date.now()}-${Math.random()}`} />
          ) : (
            <MenuItem
              key={option}
              onClick={() => handleClose(option)}
              disableRipple
              style={{
                color: option === 'Delete' ? 'red' : undefined,
              }}
            >
              <ListItemIcon>
                {option === 'Delete' ? (
                  <Delete
                    style={{
                      color: 'red',
                    }}
                  />
                ) : undefined}
                {option === 'Rename' ? <InsertDriveFile /> : undefined}
                {option === 'Add current note' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Add Note' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Add Whiteboard' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Add next group' ? <CreateNewFolder /> : undefined}
                {option === 'Add child group' ? <SubdirectoryArrowLeft /> : undefined}
                {option === 'Favorite' ? (
                  <Star
                    style={{
                      color: favorite.includes(group.id) ? 'blue' : undefined,
                    }}
                  />
                ) : undefined}
                {option === 'Copy' ? <FileCopy /> : undefined}
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ),
        )}
      </Menu>
      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Are you sure to delete this group?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button
              onClick={() => {
                if (groups.length < 2) {
                  dispatch(
                    showMessage({
                      type: 'warning',
                      message: 'You can not delete the last group',
                    }),
                  );
                  return;
                }

                dispatch(removeGroup({ id: group.id }));
                handleDialogClose();
              }}
              autoFocus
              variant="contained"
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

interface GroupItemProps {
  group: GroupType;
  level: number;
  loopType: LoopType;
}

function GroupItem({ group, level, loopType }: GroupItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const opens = useSelector((state: AppState) => state.linkState.opens);
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const { classes } = useStyles({
    open: true,
  });
  const [isRename, setIsRename] = useState(false);
  const textRef = useRef<string>(group.name);

  const className = useMemo(() => {
    switch (level) {
      case 0:
        return classes.level0;
      case 1:
        return classes.level1;
      case 2:
        return classes.level2;
      case 3:
        return classes.level3;
      case 4:
        return classes.level4;
      case 5:
        return classes.level5;
      case 6:
        return classes.level6;
      case 7:
        return classes.level7;
      case 8:
        return classes.level8;
      case 9:
        return classes.level9;
      case 10:
        return classes.level10;
      default:
        return classes.level0;
    }
  }, [level, classes]);

  const isView = useMemo(() => {
    if (loopType !== 'favorite' && favorite.includes(group.id)) {
      return false;
    }

    return true;
  }, [loopType, favorite, group.id]);

  return (
    <ListSubheader
      className={[className, classes.listSubHeader].join(' ')}
      style={{
        display: isView ? 'flex' : 'none',
        // justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsRename(true);
      }}
    >
      <IconButton
        size="small"
        onClick={() => dispatch(toggleLinkOpen(group.id))}
        style={{ flex: 'none' }}
        disableRipple
      >
        {opens[group.id] ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
      </IconButton>

      {isRename ? (
        <Input
          autoFocus
          defaultValue={textRef.current}
          onBlur={() => {
            setIsRename(false);
            dispatch(setLinkName({ id: group.id, name: textRef.current }));
          }}
          onChange={(e) => {
            textRef.current = e.target.value;
          }}
          onKeyUp={(e) => {
            if (e.key === 'Escape') {
              setIsRename(false);
            } else if (e.key === 'Enter') {
              setIsRename(false);
              dispatch(setLinkName({ id: group.id, name: textRef.current }));
            }
          }}
        />
      ) : (
        <div
          style={{
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
          }}
          title={group.name}
        >
          <FolderOpen
            style={{
              marginRight: 8,
            }}
          />
          {group.name}
        </div>
      )}
      <div
        className="group-item-button"
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          visibility: 'hidden',
        }}
      >
        <Tooltip title="Add new Link">
          <IconButton
            disableRipple
            size="small"
            style={{
              flex: 'none',
            }}
            onClick={() => {
              dispatch(newLink({ parentId: group.id, name: 'New Link' }));
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
        {isRename ? undefined : (
          <GroupMoreMenu
            group={group}
            startRename={() => {
              setIsRename(true);
            }}
          />
        )}
      </div>
    </ListSubheader>
  );
}

type LoopType = 'links' | 'favorite';

interface SidebarItemProps {
  item: LinkItemType;
  level: number;
  loopType: LoopType;
}

function MimeTypeIcon({ mimeType }: { mimeType: string | undefined }) {
  const icon = useMemo(() => {
    switch (mimeType) {
      case 'application/cell':
        return <BorderAll fontSize="small" />;
      case 'application/vnd.pairy.whiteboard':
        return <Gesture fontSize="small" />;
      default:
        return undefined;
    }

    return undefined;
  }, [mimeType]);

  return icon || <EventNote fontSize="small" />;
}

function SidebarItem({ item, level, loopType }: SidebarItemProps) {
  const dispatch = useDispatch();
  const opens = useSelector((state: AppState) => state.linkState.opens);
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const navigate = useNavigate();
  const textRef = useRef<string>(item.name);
  const [isRename, setIsRename] = useState(false);
  const { docKey } = useParams<{ docKey: string }>();
  const { classes } = useStyles({ open: opens[item.id] });

  const setOpenCallback = useCallback(() => {
    dispatch(toggleLinkOpen(item.id));
  }, [item.id, dispatch]);

  const handleRename = useCallback(
    (name: string) => {
      dispatch(setLinkName({ id: item.id, name }));
    },
    [item.id, dispatch],
  );

  const isView = useMemo(() => {
    if (loopType !== 'favorite' && favorite.includes(item.id)) {
      return false;
    }

    return true;
  }, [loopType, favorite, item.id]);

  const className = useMemo(() => {
    switch (level) {
      case 0:
        return classes.level0;
      case 1:
        return classes.level1;
      case 2:
        return classes.level2;
      case 3:
        return classes.level3;
      case 4:
        return classes.level4;
      case 5:
        return classes.level5;
      case 6:
        return classes.level6;
      case 7:
        return classes.level7;
      case 8:
        return classes.level8;
      case 9:
        return classes.level9;
      case 10:
        return classes.level10;
      default:
        return classes.level0;
    }
  }, [level, classes]);

  return (
    <ListItem
      className={[className, classes.sidebarItem].join(' ')}
      button
      selected={`/${docKey}` === item.fileLink}
      disableRipple
      style={{
        display: isView ? 'flex' : 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {item.links?.length && <MoreIcon open={opens[item.id]} onClick={setOpenCallback} />}
      <MimeTypeIcon mimeType={item.mimeType} />
      {isRename ? (
        <Input
          autoFocus
          defaultValue={textRef.current}
          onBlur={() => {
            setIsRename(false);
            handleRename(textRef.current);
          }}
          onChange={(e) => {
            textRef.current = e.target.value;
          }}
          onKeyUp={(e) => {
            if (e.key === 'Escape') {
              setIsRename(false);
            } else if (e.key === 'Enter') {
              setIsRename(false);
              handleRename(textRef.current);
            }
          }}
        />
      ) : (
        <ListItemText
          primary={item.name}
          className={classes.listItemText}
          title={item.name}
          onClick={(e) => {
            // open link to new tab if meta key is pressed
            if (e.metaKey) {
              switch (item.linkType) {
                case 'pairy':
                  window.open(item.fileLink, item.fileLink);
                  break;
                default:
                  window.open(item.fileLink, '_blank');
              }
              return;
            }

            if (item.fileLink) {
              switch (item.linkType) {
                case 'pairy':
                  navigate(item.fileLink);
                  break;
                case 'heading':
                  window.location.href = item.fileLink;
                  break;
                default:
                  window.open(item.fileLink, '_blank');
              }
            }
          }}
        />
      )}
      <div
        className="sidebar-item-more"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          visibility: 'hidden',
        }}
      >
        {isRename || item.linkType === 'heading' ? undefined : (
          <MoreMenu
            item={item}
            startRename={() => {
              setIsRename(true);
            }}
          />
        )}
      </div>
    </ListItem>
  );
}

interface HeadingIconProps {
  item: LinkItemType;
}

function HeadingIcon({ item }: HeadingIconProps) {
  return (
    <span
      style={{
        color: '#999',
        fontWeight: 'bold',
        textShadow: '1px 1px 0px #222',
      }}
    >
      H{(item.level || 0) + 1}
    </span>
  );
}

function HeadingItem({ item, level, loopType }: SidebarItemProps) {
  const { classes } = useStyles({ open: true });
  const favorite = useSelector((state: AppState) => state.linkState.favorite);

  const className = useMemo(() => {
    switch (level) {
      case 0:
        return classes.level0;
      case 1:
        return classes.level1;
      case 2:
        return classes.level2;
      case 3:
        return classes.level3;
      case 4:
        return classes.level4;
      case 5:
        return classes.level5;
      case 6:
        return classes.level6;
      case 7:
        return classes.level7;
      case 8:
        return classes.level8;
      case 9:
        return classes.level9;
      case 10:
        return classes.level10;
      default:
        return classes.level0;
    }
  }, [level, classes]);

  const isView = useMemo(() => {
    if (loopType !== 'favorite' && favorite.some((it) => (it as LinkItemType).fileLink === item.fileLink)) {
      return false;
    }

    return true;
  }, [loopType, favorite, item.fileLink]);

  return (
    <ListItem
      className={[className, classes.sidebarItem].join(' ')}
      button
      selected={`${window.location.pathname}${window.location.hash}` === item.fileLink}
      disableRipple
      style={{
        display: isView ? 'flex' : 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <HeadingIcon item={item} />

      <ListItemText
        primary={item.name}
        className={classes.listItemText}
        title={item.name}
        onClick={(e) => {
          // open link to new tab if meta key is pressed
          if (e.metaKey) {
            window.open(item.fileLink, '_blank');
            return;
          }

          if (item.fileLink) {
            // window.history.pushState({}, '', item.fileLink);
            window.location.href = item.fileLink;
          }
        }}
      />
      <div
        className="sidebar-item-more"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          visibility: 'hidden',
        }}
      >
        <HeadingMoreMenu item={item} />
      </div>
    </ListItem>
  );
}

interface SideBarItemListProps {
  links: ItemType[];
  level: number;
  loopType: LoopType;
}

function SideBarItemList({ links, level, loopType }: SideBarItemListProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <List style={{ padding: 0 }}>
      {[...links].map((it) => {
        return (
          <Fragment key={it.id}>
            {it.type === 'group' ? (
              <GroupItem key={it.id} group={it} level={level} loopType={loopType} />
            ) : (
              <SidebarItem key={it.id} item={it} level={level} loopType={loopType} />
            )}

            {it.links && (
              <Collapse in={opens[it.id]} timeout="auto" unmountOnExit>
                <SideBarItemList links={[...it.links]} level={level + 1} loopType={loopType} />
              </Collapse>
            )}
          </Fragment>
        );
      })}
    </List>
  );
}

interface GroupViewProps {
  group: GroupType;
  loopType: LoopType;
}

function GroupView({ group, loopType }: GroupViewProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <Box>
      <GroupItem group={group} level={0} loopType={loopType} />
      <Collapse in={opens[group.id]} timeout="auto" unmountOnExit>
        <SideBarItemList links={[...group.links]} level={1} loopType={loopType} />
      </Collapse>
    </Box>
  );
}

interface TabLabelProps {
  children: ReactNode;
}
function TabLabel({ children }: TabLabelProps) {
  return <span style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>{children}</span>;
}

type TabPanelHeaderProps = {
  children: ReactNode;
  tools?: ReactNode;
};

function TabPanelHeader({ children, tools = '' }: TabPanelHeaderProps) {
  return (
    <ListSubheader>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h6"
          style={{ fontWeight: 400, fontSize: 14, height: 40, display: 'flex', alignItems: 'center' }}
        >
          {children}
        </Typography>
        {tools}
      </Box>
    </ListSubheader>
  );
}

TabPanelHeader.defaultProps = {
  tools: '',
};

export function SideBar() {
  const dispatch = useDispatch();
  const linkState = useSelector((state: AppState) => state.linkState);
  const navState = useSelector((state: AppState) => state.navState);
  const headings = useSelector((state: AppState) => state.docState.headings);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const favorites = useSelector(favoriteSelector);
  const open = navState.openTab;
  const linkRef = useRef<boolean>(false);
  const { classes } = useStyles({ open });
  const { docKey } = useParams<{ docKey: string }>();

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: NavTabType) => {
    dispatch(toggleLinkTab(newValue));
  };

  const showTreeNode = useCallback(
    (id: string) => {
      const parentList: string[] = [];
      let currentDepth = -1;

      function searchPath(data: unknown[], depth = 0, callback: (item: any) => boolean): boolean {
        let found = false;
        for (let i = 0; i < data.length; i += 1) {
          parentList[depth] = (data[i] as any).id;
          if (callback(data[i])) {
            currentDepth = depth;
            found = true;
            break;
          }
          if ((data[i] as any).links) {
            if (searchPath((data[i] as any).links, depth + 1, callback)) {
              found = true;
              break;
            }
          }
        }

        return found;
      }

      searchPath(linkState.groups, 0, (item) => {
        return item.id === id;
      });

      if (currentDepth > -1) {
        const newOpens: OpenState = {};

        parentList.forEach((it) => {
          newOpens[it] = true;
        });

        // update
        dispatch(setLinkOpens(newOpens));
      }
    },
    [linkState.groups, dispatch],
  );

  useEffect(() => {
    if (linkRef.current) return;

    if (docKey) {
      const findItem = findOne(linkState.groups, (item) => item.fileLink === `/${docKey}`);
      if (findItem) {
        showTreeNode(findItem.id);
        linkRef.current = true;
      }
    }
  }, [docKey, showTreeNode, linkState.groups]);

  return (
    <Drawer variant="permanent" className={classes.drawer} open={open}>
      <TabContext value={navState.openTabValue}>
        <Box>
          <TabList
            onChange={handleChange}
            className={menu.theme === Theme.Dark ? classes.tabListDark : classes.tabListLight}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <TabLabel>
                  <EventNote /> Notes
                </TabLabel>
              }
              value="notes"
            />
            <Tab
              label={
                <TabLabel>
                  <ListAlt /> H1
                </TabLabel>
              }
              value="toc"
            />
          </TabList>
        </Box>
        <TabPanel value="notes">
          <TabPanelHeader>
            <Star
              fontSize="small"
              style={{
                marginRight: 6,
              }}
            />{' '}
            Favorites
          </TabPanelHeader>
          {favorites.map((it) => {
            if (!it) {
              return null;
            }

            if (it.type === 'link' && it.linkType === 'heading') {
              return <HeadingItem key={it.id} item={it} level={0} loopType="favorite" />;
            }

            return it.type === 'group' ? (
              <GroupView key={it.id} group={it} loopType="favorite" />
            ) : (
              <SidebarItem key={it.id} item={it} level={0} loopType="favorite" />
            );
          })}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <TabPanelHeader
            tools={
              <Tooltip title="New group" className={classes.tooltip} placement="top">
                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch(newGroup('New Group'));
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            }
          >
            <AccountTree
              fontSize="small"
              style={{
                marginRight: 6,
              }}
            />
            Groups
          </TabPanelHeader>
          {linkState.groups.map((group) => {
            return <GroupView key={group.id} group={group} loopType="links" />;
          })}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Divider />
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0',
                gap: 8,
              }}
            >
              <Button
                aria-label="selector"
                href="https://github.com/yorkie-team/codepair"
                style={{
                  fontSize: 16,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="38"
                  viewBox="0 0 100 38"
                  fill="none"
                  role="img"
                >
                  <mask id="path-1-inside-1_4874_2783" fill="white">
                    <path d="M11.8574 11.4048L18.8525 21.4507C19.2947 22.086 20.1683 22.2423 20.8036 21.8001C20.9398 21.7052 21.0581 21.5869 21.153 21.4507L28.148 11.4048C29.0327 10.1343 28.7198 8.3872 27.4495 7.5027C26.9794 7.17549 26.4205 7 25.8477 7H14.1577C12.6095 7 11.3545 8.25503 11.3545 9.80322C11.3547 10.3758 11.5302 10.9347 11.8574 11.4048Z"></path>
                  </mask>
                  <path
                    d="M11.8574 11.4048L18.8525 21.4507C19.2947 22.086 20.1683 22.2423 20.8036 21.8001C20.9398 21.7052 21.0581 21.5869 21.153 21.4507L28.148 11.4048C29.0327 10.1343 28.7198 8.3872 27.4495 7.5027C26.9794 7.17549 26.4205 7 25.8477 7H14.1577C12.6095 7 11.3545 8.25503 11.3545 9.80322C11.3547 10.3758 11.5302 10.9347 11.8574 11.4048Z"
                    fill="#514C49"
                    stroke="#FEFDFB"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mask="url(#path-1-inside-1_4874_2783)"
                  ></path>
                  <path
                    d="M22.8637 29.5446C23.3612 29.8283 23.9338 29.9528 24.5042 29.9014L37.2991 28.7469C38.3271 28.6542 39.0851 27.7457 38.9924 26.7178C38.9876 26.6636 38.9803 26.6096 38.9706 26.556C38.5862 24.4114 37.8296 22.3507 36.7352 20.4668C35.6407 18.5829 34.2255 16.9048 32.5532 15.5085C31.761 14.8471 30.5825 14.953 29.9211 15.7455C29.8862 15.7872 29.8532 15.8305 29.8219 15.8752L22.4807 26.418C22.1535 26.888 21.978 27.4469 21.978 28.0198V27.9849C21.978 28.3055 22.0604 28.6208 22.2176 28.9002C22.3826 29.1751 22.6155 29.4029 22.8942 29.5617"
                    fill="#FDC433"
                  ></path>
                  <path
                    d="M17.8492 28.7605C17.6844 29.097 17.4222 29.376 17.0969 29.5616L17.1365 29.539C16.6391 29.8227 16.0665 29.9472 15.4961 29.8959L2.70114 28.7414C2.64694 28.7365 2.59295 28.7293 2.53935 28.7196C1.52348 28.5375 0.847507 27.5663 1.02965 26.5505C1.41407 24.4057 2.17064 22.3451 3.26489 20.4611C4.35914 18.577 5.77455 16.8993 7.44706 15.5028C7.48877 15.4679 7.53208 15.4349 7.57681 15.4037C8.42384 14.8139 9.58841 15.0225 10.1784 15.8695L17.5196 26.4124C17.8468 26.8825 18.0223 27.4414 18.0223 28.0142V27.9685C18.0223 28.343 17.9096 28.7091 17.6991 29.019"
                    fill="#FDC433"
                  ></path>
                  <path
                    d="M46 13.0243L50.3839 20.7431V24.9463H52.4806V20.7272L56.8645 13.0243H54.6726L51.7658 18.3231L51.4164 19.0237L51.0669 18.3231L48.192 13.0243H46Z"
                    fill="#332E2B"
                  ></path>
                  <path
                    d="M61.4832 15.7917C58.9259 15.7917 57.0358 17.6863 57.0358 20.4884C57.0358 23.2905 58.9259 25.1851 61.4832 25.1851C64.0087 25.1851 65.9307 23.2905 65.9307 20.4884C65.9307 17.6863 64.0087 15.7917 61.4832 15.7917ZM61.4832 23.4656C60.149 23.4656 59.0689 22.2556 59.0689 20.4884C59.0689 18.7212 60.149 17.5112 61.4832 17.5112C62.8175 17.5112 63.8976 18.7212 63.8976 20.4884C63.8976 22.2556 62.8175 23.4656 61.4832 23.4656Z"
                    fill="#332E2B"
                  ></path>
                  <path
                    d="M73.6325 15.8076C72.6 15.8076 71.5676 16.0783 70.821 16.7788V16.0305H68.7879V24.9463H70.821V21.2685C70.821 20.3929 70.8846 19.8356 70.964 19.5013C71.234 18.3391 72.2982 17.543 73.6325 17.6067V15.8076Z"
                    fill="#332E2B"
                  ></path>
                  <path
                    d="M82.1798 24.9463H84.6259L80.6232 20.2177L84.2288 16.0305H81.7827L78.6059 19.8516V13.0779H76.5728V24.9463H78.6059V20.6476L82.1798 24.9463Z"
                    fill="#332E2B"
                  ></path>
                  <path
                    d="M88.6995 16.0305H86.6664V24.9463H88.6995V16.0305ZM86.5711 15.0434H88.7948V12.8145H86.5711V15.0434Z"
                    fill="#332E2B"
                  ></path>
                  <path
                    d="M98.3957 21.8258C97.8875 22.781 96.9344 23.4656 95.8543 23.4656C94.6313 23.4656 93.7259 22.4626 93.5512 21.2526H100V20.2814C100 17.6704 98.2051 15.7917 95.7114 15.7917C93.3288 15.7917 91.4228 17.6863 91.4228 20.4884C91.4228 23.2905 93.2176 25.1851 95.8543 25.1851C97.5062 25.1851 98.9834 24.3095 99.8729 22.9562L98.3957 21.8258ZM93.5353 19.565C93.7894 18.2913 94.6313 17.5112 95.7114 17.5112C96.8709 17.5112 97.6651 18.3709 97.9033 19.565H93.5353Z"
                    fill="#332E2B"
                  ></path>
                </svg>
              </Button>
              <Button>
                <GitHub /> &nbsp;Github
              </Button>
            </Box>
            <Box height={20} />
          </div>
        </TabPanel>
        <TabPanel value="toc">
          {headings.map((it) => {
            return <HeadingItem key={it.id} item={it} level={it.level || 0} loopType="links" />;
          })}
        </TabPanel>
      </TabContext>
    </Drawer>
  );
}
