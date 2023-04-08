import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import {
  LinkItemType,
  moveLink,
  newLinkByCurrentPage,
  removeLink,
  setLinkFileLink,
  setLinkName,
  toggleFavorite,
  toggleLinkOpen,
} from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import BorderAll from '@mui/icons-material/BorderAll';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import EventNote from '@mui/icons-material/EventNote';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FileCopy from '@mui/icons-material/FileCopy';
import Gesture from '@mui/icons-material/Gesture';
import SubdirectoryArrowLeft from '@mui/icons-material/SubdirectoryArrowLeft';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Star from '@mui/icons-material/Star';
import OpenInBrowser from '@mui/icons-material/OpenInBrowser';
import Update from '@mui/icons-material/Update';

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
  IconButton,
  Input,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { PageButton } from 'components/NavBar/PageButton';
import Description from '@mui/icons-material/Description';
import { addRecentPage } from 'features/currentSlices';
import { Theme } from 'features/settingSlices';
import { SideBarItemList } from './SidebarItemList';

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

const useStyles = makeStyles()((theme) => ({
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
  sidebarItem: {
    [`&:hover .sidebar-item-more`]: {
      visibility: 'visible !important' as any,
    },
    [`&:hover`]: {
      backgroundColor: theme.palette.mode === Theme.Dark ? theme.palette.primary.dark : theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },
  sidebarItemSelected: {
    backgroundColor: theme.palette.mode === Theme.Dark ? theme.palette.primary.dark : theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  level0: {
    paddingLeft: theme.spacing(0),
  },
  level1: {
    paddingLeft: theme.spacing(3),
  },
  level2: {
    paddingLeft: theme.spacing(6),
  },
  level3: {
    paddingLeft: theme.spacing(9),
  },
  level4: {
    paddingLeft: theme.spacing(12),
  },
  level5: {
    paddingLeft: theme.spacing(15),
  },
  level6: {
    paddingLeft: theme.spacing(18),
  },
  level7: {
    paddingLeft: theme.spacing(21),
  },
  level8: {
    paddingLeft: theme.spacing(24),
  },
  level9: {
    paddingLeft: theme.spacing(27),
  },
  level10: {
    paddingLeft: theme.spacing(30),
  },
  moreMenu: {},
  tooltip: {
    '& .MuiTooltip-tooltip': {
      fontSize: '1.5rem',
    },
  },
  dropTargetTop: {},
  dropTargetBottom: {},
  dropTargetCenter: {},
  dropElement: {
    position: 'absolute',
    width: '100%',
  },
  dropElementTop: {
    top: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 255, 0.8)',
    [`&:before`]: {
      content: '""',
      position: 'absolute',
      width: 10,
      height: 10,
      backgroundColor: 'rgba(0, 255, 0, 1)',
      borderRadius: '50%',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },
  dropElementBottom: {
    bottom: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 255, 0.8)',

    [`&:before`]: {
      content: '""',
      position: 'absolute',
      width: 10,
      height: 10,
      backgroundColor: 'rgba(0, 0, 255, 1)',
      borderRadius: '50%',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },
  dropElementCenter: {
    top: 0,
    height: '100%',
    border: '1px solid rgba(0, 0, 255, 0.8)',
  },
}));

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
  'New subpage',
  'Add current note',
  'Rename',
  'Delete',
  'Update link',
  '-',
  'Open in Browser',
  'Copy',
];

interface MoreMenuProps {
  item: LinkItemType;
  startRename: () => void;
}
function MoreMenu({ item, startRename }: MoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const { classes } = useStyles();
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
    } else if (command === 'New subpage') {
      return;
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
      {open ? (
        <Menu
          id="long-menu"
          className={classes.moreMenu}
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
                  {option === 'New subpage' ? <Description /> : undefined}
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
                <ListItemText>
                  {option === 'New subpage' ? (
                    <PageButton
                      icon={null}
                      insertTarget={item}
                      title="New subpage"
                      onClose={() => handleClose('')}
                      transformOrigin={{ horizontal: 'left', vertical: 'center' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    />
                  ) : (
                    option
                  )}
                </ListItemText>
              </MenuItem>
            ),
          )}
        </Menu>
      ) : undefined}

      {dialogOpen ? (
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
      ) : undefined}

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

export function SidebarItem({ item, level, loopType }: SidebarItemProps) {
  const dispatch = useDispatch();
  const opens = useSelector((state: AppState) => state.linkState.opens);
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const navigate = useNavigate();
  const textRef = useRef<string>(item.name);
  const [isRename, setIsRename] = useState(false);
  const { docKey } = useParams<{ docKey: string }>();
  const { classes } = useStyles();
  const [dropTarget, setDropTarget] = useState<'' | 'top' | 'bottom' | 'center'>('');

  const setOpenCallback = useCallback(() => {
    dispatch(toggleLinkOpen(item.id));
  }, [item.id, dispatch]);

  const handleRename = useCallback(
    (name: string) => {
      dispatch(setLinkName({ id: item.id, name }));
    },
    [item.id, dispatch],
  );

  const handleAddRecentPage = useCallback(() => {
    dispatch(
      addRecentPage({
        page: {
          name: item.name,
          fileLink: `${item.fileLink}`,
        },
      }),
    );
  }, [item, dispatch]);

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
      className={[
        className,
        classes.sidebarItem,
        item.fileLink?.startsWith(`/${docKey}`) ? classes.sidebarItemSelected : undefined,
        dropTarget === 'top' ? classes.dropTargetTop : undefined,
        dropTarget === 'bottom' ? classes.dropTargetBottom : undefined,
        dropTarget === 'center' ? classes.dropTargetCenter : undefined,
      ].join(' ')}
      button
      draggable
      onDragStart={(e) => {
        setDropTarget('');
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setDragImage(e.currentTarget, -10, 10);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();

        if (e.clientY - rect.top < 10) {
          setDropTarget('top');
        } else if (rect.bottom - e.clientY < 10) {
          setDropTarget('bottom');
        } else {
          setDropTarget('center');
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDropTarget('');
      }}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (id === item.id) {
          return;
        }

        if (dropTarget === 'top') {
          dispatch(moveLink({ id, targetId: item.id, updateAction: 'before' }));
        } else if (dropTarget === 'bottom') {
          dispatch(moveLink({ id, targetId: item.id, updateAction: 'after' }));
        } else if (dropTarget === 'center') {
          dispatch(moveLink({ id, targetId: item.id, updateAction: 'child' }));
        }

        setDropTarget('');
      }}
      disableRipple
      style={{
        display: isView ? 'flex' : 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {item.links?.length ? (
        <MoreIcon open={opens[item.id]} onClick={setOpenCallback} />
      ) : (
        <div
          style={{
            width: 20,
          }}
        />
      )}
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
            handleAddRecentPage();
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
                  navigate(item.fileLink, { replace: false });
                  break;
                case 'heading':
                  navigate(item.fileLink);
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
      {dropTarget === 'top' || dropTarget === 'bottom' || dropTarget === 'center' ? (
        <div
          className={[
            classes.dropElement,
            dropTarget === 'top' ? classes.dropElementTop : undefined,
            dropTarget === 'bottom' ? classes.dropElementBottom : undefined,
            dropTarget === 'center' ? classes.dropElementCenter : undefined,
          ].join(' ')}
        />
      ) : undefined}
    </ListItem>
  );
}

interface SidebarItemViewProps {
  item: LinkItemType;
  loopType: LoopType;
}

export function SidebarItemView({ item, loopType }: SidebarItemViewProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <Box>
      <SidebarItem item={item} level={0} loopType={loopType} />
      <Collapse in={opens[item.id]} timeout="auto" unmountOnExit>
        <SideBarItemList links={[...(item.links || [])]} level={1} loopType={loopType} />
      </Collapse>
    </Box>
  );
}
