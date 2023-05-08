import React, { useState } from 'react';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import { Button, List, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material';
import { findCurrentPageLink, LinkItemType } from 'features/linkSlices';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function SubPageButton() {
  const navigate = useNavigate();
  const currentItem = useSelector(findCurrentPageLink);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (currentItem?.links || [])?.length ? (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Button
        size="small"
        variant="text"
        endIcon={<ArrowDropDown />}
        style={{
          textTransform: 'capitalize',
        }}
        onClick={(e) => {
          setAnchorEl(e.target as any);
        }}
      >
        Subpages
      </Button>
      {anchorEl ? (
        <Popover
          open
          anchorEl={anchorEl}
          onClose={handleClose}
          elevation={1}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          style={{
            marginTop: 4,
          }}
        >
          <List>
            {currentItem.links?.map((item) => {
              const tempItem = item as LinkItemType;
              return (
                <ListItemButton
                  dense
                  onClick={() => {
                    navigate(`${tempItem.fileLink}`);
                  }}
                  key={tempItem.id}
                >
                  <ListItemIcon>
                    <DescriptionOutlined />
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
  ) : null;
}
