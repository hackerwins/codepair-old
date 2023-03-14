import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  createStyles,
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
  makeStyles,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from '@material-ui/core';
import {
  ExpandMore,
  ChevronRight,
  MoreHoriz,
  Add,
  Delete,
  InsertDriveFile,
  CreateNewFolder,
  Message,
  Bookmark,
  Edit,
  OpenInBrowser,
  FileCopy,
  Update,
  AccountTree,
  ChevronLeft,
  Folder,
  FolderOpen,
} from '@material-ui/icons';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import {
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
  toggleLinkOpen,
  toggleLinkTab,
} from 'features/linkSlices';

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

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      flexGrow: 1,
      padding: '15px 16px',
      backgroundColor: '#f5f5f5',
    },
    drawer: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      flexShrink: 0,
      transform: (props: SideBarProps) => `translateX(${props.open ? 0 : -SIDEBAR_WIDTH}px) translateZ(0)`,
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
      'line-height': 1.5,
      [`&:hover .group-item-button`]: {
        visibility: 'visible !important',
      },
    },
    listItem: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    sidebarItem: {
      [`&:hover .sidebar-item-more`]: {
        visibility: 'visible !important',
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
  }),
);

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

const ITEM_HEIGHT = 48;

const options = [
  'Add link',
  'Add current page',
  'Rename',
  'Delete link',
  'Update link',
  '-',
  'Open link as new tab',
  'Copy link',
];
const groupOptions = ['Add child group', 'Add next group', 'Rename', '-', 'Delete'];

