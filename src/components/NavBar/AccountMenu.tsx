import React, { memo, MouseEvent, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';
import { Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { setTool, ToolType } from 'features/boardSlices';
import { SettingsDialog } from 'pages/SettingsDialog';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from 'react-router-dom';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import GitHub from '@mui/icons-material/GitHub';

function AccountMenu() {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);
  const menu = useSelector((state: AppState) => state.settingState.menu);
  const dispatch = useDispatch();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLDivElement | undefined>();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | undefined>();

  const handleSettingsClose = useCallback(() => {
    setAnchorEl(undefined);
    dispatch(setTool(ToolType.None));
  }, [dispatch]);

  const handleOpenMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      setMenuAnchorEl(event.currentTarget);
    },
    [setMenuAnchorEl],
  );

  const handleCloseMenu = useCallback(() => {
    setMenuAnchorEl(undefined);
  }, [setMenuAnchorEl]);

  const handleSettingsClick = useCallback(() => {
    handleCloseMenu();
    dispatch(setTool(ToolType.Settings));
    setAnchorEl(avatarRef.current as any);
  }, [dispatch, setAnchorEl, handleCloseMenu]);

  return (
    <>
      <Tooltip title="Settings">
        <Avatar
          ref={avatarRef}
          sx={{ bgcolor: menu.userColor, cursor: 'pointer', width: 30, height: 30 }}
          onClick={handleOpenMenu}
        >
          {menu.userName.slice(0, 1).toUpperCase()}
        </Avatar>
      </Tooltip>
      {menuAnchorEl ? (
        <Menu
          open
          anchorEl={menuAnchorEl}
          elevation={2}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          style={{
            marginTop: 10,
          }}
        >
          <MenuItem
            onClick={() => {
              handleSettingsClick();
            }}
          >
            <ListItemIcon>
              <Avatar sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              navigate('/developer-qna');
            }}
          >
            <ListItemIcon>
              <RecordVoiceOver />
            </ListItemIcon>
            <ListItemText primary="Yorkie Developer QnA" />
          </MenuItem>
          <MenuItem onClick={() => navigate('/qna')}>
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary="Yorkie QnA" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigate('https://github.com/yorkie-team/yorkie')}>
            <ListItemIcon>
              <GitHub />
            </ListItemIcon>
            <ListItemText primary="Yorkie Github" />
          </MenuItem>
          <MenuItem onClick={() => navigate('https://github.com/yorkie-team/yorkie-js-sdk')}>
            <ListItemIcon>
              <GitHub />
            </ListItemIcon>
            <ListItemText primary="Yorkie SDK" />
          </MenuItem>
          <MenuItem onClick={() => navigate('https://github.com/yorkie-team/codepair')}>
            <ListItemIcon>
              <GitHub />
            </ListItemIcon>
            <ListItemText primary="Codepair Github" />
          </MenuItem>
        </Menu>
      ) : undefined}

      {anchorEl ? <SettingsDialog open handleClose={handleSettingsClose} /> : undefined}
    </>
  );
}

export default memo(AccountMenu);
