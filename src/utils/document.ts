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

export function createDocumentKey() {
  return Math.random().toString(36).substring(7);
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

export function createRandomColor() {
  return materialColors[Math.floor(Math.random() * materialColors.length)];
}
