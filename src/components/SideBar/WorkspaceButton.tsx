import React, { useState } from 'react';
import { Button, Divider, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Typography } from '@mui/material';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import Add from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { Theme } from 'features/settingSlices';
import Check from '@mui/icons-material/Check';
import { setCurrentWorkspace } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import { AddWorkspaceDialog } from './AddWorkspaceDialog';

const useStyles = makeStyles<{ sidebarWidth: number }>()((theme, props) => ({
  workspaceButton: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.mode === Theme.Dark ? '#454545' : '#fff',
    textTransform: 'none',
    flex: '1 1 auto',
    textAlign: 'left',
    border: theme.palette.mode === Theme.Dark ? '1px solid #333333' : '1px solid #e9e9e9',
  },
  workspaceMenu: {
    transform: 'translateY(4px)',
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.background.paper,
      minWidth: props.sidebarWidth - 130,
    },
  },
}));

export function WorkspaceButton() {
  const dispatch = useDispatch();
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const navState = useSelector((state: AppState) => state.navState);
  const { classes } = useStyles({
    sidebarWidth: navState.sidebarWidth,
  });

  const currentWorkspace = useSelector((state: AppState) =>
    state.linkState.workspaceList.find((w) => w.id === state.linkState.workspace),
  );

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
        className={classes.workspaceButton}
        disableRipple
        // size="small"
        // startIcon={<AccountTree fontSize="small" />}
        endIcon={<UnfoldMore fontSize="small" />}
        onClick={handleOpenWorkspaceMenu}
      >
        <Typography
          fontSize="small"
          style={{
            flex: '1 1 auto',
          }}
        >
          {currentWorkspace?.name}
        </Typography>
      </Button>
      {workspaceMenu ? (
        <Menu
          id="basic-menu"
          className={classes.workspaceMenu}
          anchorEl={workspaceMenu}
          open
          elevation={3}
          style={{
            transform: 'translateY(4px)',
          }}
          onClose={handleCloseWorkspaceMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            dense: true,
          }}
        >
          {/* <MenuItem onClick={() => handleSetCurrentWorkspace('last day')}>
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
          <Divider /> */}
          <ListSubheader
            style={{
              backgroundColor: menu.theme === Theme.Dark ? '#242424' : 'white',
            }}
          >
            <Typography
              fontSize="small"
              style={{
                paddingBottom: 4,
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
