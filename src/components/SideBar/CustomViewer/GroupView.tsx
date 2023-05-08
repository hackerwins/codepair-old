import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import {
  copyMarkdownTextForGroup,
  GroupType,
  newLinkByCurrentPage,
  removeLink,
  setLinkName,
  toggleFavorite,
  toggleLinkOpen,
} from 'features/linkSlices';
import { showMessage } from 'features/messageSlices';
import { makeStyles } from 'styles/common';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Delete from '@mui/icons-material/Delete';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FileCopy from '@mui/icons-material/FileCopy';
import FolderOpen from '@mui/icons-material/FolderOpen';
import SubdirectoryArrowLeft from '@mui/icons-material/SubdirectoryArrowLeft';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Star from '@mui/icons-material/Star';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';

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
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
} from '@mui/material';
import { PageButton } from 'components/NavBar/PageButton';
import Description from '@mui/icons-material/Description';
import { Theme } from 'features/settingSlices';
import { SideBarItemList } from '../SidebarItemList';

interface SideBarProps {
  open: boolean;
}

const SIDEBAR_WIDTH = 300;

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
    backgroundColor: theme.palette.mode === Theme.Dark ? '#202020' : '#fafafa',
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
}));

const groupOptions = ['Favorite', '-', 'New subnote', 'Add current note', 'Rename', '-', 'Delete', '-', 'Copy'];

interface GroupMoreMenuProps {
  group: GroupType;
  startRename: () => void;
}

function GroupMoreMenu({ group, startRename }: GroupMoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const links = useSelector((state: AppState) => state.linkState.links);
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
    dispatch(newLinkByCurrentPage({ parentId: group.id, name: getTitle(), fileLink: `/${docKey}`, emoji: '😀' }));
  }, [group.id, docKey, dispatch]);

  const handleClose = (command: string) => {
    if (command === 'Rename') {
      startRename();
    } else if (command === 'Delete') {
      if (links.length === 1) {
        dispatch(
          showMessage({
            type: 'warning',
            message: 'You can not delete the last group',
          }),
        );
        return;
      }

      handleClickDialogOpen();
    } else if (command === 'New subnote') {
      // noop
      return;
    } else if (command === 'Add current note') {
      handleCreateCurrentPage();
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
                {option === 'New subnote' ? <Description /> : undefined}
                {option === 'Favorite' ? (
                  <Star
                    style={{
                      color: favorite.includes(group.id) ? 'blue' : undefined,
                    }}
                  />
                ) : undefined}
                {option === 'Copy' ? <FileCopy /> : undefined}
              </ListItemIcon>
              <ListItemText>
                {option === 'New subnote' ? (
                  <PageButton
                    icon={null}
                    insertTarget={group}
                    title="New subnote"
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
                if (links.length < 2) {
                  dispatch(
                    showMessage({
                      type: 'warning',
                      message: 'You can not delete the last group',
                    }),
                  );
                  return;
                }

                dispatch(removeLink({ id: group.id }));
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

export function GroupItem({ group, level, loopType }: GroupItemProps) {
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
      className={[classes.listSubHeader, className].join(' ')}
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

type LoopType = 'links' | 'favorite' | 'date';

interface GroupViewProps {
  group: GroupType;
  loopType: LoopType;
  level: number;
}

export function GroupView({ group, level, loopType }: GroupViewProps) {
  const opens = useSelector((state: AppState) => state.linkState.opens);
  return (
    <Box>
      <GroupItem group={group} level={level} loopType={loopType} />
      <Collapse in={opens[group.id]} timeout="auto" unmountOnExit>
        <SideBarItemList links={[...group.links]} level={level + 1} loopType={loopType} />
      </Collapse>
    </Box>
  );
}
