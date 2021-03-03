// TODO(ppeeou) refer to yorkie-sdk-js TimeTicket
export type TimeTicket = any;

export type Point = {
  y: number;
  x: number;
};

/**
 * The box has the information surrounding the shape.
 */
export interface Box {
  y: number;
  x: number;
  width: number;
  height: number;
}

// TODO(ppeeou) refer to yorkie-sdk-js ArrayProxy
export interface BaseShape {
  box: Box;
  getID(): TimeTicket;
}

export interface Line extends BaseShape {
  type: 'line';
  points: Array<Point>;
}

export type Shape = Line;

// TODO(ppeeou) refer to yorkie-sdk-js ArrayProxy
export interface Shapes {
  push(shape: Shape): number;

  getLast(): Shape;
  getElementByID(createdAt: TimeTicket): Shape;
  length: number;
  [index: number]: Shape;
  [Symbol.iterator](): IterableIterator<Shape>;
}

//  TODO(ppeeou) refer to yorkie-sdk-js JSONObject
export interface Root {
  shapes: Shapes;
}
