import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { AppState } from 'app/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_WORKSPACE, ItemType, LinkItemType, setCurrentWorkspace } from 'features/linkSlices';
import { Button, Divider, List, ListItemButton, ListItemText, Popover, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Add from '@mui/icons-material/Add';
import Adjust from '@mui/icons-material/Adjust';

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
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const linkState = useSelector((state: AppState) => state.linkState);
  const [linkList, setLinkList] = useState<ItemType[]>([]);
  const { docKey } = useParams<{ docKey: string }>();
  const currentWorkspace = useSelector((state: AppState) => {
    const currentLink = linkList[linkList.length - 1] as LinkItemType;
    return state.linkState.workspaceList.find((w) => w.id === currentLink?.workspace);
  });
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>();
  const handleSettingsClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  const handleSetCurrentWorkspace = useCallback(
    (id?: string) => {
      dispatch(setCurrentWorkspace({ workspace: id || DEFAULT_WORKSPACE }));
    },
    [dispatch],
  );

  const showTreeNode = useCallback(
    (id: string) => {
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
          elevation={1}
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
          <List
            style={{
              minWidth: 200,
            }}
          >
            <li>
              <Typography sx={{ mt: 0.5, ml: 2 }} color="text.secondary" display="block" variant="caption">
                <Button
                  size="small"
                  style={{
                    textTransform: 'none',
                  }}
                  startIcon={<Adjust />}
                  onClick={() => handleSetCurrentWorkspace(currentWorkspace?.id)}
                >
                  {currentWorkspace?.name}
                </Button>
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
