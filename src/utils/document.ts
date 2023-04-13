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

const materialFontColors = [
  'black',
  'white',
  'white',
  'white',
  'black',
  'white',
  'white',
  'white',
  'white',
  'white',
  'black',
  'black',
  'black',
  'black',
  'white',
  'white',
  'white',
  'white',
];

export function createRandomColor() {
  const index = Math.floor(Math.random() * materialColors.length);
  return {
    background: materialColors[index],
    font: materialFontColors[index],
  };
}

export function findColor(color: string) {
  const index = materialColors.findIndex((c) => c === color);
  return {
    background: materialColors[index],
    font: materialFontColors[index],
  };
}

export function getMaterialColor(index: number) {
  return materialColors[index];
}

export function getMaterialFontColor(index: number) {
  return materialFontColors[index];
}

export function isDateWorkspace(workspace: string) {
  return (
    workspace === 'calendar' || workspace === 'last day' || workspace === 'last week' || workspace === 'last month'
  );
}

export function getDateUnit(workspace: string) {
  if (workspace === 'last day') return 'HH:mm';
  if (workspace === 'last week') return 'YYYY-MM-DD HH:mm';
  if (workspace === 'last month') return 'YYYY-MM-DD HH:mm';
  return 'HH:mm';
}
