import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Rect } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { createRect, adjustRectBox } from '../rect';
import Worker from './Worker';
import * as scheduler from '../scheduler';

class RectWorker extends Worker {
  type = ToolType.Rect;

  update: Function;

  emit: Function;

  private createID?: TimeTicket;

  constructor(update: Function, emit: Function) {
    super();
    this.update = update;
    this.emit = emit;
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