interface MoreMenuProps {
  startAddLink: () => void;
  startRename: () => void;
  startUpdateLink: () => void;
  startOpenLinkAsNewTab: () => void;
  startCopyLink: () => void;
  startDeleteLink: () => void;
  startAddCurrentPage: () => void;
}
function MoreMenu({
  startRename,
  startOpenLinkAsNewTab,
  startUpdateLink,
  startCopyLink,
  startDeleteLink,
  startAddLink,
  startAddCurrentPage,
}: MoreMenuProps) {
  const classes = useStyles({ open: true });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (command: string) => {
    if (command === 'Open link as new tab') {
      startOpenLinkAsNewTab();
    } else if (command === 'Rename') {
      startRename();
    } else if (command === 'Copy link') {
      startCopyLink();
    } else if (command === 'Delete link') {
      startDeleteLink();
    } else if (command === 'Add link') {
      startAddLink();
    } else if (command === 'Add current page') {
      startAddCurrentPage();
    } else if (command === 'Update link') {
      startUpdateLink();
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
            <Divider key={`${option}-${Date.now()}`} />
          ) : (
            <MenuItem
              key={option}
              onClick={() => handleClose(option)}
              style={{
                color: option === 'Delete link' ? 'red' : undefined,
              }}
            >
              <ListItemIcon
                style={{
                  minWidth: 30,
                }}
              >
                {option === 'Delete link' ? (
                  <Delete
                    style={{
                      color: 'red',
                    }}
                  />
                ) : undefined}
                {option === 'Add link' ? <Add /> : undefined}
                {option === 'Add current page' ? <Bookmark /> : undefined}
                {option === 'Rename' ? <Edit /> : undefined}
                {option === 'Open link as new tab' ? <OpenInBrowser /> : undefined}
                {option === 'Copy link' ? <FileCopy /> : undefined}
                {option === 'Update link' ? <Update /> : undefined}
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
}

interface GroupMoreMenuProps {
  startRename: () => void;
  startDeleteGroup: () => void;
  startAddGroup: () => void;
  startAddChildGroup: () => void;
}

function GroupMoreMenu({ startRename, startDeleteGroup, startAddGroup, startAddChildGroup }: GroupMoreMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (command: string) => {
    if (command === 'Rename') {
      startRename();
    } else if (command === 'Delete') {
      startDeleteGroup();
    } else if (command === 'Add next group') {
      startAddGroup();
    } else if (command === 'Add child group') {
      startAddChildGroup();
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
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
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
        {groupOptions.map((option) =>
          option === '-' ? (
            <Divider key={`${option}-${Date.now()}`} />
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
                {option === 'Add next group' ? <CreateNewFolder /> : undefined}
                {option === 'Add child group' ? <AccountTree /> : undefined}
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
}

interface GroupItemProps {
  group: GroupType;
  level: number;
}

function GroupItem({ group, level }: GroupItemProps) {
  const dispatch = useDispatch();
  const opens = useSelector((state: AppState) => state.linkState.opens);
  const classes = useStyles({
    open: true,
  });
  const [isRename, setIsRename] = useState(false);
  const textRef = useRef<string>(group.name);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <ListSubheader
      className={[className, classes.listSubHeader].join(' ')}
      style={{
        display: 'flex',
        // justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsRename(true);
      }}
    >
      {opens[group.id] ? (
        <FolderOpen onClick={() => dispatch(toggleLinkOpen(group.id))} style={{ flex: 'none' }} />
      ) : (
        <Folder onClick={() => dispatch(toggleLinkOpen(group.id))} style={{ flex: 'none' }} />
      )}
      {isRename ? (
        <Input
          defaultValue={textRef.current}
          onChange={(e) => {
            textRef.current = e.target.value;
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setIsRename(false);
              dispatch(setLinkName({ id: group.id, name: textRef.current }));
            }
          }}
        />
      ) : (
        <div
          style={{
            flex: 1,
            paddingLeft: 8,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={group.name}
        >
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
        {isRename ? undefined : (
          <GroupMoreMenu
            startRename={() => {
              setIsRename(true);
            }}
            startDeleteGroup={() => {
              handleClickOpen();
            }}
            startAddGroup={() => {
              dispatch(newGroupAt({ id: group.id, name: 'New Group' }));
            }}
            startAddChildGroup={() => {
              dispatch(newChildGroupAt({ parentId: group.id, name: 'New Group' }));
            }}
          />
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure to delete this group?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              dispatch(removeGroup({ id: group.id }));
              handleClose();
            }}
            autoFocus
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ListSubheader>
  );
}

interface SidebarItemProps {
  item: LinkItemType;
  level: number;
}

function SidebarItem({ item, level }: SidebarItemProps) {
  const dispatch = useDispatch();
  const opens = useSelector((state: AppState) => state.linkState.opens);
  const textRef = useRef<string>(item.name);
  const [isRename, setIsRename] = useState(false);
  const { docKey } = useParams<{ docKey: string }>();
  const classes = useStyles({ open: opens[item.id] });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClickOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const setOpenCallback = useCallback(() => {
    dispatch(toggleLinkOpen(item.id));
  }, [item.id, dispatch]);

  const handleCreateLink = useCallback(
    (name: string) => {
      dispatch(newLink({ parentId: item.id, name }));
    },
    [item.id, dispatch],
  );

  const handleDeleteLink = useCallback(() => {
    dispatch(removeLink({ id: item.id }));
  }, [item.id, dispatch]);

  const handleUpdateLink = useCallback(() => {
    dispatch(setLinkFileLink({ id: item.id, name: getTitle(), fileLink: docKey }));
  }, [item.id, dispatch, docKey]);

  const handleCopyLink = useCallback(() => {
    let link = item.fileLink || '';
    if (item.linkType === 'pairy') {
      link = `${window.location.origin}/${item.fileLink}`;
    }

    window.navigator.clipboard.writeText(link).then(() => {
      handleClickOpenSnackbar();
    });
  }, [item]);

  const handleCreateCurrentPage = useCallback(() => {
    dispatch(newLinkByCurrentPage({ parentId: item.id, name: getTitle(), fileLink: docKey }));
  }, [item.id, docKey, dispatch]);

  const handleRename = useCallback(
    (name: string) => {
      dispatch(setLinkName({ id: item.id, name }));
    },
    [item.id, dispatch],
  );

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
      selected={docKey === item.fileLink}
      disableRipple
    >
      {item.links?.length ? (
        <MoreIcon open={opens[item.id]} onClick={setOpenCallback} />
      ) : (
        <Message
          fontSize="small"
          style={{
            color: 'rgba(0, 0, 0, 0.2)',
          }}
        />
      )}
      {isRename ? (
        <Input
          defaultValue={textRef.current}
          onChange={(e) => {
            textRef.current = e.target.value;
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
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
                  window.open(`/${item.fileLink}`, item.fileLink);
                  break;
                default:
                  window.open(item.fileLink, '_blank');
              }
              return;
            }

            if (item.fileLink) {
              switch (item.linkType) {
                case 'pairy':
                  window.location.href = `/${item.fileLink}`;
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
        {isRename ? undefined : (
          <MoreMenu
            startOpenLinkAsNewTab={() => {
              if (item.fileLink) {
                switch (item.linkType) {
                  case 'pairy':
                    window.open(`/${item.fileLink}`, item.fileLink);
                    break;
                  default:
                    window.open(item.fileLink, '_blank');
                }
              }
            }}
            startRename={() => {
              setIsRename(true);
            }}
            startUpdateLink={() => {
              handleUpdateLink();
            }}
            startCopyLink={() => {
              handleCopyLink();
            }}
            startDeleteLink={() => {
              handleClickOpen();
            }}
            startAddLink={() => {
              handleCreateLink('Untitled name');
            }}
            startAddCurrentPage={() => {
              handleCreateCurrentPage();
            }}
          />
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Button onClick={handleClose}>Cancel</Button>
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
        message="Copy link"
      />
    </ListItem>
  );
}

interface SideBarItemListProps {
  links: ItemType[];
  level: number;
}

function SideBarItemList({ links, level }: SideBarItemListProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <List style={{ padding: 0 }}>
      {[...links].map((it) => {
        return (
          <Fragment key={it.id}>
            {it.type === 'group' ? (
              <GroupItem key={it.id} group={it} level={level} />
            ) : (
              <SidebarItem key={it.id} item={it} level={level} />
            )}

            {it.links && (
              <Collapse in={opens[it.id]} timeout="auto" unmountOnExit>
                <SideBarItemList links={[...it.links]} level={level + 1} />
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
}

function GroupView({ group }: GroupViewProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <Box style={{ backgroundColor: 'white' }}>
      <GroupItem group={group} level={0} />
      <Collapse in={opens[group.id]} timeout="auto" unmountOnExit>
        <SideBarItemList links={[...group.links]} level={1} />
      </Collapse>
    </Box>
  );
}

export function SideBar() {
  const dispatch = useDispatch();
  const linkState = useSelector((state: AppState) => state.linkState);
  const open = useSelector((state: AppState) => state.linkState.openTab);
  const linkRef = useRef<boolean>(false);
  const classes = useStyles({ open });
  const { docKey } = useParams<{ docKey: string }>();

  const showTreeNode = useCallback(
    (id: string) => {
      const parentList: string[] = [];
      let currentDepth = -1;

      function searchPath(data: any[], depth = 0, callback: (item: any) => boolean): boolean {
        let found = false;
        for (let i = 0; i < data.length; i += 1) {
          parentList[depth] = data[i].id;
          if (callback(data[i])) {
            currentDepth = depth;
            found = true;
            break;
          }
          if (data[i].links) {
            if (searchPath(data[i].links, depth + 1, callback)) {
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
      const findItem = findOne(linkState.groups, (item) => item.fileLink === docKey && item.linkType === 'pairy');
      if (findItem) {
        showTreeNode(findItem.id);
        linkRef.current = true;
      }
    }
  }, [docKey, showTreeNode, linkState.groups]);

  return (
    <Drawer variant="permanent" className={classes.drawer} open={linkState.openTab}>
      <ListSubheader style={{ backgroundColor: 'white', borderBottom: '1px solid #ececec' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" style={{ fontWeight: 400, fontSize: 14 }}>
            Links
          </Typography>
          <IconButton
            onClick={() => {
              dispatch(toggleLinkTab());
            }}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      </ListSubheader>
      {linkState.groups.map((group) => {
        return <GroupView key={group.id} group={group} />;
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
        <Button
          variant="outlined"
          disableRipple
          style={{
            width: '80%',
            margin: '0 auto',
          }}
          onClick={() => {
            dispatch(newGroup('New Group'));
          }}
        >
          <Add fontSize="small" />
          Group
        </Button>
        <Box height={30} />
      </div>
    </Drawer>
  );
}
