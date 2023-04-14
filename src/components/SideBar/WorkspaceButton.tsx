import React, { useState } from 'react';
import { Button, Divider, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Typography } from '@mui/material';
import AccountTree from '@mui/icons-material/AccountTree';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import Add from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';
import Check from '@mui/icons-material/Check';
import { setCurrentWorkspace } from 'features/linkSlices';
import { AddWorkspaceDialog } from './AddWorkspaceDialog';

export function WorkspaceButton() {
  const dispatch = useDispatch();
  const menu = useSelector((state: AppState) => state.settingState.menu);

  const linkState = useSelector((state: AppState) => state.linkState);
  let currentWorkspace = useSelector((state: AppState) =>
    state.linkState.workspaceList.find((w) => w.id === state.linkState.workspace),
  );

  if (!currentWorkspace) {
    if (linkState.workspace === 'last day') {
      currentWorkspace = {
        id: 'last day',
        name: 'Last day',
      };
    } else if (linkState.workspace === 'last week') {
      currentWorkspace = {
        id: 'last week',
        name: 'Last week',
      };
    } else if (linkState.workspace === 'last month') {
      currentWorkspace = {
        id: 'last month',
        name: 'Last month',
      };
    } else {
      currentWorkspace = {
        id: 'calendar',
        name: 'Calendar',
      };
    }
  }

  const workspaceList = useSelector((state: AppState) =>
    state.linkState.workspaceList?.length
      ? state.linkState.workspaceList
      : [
          {
            id: 'default',
            name: 'Default',
          },
        ],
  );
  const [addWorkspaceDialog, setAddWorkspaceDialog] = useState(false);
  const [workspaceMenu, setWorkspaceMenu] = useState<null | HTMLElement>(null);
  const handleOpenWorkspaceMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setWorkspaceMenu(event.currentTarget);
  };

  const handleCloseWorkspaceMenu = () => {
    setWorkspaceMenu(null);
  };

  const handleAddWorkspace = () => {
    setAddWorkspaceDialog(true);
    handleCloseWorkspaceMenu();
  };

  const handleSetCurrentWorkspace = (id: string) => {
    dispatch(
      setCurrentWorkspace({
        workspace: id,
      }),
    );
    handleCloseWorkspaceMenu();
  };

  return (
    <>
      <Button
        disableElevation
        style={{
          color: menu.theme === Theme.Dark ? 'white' : 'black',
          textTransform: 'none',
        }}
        size="small"
        startIcon={<AccountTree fontSize="small" />}
        endIcon={<UnfoldMore fontSize="small" />}
        onClick={handleOpenWorkspaceMenu}
      >
        {currentWorkspace?.name}
      </Button>
      {workspaceMenu ? (
        <Menu
          id="basic-menu"
          anchorEl={workspaceMenu}
          open
          elevation={2}
          onClose={handleCloseWorkspaceMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            dense: true,
          }}
        >
          <MenuItem onClick={() => handleSetCurrentWorkspace('last day')}>
            <ListItemIcon>{currentWorkspace?.id === 'last day' ? <Check fontSize="small" /> : undefined}</ListItemIcon>
            Last day
          </MenuItem>
          <MenuItem onClick={() => handleSetCurrentWorkspace('last week')}>
            <ListItemIcon>{currentWorkspace?.id === 'last week' ? <Check fontSize="small" /> : undefined}</ListItemIcon>
            Last week
          </MenuItem>
          <MenuItem onClick={() => handleSetCurrentWorkspace('last month')}>
            <ListItemIcon>
              {currentWorkspace?.id === 'last month' ? <Check fontSize="small" /> : undefined}
            </ListItemIcon>
            Last month
          </MenuItem>
          <MenuItem onClick={() => handleSetCurrentWorkspace('calendar')}>
            <ListItemIcon>{currentWorkspace?.id === 'calendar' ? <Check fontSize="small" /> : undefined}</ListItemIcon>
            Calendar
          </MenuItem>
          <Divider />
          <ListSubheader>
            <Typography
              style={{
                display: 'flex',
                alignItems: 'center',
                color: menu.theme === Theme.Dark ? 'rgba(255, 255, 255, 0.9)' : 'GrayText',
              }}
            >
              Workspaces
            </Typography>
          </ListSubheader>

          {workspaceList.map((it) => {
            return (
              <MenuItem key={it.id} onClick={() => handleSetCurrentWorkspace(it.id)}>
                <ListItemIcon>{it.id === currentWorkspace?.id ? <Check fontSize="small" /> : undefined}</ListItemIcon>
                <ListItemText primary={it.name} />
              </MenuItem>
            );
          })}

          <Divider />
          <MenuItem onClick={handleAddWorkspace}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Add Workspace" />
          </MenuItem>
        </Menu>
      ) : undefined}
      {addWorkspaceDialog ? <AddWorkspaceDialog onClose={() => setAddWorkspaceDialog(false)} /> : undefined}
    </>
  );
}
