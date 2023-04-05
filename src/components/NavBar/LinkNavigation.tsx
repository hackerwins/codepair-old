import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { AppState } from 'app/rootReducer';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemType, LinkItemType } from 'features/linkSlices';
import { Button, Divider, List, ListItemButton, ListItemText, Popover, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Add from '@mui/icons-material/Add';

import { makeStyles } from 'styles/common';
import { PageButton } from './PageButton';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    color: theme.palette.text.primary,
  },
  button: {
    height: '100%',
    color: theme.palette.text.primary,
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export function LinkNavigation() {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const linkState = useSelector((state: AppState) => state.linkState);
  const [linkList, setLinkList] = useState<ItemType[]>([]);
  const { docKey } = useParams<{ docKey: string }>();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const handleSettingsClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  const showTreeNode = useCallback(
    (id: string) => {
      const parentList: ItemType[] = [];

      function searchPath(data: unknown[], depth: number, callback: (item: any) => boolean): boolean {
        let found = false;
        for (let i = 0; i < data.length; i += 1) {
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
        return item.fileLink === id;
      });

      setLinkList([...parentList]);
    },
    [linkState.links],
  );

  useEffect(() => {
    if (docKey) {
      showTreeNode(window.location.pathname);
    }
  }, [docKey, showTreeNode]);

  return (
    <div className={classes.root}>
      {linkList.length ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={handleSettingsClick}
            style={{
              minWidth: 140,
              whiteSpace: 'nowrap',
              justifyContent: 'start',
            }}
            title={linkList[linkList.length - 1].name}
          >
            <Typography
              color="GrayText"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {linkList[linkList.length - 1].name}
            </Typography>
            <ExpandMore />
          </Button>
          <PageButton
            icon={<Add />}
            insertTarget={linkList[linkList.length - 1]}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          />
        </div>
      ) : undefined}
      {anchorEl ? (
        <Popover
          open
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={handleSettingsClose}
        >
          <List>
            <li>
              <Typography sx={{ mt: 0.5, ml: 2 }} color="text.secondary" display="block" variant="caption">
                Workspace
              </Typography>
            </li>
            {linkList.map((item, depth) => {
              const tempItem = item as LinkItemType;

              if (item.type === 'group') {
                return null;
              }
              return (
                <ListItemButton
                  dense
                  onClick={() => {
                    navigate(`${tempItem.fileLink}`);
                  }}
                  key={tempItem.id}
                >
                  <ListItemText
                    style={{
                      paddingLeft: depth * 16,
                    }}
                  >
                    {tempItem.name}
                  </ListItemText>
                </ListItemButton>
              );
            })}
            {linkList[linkList.length - 1].links?.length ? (
              <>
                <Divider />
                <li>
                  <Typography sx={{ mt: 0.5, ml: 2 }} color="text.secondary" display="block" variant="caption">
                    Subpages
                  </Typography>
                </li>
                {linkList[linkList.length - 1].links?.map((item) => {
                  const tempItem = item as LinkItemType;
                  return (
                    <ListItemButton
                      dense
                      onClick={() => {
                        navigate(`${tempItem.fileLink}`);
                      }}
                      key={tempItem.id}
                    >
                      <ListItemText>{tempItem.name}</ListItemText>
                    </ListItemButton>
                  );
                })}
              </>
            ) : undefined}
          </List>
        </Popover>
      ) : undefined}
    </div>
  );
}
