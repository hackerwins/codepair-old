import { TimeTicket } from 'yorkie-js-sdk';
import Board from 'components/Editor/DrawingBoard/Canvas/Board';
import { Root, Point, Rect } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { createRect, adjustRectBox } from '../rect';
import Worker from './Worker';
import * as scheduler from '../scheduler';

class RectWorker extends Worker {
  type = ToolType.Rect;

  update: Function;

  board: Board;

  private createID?: TimeTicket;

  constructor(update: Function, board: Board) {
    super();
    this.update = update;
    this.board = board;
  }

  mousedown(point: Point): void {
    let timeTicket: TimeTicket;

    this.update((root: Root) => {
      const shape = createRect(point);
      root.shapes.push(shape);

      const lastShape = root.shapes.getLast();
      timeTicket = lastShape.getID();
    });

    this.setIsEditShape(timeTicket!);
    this.createID = timeTicket!;
  }

  mousemove(point: Point) {
    scheduler.reserveTask(point, (tasks: Array<scheduler.Task>) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        const lastPoint = tasks[tasks.length - 1];
        const lastShape = root.shapes.getElementByID(this.createID!) as Rect;
        const box = adjustRectBox(lastShape, lastPoint);
        lastShape.box = box;
      });

      this.drawAll();
    });
  }

  mouseup() {
    this.flushTask();
  }

  destroy() {
    this.flushTask();
  }

  flushTask() {
    scheduler.flushTask();
    if (!this.createID) {
      return;
    }

    this.unsetIsEditShape(this.createID!);
    this.createID = undefined;
  }
}

export default RectWorker;
