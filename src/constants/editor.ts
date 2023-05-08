export const NAVBAR_HEIGHT = 90;

export enum MimeType {
  MARKDOWN = 'text/markdown',
  MILKDOWN = 'text/milkdown',
  PLAIN = 'text/plain',
  WHITEBOARD = 'application/vnd.pairy.whiteboard',
  CELL = 'application/cell',
  JSON = 'application/json',
}

export type MetaInfo = {
  showlinenumbers?: boolean;
  showinlinelinenumbers?: boolean;
  highlight?: {
    [key: string]: boolean;
  };
};
