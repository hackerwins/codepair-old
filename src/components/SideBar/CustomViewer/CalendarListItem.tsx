import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import { LinkItemType, removeLink, setLinkName, toggleFavorite } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import BorderAll from '@mui/icons-material/BorderAll';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import FileCopy from '@mui/icons-material/FileCopy';
import Gesture from '@mui/icons-material/Gesture';
import SubdirectoryArrowLeft from '@mui/icons-material/SubdirectoryArrowLeft';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Star from '@mui/icons-material/Star';
import OpenInBrowser from '@mui/icons-material/OpenInBrowser';

import {
  Button,
  Chip,
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
  Typography,
} from '@mui/material';
import { PageButton } from 'components/NavBar/PageButton';
import Description from '@mui/icons-material/Description';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { addRecentPage } from 'features/currentSlices';
import { DescriptionOutlined } from '@mui/icons-material';
import { Theme } from 'features/settingSlices';
import { findColor } from 'utils/document';

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  listItemText: {
    margin: 0,
    [`& .MuiTypography-root`]: {
      fontSize: '1rem',
      paddingLeft: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: 500,
    },
  },
  calendarItem: {
    display: 'block',
    padding: '4px 10px !important',
    borderRadius: 6,
    marginBottom: 10,
    [`&:hover .sidebar-item-more`]: {
      visibility: 'visible !important' as any,
    },
    [`&:hover`]: {
      backgroundColor: theme.palette.mode === Theme.Dark ? `rgba(150, 150, 150, 0.25)` : `rgba(150, 150, 150, 0.25)`,
    },
  },
  calendarItemSelected: {
    backgroundColor: theme.palette.mode === Theme.Dark ? `rgba(25, 118, 210, 0.5)` : `rgba(25, 118, 210, 0.25)`,
    // color: theme.palette.mode === Theme.Dark ? 'white' : 'black',
  },
}));

const options = ['Favorite', '-', 'New subnote', 'Rename', 'Delete', '-', 'Open in Browser', 'Copy Link'];

interface MoreMenuProps {
  item: LinkItemType;
  startRename: () => void;
}
function MoreMenu({ item, startRename }: MoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
    }

    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        style={{
          padding: 2,
        }}
      >
        <MoreHoriz />
      </IconButton>
      {open ? (
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          elevation={2}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          style={{
            marginLeft: 10,
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
                  {option === 'New subnote' ? <Description /> : undefined}
                  {option === 'Add current note' ? <SubdirectoryArrowLeft /> : undefined}
                  {option === 'Rename' ? <Edit /> : undefined}
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
                <ListItemText>
                  {option === 'New subnote' ? (
                    <PageButton
                      icon={null}
                      insertTarget={item}
                      title="New subnote"
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

type LoopType = 'links' | 'favorite' | 'date';

interface CalendarItemProps {
  item: LinkItemType;
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

  return icon || <DescriptionOutlined fontSize="small" />;
}

export function CalendarItem({ item, loopType }: CalendarItemProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textRef = useRef<string>(item.name);
  const [isRename, setIsRename] = useState(false);
  const { docKey } = useParams<{ docKey: string }>();
  const { classes } = useStyles();

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

  const linkItemTime = dayjs(item.createdAt, 'YYYYMMDDHHmm');

  let displayTime = linkItemTime.format('HH:mm');
  const timeAgo = linkItemTime.fromNow();

  if (timeAgo.includes('day') === false) {
    displayTime = linkItemTime.fromNow();
  }

  return (
    <ListItem
      dense
      className={[
        classes.calendarItem,
        item.fileLink?.startsWith(`/${docKey}`) ? classes.calendarItemSelected : undefined,
      ].join(' ')}
      button
      disableRipple
      style={{
        backgroundColor: item.color,
        color: findColor(`${item.color}`).font,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {loopType !== 'date' && !item.emoji ? <MimeTypeIcon mimeType={item.mimeType} /> : undefined}

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
            primary={
              <>
                {item.emoji ? (
                  <Typography
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      marginRight: 10,
                      fontSize: 20,
                      // transform: 'scale(1.4)',
                    }}
                  >
                    {item.emoji}
                  </Typography>
                ) : (
                  ''
                )}
                {item.name}
              </>
            }
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
      </div>
      <div>
        <Chip
          label={displayTime}
          size="small"
          style={{
            height: 20,
            borderRadius: 0,
            backgroundColor: item.color,
            color: findColor(`${item.color}`).font,
            // textShadow: `0 0 2px ${invert(invert(`${item.color}`, true), true)}`,
          }}
        />
      </div>
    </ListItem>
  );
}

interface CalendarListItemProps {
  item: LinkItemType;
  loopType: LoopType;
}

export function CalendarListItem({ item, loopType }: CalendarListItemProps) {
  return <CalendarItem item={item} loopType={loopType} />;
}
