import { TimeTicket } from 'yorkie-js-sdk';
import { ToolType } from 'features/boardSlices';
import { Root, Shape, Point } from 'features/docSlices';
import { LineOption } from '../line';

type Options = LineOption;

export type BoardMetadata = {
  eraserPoints?: Point[];
};

export type MouseDownCallback = (boardMetadata: BoardMetadata) => void;

export type MouseMoveCallback = (boardMetadata: BoardMetadata) => void;

abstract class Worker {
  constructor(options?: Options) {
    this.options = options;
  }

  options?: Options;

  abstract type: ToolType;

  abstract update: Function;

  abstract mousedown(point: Point, callback?: MouseDownCallback): void;

  abstract mousemove(point: Point, callback?: MouseMoveCallback): void;

  abstract mouseup(): void;

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
