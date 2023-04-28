import React, { useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store';
import { AppState } from 'app/rootReducer';
import { LinkItemType, toggleFavorite } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import FileCopy from '@mui/icons-material/FileCopy';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Star from '@mui/icons-material/Star';
import OpenInBrowser from '@mui/icons-material/OpenInBrowser';

import {
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { Theme } from 'features/settingSlices';
import { LaunchOutlined, LinkOutlined } from '@mui/icons-material';

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
    color: theme.palette.mode === Theme.Dark ? 'white' : 'black',
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
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 6,
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

const headingOptions = ['Favorite', '-', 'Open in Browser', 'Copy'];

interface HeadingMoreMenuProps {
  item: LinkItemType;
}

function HeadingMoreMenu({ item }: HeadingMoreMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favorite = useSelector((state: AppState) => state.linkState.favorite);
  const { classes } = useStyles();
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

type LoopType = 'links' | 'favorite' | 'date';

interface SidebarItemProps {
  item: LinkItemType;
  level: number;
  loopType: LoopType;
}

interface HeadingIconProps {
  item: LinkItemType;
}

function HeadingIcon({ item }: HeadingIconProps) {
  const type = item.linkType as any;

  if (type === 'markdown-link') {
    return (
      <span
        style={{
          color: '#999',
          fontWeight: 'bold',
          paddingLeft: 10,
          textShadow: '1px 1px 0px #222',
          verticalAlign: 'middle',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <LinkOutlined fontSize="small" />
      </span>
    );
  }
  return (
    <span
      style={{
        color: '#999',
        fontWeight: 'bold',
        paddingLeft: 10,
        textShadow: '1px 1px 0px #222',
      }}
    >
      H{(item.level || 0) + 1}
    </span>
  );
}

export function HeadingItem({ item, level, loopType }: SidebarItemProps) {
  const { classes } = useStyles();
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

  const currentLink =
    item.linkType === 'markdown-link'
      ? `#${encodeURIComponent(`${item.originalText}`)}`
      : `#${item.fileLink?.split('#').pop()}`;

  return (
    <ListItemButton
      className={[className, classes.sidebarItem].join(' ')}
      component="a"
      href={currentLink}
      dense
      // button
      selected={`${window.location.pathname}${window.location.hash}` === item.fileLink}
      disableRipple
      style={{
        display: isView ? 'flex' : 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        textDecoration: 'none',
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
          }
        }}
      />

      {item.linkType === 'markdown-link' ? (
        <div
          className="sidebar-item-more"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
            // visibility: 'hidden',
            lineHeight: 1,
          }}
        >
          <IconButton
            onClick={() => {
              window.open(item.fileLink, '_blank');
            }}
          >
            <LaunchOutlined fontSize="small" />
          </IconButton>
        </div>
      ) : (
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
      )}
    </ListItemButton>
  );
}
