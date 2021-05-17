import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Rect } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { createRect, adjustRectBox } from '../rect';
import Worker from './Worker';
import * as scheduler from '../scheduler';

class RectWorker implements Worker {
  type = ToolType.Rect;

  private update: Function;

  private emit: Function;

  private createID?: TimeTicket;

  constructor(update: Function, emit: Function) {
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

    this.createID = timeTicket!;
  }

  mousemove(p: Point) {
    scheduler.reserveTask(p, (tasks: Array<scheduler.Task>) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        const point = tasks[tasks.length - 1];
        const lastShape = root.shapes.getElementByID(this.createID!) as Rect;
        const box = adjustRectBox(lastShape, point);
        lastShape.box = box;

        this.emit('renderAll', root.shapes);
      });
    });
  }

  mouseup() {
    this.flushTask();
  }

  flushTask() {
    scheduler.flushTask();
  }
}

export default RectWorker;
