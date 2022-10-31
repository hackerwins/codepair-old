import { TimeTicket } from 'yorkie-js-sdk';
import { ToolType, Color } from 'features/boardSlices';
import { Root, Shape, Point, Line, Rect } from 'features/docSlices';

export type Options = { color: Color };

export type BoardPresence = {
  eraserPoints?: Point[];
  line?: Omit<Line, 'getID'>;
  rect?: Omit<Rect, 'getID'>;
};

export type MouseDownCallback = (boardPresence: BoardPresence) => void;

export type MouseMoveCallback = (boardPresence: BoardPresence) => void;

export type MouseUpCallback = (boardPresence: BoardPresence) => void;

export type MouseUpCallback = (boardMetadata: BoardMetadata) => void;

abstract class Worker {
  constructor(options?: Options) {
    this.options = options;
  }

  options?: Options;

  abstract type: ToolType;

  abstract update: Function;

  abstract mousedown(point: Point, callback?: MouseDownCallback): void;

  abstract mousemove(point: Point, callback?: MouseMoveCallback): void;

  abstract mouseup(callback?: MouseUpCallback): void;

  abstract flushTask(): void;

  getElementByID(root: Root, createID: TimeTicket): Shape | undefined {
    return root.shapes.getElementByID(createID);
  }

  deleteByID(root: Root, createID: TimeTicket): Shape | undefined {
    return root.shapes.deleteByID(createID);
  }

  clearAll() {
    this.update((root: Root) => {
      for (const shape of root.shapes) {
        this.deleteByID(root, shape.getID());
      }
    });
  }

  setOption(options: Options) {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export default Worker;
