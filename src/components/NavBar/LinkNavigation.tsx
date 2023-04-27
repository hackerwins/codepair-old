import React, { useCallback, useEffect, useState } from 'react';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { findCurrentPageLink, ItemType, LinkItemType } from 'features/linkSlices';
import {
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Typography,
} from '@mui/material';

import { makeStyles } from 'styles/common';
import Home from '@mui/icons-material/Home';
import { MimeType } from 'constants/editor';
import BorderAll from '@mui/icons-material/BorderAll';
import Gesture from '@mui/icons-material/Gesture';
import { AccountTree, DescriptionOutlined } from '@mui/icons-material';
import { Theme } from 'features/settingSlices';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  button: {
    display: 'flex',
    gap: 2,
    height: 20,
    padding: '0px 3px',
    minWidth: 'auto',
    backgroundColor: theme.palette.mode === Theme.Dark ? '#333333' : '#fff',
  },

  chip: {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
  colorView: {
    width: 6,
    height: 6,
    borderRadius: 5,
    display: 'inline-block',
  },

  currentItem: {
    pointerEvents: 'none',
    color: theme.palette.mode === Theme.Dark ? '#999' : '#777',
  },
}));

function getIcon(item: ItemType) {
  if (item.type === 'link') {
    switch (item.mimeType) {
      case MimeType.CELL:
        return <BorderAll fontSize="small" />;
      case MimeType.WHITEBOARD:
        return <Gesture fontSize="small" />;
      default:
        return <DescriptionOutlined fontSize="small" />;
    }
  }

  return <Home fontSize="small" />;
}

export function LinkNavigation() {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const linkState = useSelector((state: AppState) => state.linkState);
  const currentItem = useSelector(findCurrentPageLink);
  const [linkList, setLinkList] = useState<ItemType[]>([]);
  const { docKey } = useParams<{ docKey: string }>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLinkClick = (item: ItemType) => {
    navigate(`${(item as LinkItemType).fileLink}`);
    handleClose();
  };

  const showTreeNode = useCallback(
    (id: string) => {
      if (!docKey) {
        return;
      }

      const parentList: ItemType[] = [];

      function searchPath(data: unknown[], depth: number, callback: (item: any) => boolean): boolean {
        let found = false;
        for (let i = 0; i < data.length; i += 1) {
          if (!data[i]) continue;
          parentList[depth] = data[i] as ItemType;
          parentList.length = depth + 1;
          if (callback(data[i])) {
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

      searchPath(linkState.links, 0, (item) => {
        return item?.fileLink === id;
      });

      // parentList.pop();
      setLinkList([...parentList]);
    },
    [linkState.links, docKey],
  );

  useEffect(() => {
    if (docKey) {
      showTreeNode(window.location.pathname);
    }
  }, [docKey, showTreeNode]);

  return (
    <div className={classes.root}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <Button
            size="small"
            variant="text"
            className={classes.button}
            onClick={(e) => {
              setAnchorEl(e.target as any);
            }}
          >
            <MoreHoriz />
          </Button>
          {anchorEl ? (
            <Popover
              open
              anchorEl={anchorEl}
              onClose={handleClose}
              // elevation={2}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              style={{
                transform: 'translateY(12px)',
              }}
            >
              <List>
                <ListSubheader
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '10px 16px',
                  }}
                >
                  <AccountTree fontSize="small" />
                  <Typography variant="body2">Pages</Typography>
                </ListSubheader>
                <Divider />
                {linkList.slice(0, linkList.length - 1).map((item, index) => (
                  <ListItemButton
                    dense
                    onClick={() => {
                      handleLinkClick(item);
                    }}
                    key={item.id}
                    style={{
                      paddingLeft: index * 24 + 10,
                    }}
                  >
                    <ListItemIcon
                      style={{
                        minWidth: 30,
                      }}
                    >
                      {getIcon(item)}
                    </ListItemIcon>
                    <ListItemText
                      style={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.name}
                    </ListItemText>
                  </ListItemButton>
                ))}

                {linkList[linkList.length - 1] ? (
                  <ListItemButton
                    dense
                    onClick={() => {
                      handleLinkClick(linkList[linkList.length - 1]);
                    }}
                    className={classes.currentItem}
                    style={{
                      paddingLeft: (linkList.length - 1) * 24 + 10,
                    }}
                  >
                    <ListItemIcon
                      style={{
                        minWidth: 30,
                      }}
                    >
                      {getIcon(linkList[linkList.length - 1])}
                    </ListItemIcon>
                    <ListItemText
                      style={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {(linkList[linkList.length - 1] as LinkItemType).name}
                    </ListItemText>
                  </ListItemButton>
                ) : undefined}

                {currentItem.links?.map((item) => {
                  const tempItem = item as LinkItemType;
                  return (
                    <ListItemButton
                      dense
                      onClick={() => {
                        handleLinkClick(tempItem);
                      }}
                      key={tempItem.id}
                      style={{
                        paddingLeft: linkList.length * 24 + 10,
                      }}
                    >
                      <ListItemIcon
                        style={{
                          minWidth: 30,
                        }}
                      >
                        {getIcon(item)}
                      </ListItemIcon>
                      <ListItemText
                        style={{
                          textTransform: 'capitalize',
                        }}
                      >
                        {tempItem.name}
                      </ListItemText>
                    </ListItemButton>
                  );
                })}
              </List>
            </Popover>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}
