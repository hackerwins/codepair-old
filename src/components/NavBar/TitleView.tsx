import React, { useEffect, useState } from 'react';
import { Popover, TextField } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { findCurrentPageLink, setLinkEmoji, setLinkName } from 'features/linkSlices';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'styles/common';

const useStyles = makeStyles()(() => ({
  titleInput: {
    width: '100%',
    // backgroundColor: 'yellow',
    '& .MuiInputBase-root': {
      fontSize: '1.3rem',
      fontWeight: 700,

      '&:hover:not(.Mui-disabled, .Mui-error):before': {
        borderBottom: 'none',
      },

      '&:before': {
        borderBottom: 'none',
      },
      '&:after': {
        borderBottom: 'none',
      },
    },
  },
}));

function TitleInput() {
  const dispatch = useDispatch();
  const currentItem = useSelector(findCurrentPageLink);
  const { classes } = useStyles();
  const [title, setTitle] = useState(currentItem?.name || '');

  useEffect(() => {
    setTitle(currentItem?.name || '');
  }, [currentItem?.fileLink, currentItem?.name]);

  return (
    <TextField
      className={classes.titleInput}
      placeholder={title === 'Untitled note' ? 'Untitled note' : ''}
      variant="standard"
      onInput={(e) => {
        const inputTitle = (e.target as any).value;
        setTitle(inputTitle);
        dispatch(setLinkName({ id: currentItem.id, name: inputTitle }));
      }}
      value={title === 'Untitled note' ? '' : title}
    />
  );
}

export function TitleView() {
  const dispatch = useDispatch();
  const currentItem = useSelector(findCurrentPageLink);
  //   const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setAnchorEl(null);
  };

  const handleModifyLinkStatus = (emoji: string) => {
    dispatch(setLinkEmoji({ id: currentItem.id, emoji }));
  };

  const tempEmoji = currentItem?.emoji || '😀';

  const emo = (tempEmoji as any).emoji ? (tempEmoji as any).emoji : tempEmoji;

  return (
    <div
      style={{
        display: 'flex',
        marginTop: 0,
        marginBottom: 0,
        // padding: '0px 20px',
        alignItems: 'center',
        flex: '1 1 auto',
      }}
    >
      <span
        onClick={handleClick}
        role="button"
        tabIndex={0}
        style={{
          flex: 'none',
          cursor: 'pointer',
          display: 'inline-block',
          verticalAlign: 'middle',
          fontSize: 24,
          marginRight: 10,
        }}
      >
        {emo}
      </span>
      <div
        style={{
          flex: '1 1 auto',
        }}
      >
        <TitleInput />
      </div>
      {anchorEl ? (
        <Popover
          open
          anchorEl={anchorEl}
          onClose={handleCloseEmojiPicker}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <EmojiPicker
            onEmojiClick={(emoji) => {
              handleModifyLinkStatus(emoji.emoji);
            }}
          />
        </Popover>
      ) : undefined}
    </div>
  );
}
