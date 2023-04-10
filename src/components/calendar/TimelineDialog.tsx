import React, { useEffect, useState } from 'react';
import { LinkListItem, toFlatPageLinksSelector } from 'features/linkSlices';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { addSchedule } from 'features/calendarSlices';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';
import {
  pink,
  purple,
  red,
  teal,
  lightBlue,
  lightGreen,
  lime,
  orange,
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
} from '@mui/material/colors';
import Check from '@mui/icons-material/Check';
import EmojiPicker from 'emoji-picker-react';

export interface TimelineDialogProps {
  open: boolean;
  selectedDateTime: string;
  handleClose: () => void;
  name?: string;
  color?: string;
  id?: string;
  emoji?: string;
}

const materialColors = [
  amber[500],
  blue[500],
  blueGrey[500],
  brown[500],
  cyan[500],
  deepOrange[500],
  deepPurple[500],
  green[500],
  grey[500],
  indigo[500],
  lightBlue[500],
  lightGreen[500],
  lime[500],
  orange[500],
  pink[500],
  purple[500],
  red[500],
  teal[500],
];

export function TimelineDialog({ open, selectedDateTime, handleClose, color, name, emoji }: TimelineDialogProps) {
  const dispatch = useDispatch();
  const [currentSelectedTime, setCurrentSelectedTime] = useState(selectedDateTime);
  const pageList = useSelector(toFlatPageLinksSelector);
  const [pendingValue, setPendingValue] = useState<LinkListItem | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>(emoji || '📅');
  const [currentName, setCurrentName] = useState<string | undefined>(name);
  const [currentColor, setCurrentColor] = useState<string | undefined>(color || blue[500]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleEmojiClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = () => {
    if (pendingValue) {
      dispatch(
        addSchedule({
          date: currentSelectedTime,
          name: `${currentName}`,
          color: `${currentColor}`,
          emoji: `${currentEmoji}`,
          item: {
            name: pendingValue.name,
            fileLink: pendingValue.fileLink,
          },
        }),
      );
      handleClose();
    } else {
      window.alert('Please select a page');
    }
  };

  useEffect(() => {
    setCurrentSelectedTime(selectedDateTime);
  }, [selectedDateTime]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Date:{' '}
        <Typography
          variant="h6"
          component="span"
          style={{
            color: 'GrayText',
          }}
        >
          {dayjs(selectedDateTime, 'YYYYMMDDHHmm').format('YY.MM.DD')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div>&nbsp;</div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {materialColors.map((mc) => {
            return (
              <span
                key={mc}
                onClick={() => setCurrentColor(mc)}
                role="button"
                tabIndex={0}
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  backgroundColor: mc,
                  color: 'white',
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  border: mc === currentColor ? '1px solid white' : 'none',
                }}
              >
                {mc === currentColor ? <Check /> : null}
              </span>
            );
          })}
        </div>
        <div>&nbsp;</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span>
            <Button
              onClick={handleEmojiClick}
              style={{
                fontSize: 50,
                lineHeight: 1,
              }}
            >
              {currentEmoji}
            </Button>
            {anchorEl ? (
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                elevation={2}
                onClose={handleEmojiClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <EmojiPicker
                  previewConfig={{
                    defaultEmoji: `${currentEmoji}`,
                    showPreview: false,
                  }}
                  onEmojiClick={(e) => {
                    setCurrentEmoji(e.emoji);
                    setAnchorEl(null);
                  }}
                />
              </Popover>
            ) : undefined}
          </span>
          <TextField
            value={name}
            onInput={(e) => setCurrentName((e.target as HTMLInputElement).value)}
            variant="standard"
            label="Schedule name"
            placeholder="Type schedule name"
            fullWidth
          />
        </div>

        <div>&nbsp;</div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticTimePicker
            orientation="landscape"
            value={dayjs(currentSelectedTime, 'YYYYMMDDHHmm')}
            onChange={(v) => {
              setCurrentSelectedTime(`${v?.format('YYYYMMDDHHmm')}`);
            }}
            slots={{
              actionBar: () => null,
            }}
          />
        </LocalizationProvider>
        <DialogContentText>&nbsp;</DialogContentText>
        <Autocomplete
          id="size-small-standard"
          size="small"
          options={pageList}
          getOptionLabel={(option) => `${option.name} - ${option.fileLink}`}
          onChange={(event, newValue, reason) => {
            if (
              event.type === 'keydown' &&
              (event as React.KeyboardEvent).key === 'Backspace' &&
              reason === 'removeOption'
            ) {
              return;
            }

            setPendingValue(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props}>
              <Typography
                style={{
                  paddingLeft: (option.depth - 1) * 10,
                }}
              >
                {option.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                &nbsp;{option.fileLink}
              </Typography>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Target pages"
              placeholder="search pages"
              helperText="Type keywords"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
