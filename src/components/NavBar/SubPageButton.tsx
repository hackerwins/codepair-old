import React, { useState } from 'react';
import { ArrowDropDown, DescriptionOutlined } from '@mui/icons-material';
import { Button, List, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material';
import { findCurrentPageLink, LinkItemType } from 'features/linkSlices';
import { useSelector } from 'react-redux';

export function SubPageButton() {
  const currentItem = useSelector(findCurrentPageLink);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return currentItem.links?.length ? (
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
          elevation={2}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          style={{
            marginTop: 4,
          }}
        >
          <List>
            {currentItem.links?.map((item) => {
              const tempItem = item as LinkItemType;
              return (
                <ListItemButton dense component="a" href={`${tempItem.fileLink}`} key={tempItem.id}>
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
