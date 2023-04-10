import React, { useState } from 'react';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import AccountTree from '@mui/icons-material/AccountTree';
import { Adjust, CalendarMonth, UnfoldMore } from '@mui/icons-material';
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

  let currentWorkspace = useSelector((state: AppState) =>
    state.linkState.workspaceList.find((w) => w.id === state.linkState.workspace),
  );

  if (!currentWorkspace) {
    currentWorkspace = {
      id: 'calendar',
      name: 'Calendar',
    };
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
          <MenuItem onClick={() => handleSetCurrentWorkspace('calendar')}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            Calendar
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Adjust />
            </ListItemIcon>
            <Typography
              variant="subtitle2"
              style={{
                color: menu.theme === Theme.Dark ? 'rgba(255, 255, 255, 0.9)' : 'GrayText',
              }}
            >
              Workspaces
            </Typography>
          </MenuItem>

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
