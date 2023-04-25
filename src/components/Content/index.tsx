import React, { ReactNode, useEffect, useState } from 'react';
import { Popover, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { findCurrentPageLink, setLinkEmoji, setLinkName } from 'features/linkSlices';
import { makeStyles } from 'styles/common';
import EmojiPicker from 'emoji-picker-react';
import { Theme } from 'features/settingSlices';
import ShareButton from 'components/NavBar/ShareButton';
import { SubPageButton } from 'components/NavBar/SubPageButton';

interface ContentViewProps {
  children: ReactNode;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
  },
  titleInput: {
    width: 500,
    '& .MuiInputBase-root': {
      fontSize: '1.8rem',
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
  body: {
    padding: 0,
    height: 'calc(100vh - 180px)',
    borderTop: theme.palette.mode === Theme.Dark ? '1px solid #333333' : '1px solid #e8e8e8',
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

export function ContentView({ children }: ContentViewProps) {
  const dispatch = useDispatch();
  const currentItem = useSelector(findCurrentPageLink);
  const { classes } = useStyles();
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
    <div className={classes.root}>
      <h1
        style={{
          display: 'flex',
          marginTop: 0,
          marginBottom: 0,
          padding: '0px 20px',
          alignItems: 'center',
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
            fontSize: 36,
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

        <div
          style={{
            flex: 'none',
            // width: 400,
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 10,
          }}
        >
          <SubPageButton />
          <ShareButton />
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
      </h1>
      <div className={classes.body}>{children}</div>
    </div>
  );
}
