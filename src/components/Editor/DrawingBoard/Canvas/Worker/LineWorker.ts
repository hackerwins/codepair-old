import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Line } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { LineOption, createLine } from '../line';
import Worker from './Worker';
import { compressPoints } from '../utils';
import * as scheduler from '../scheduler';

class LineWorker extends Worker {
  type = ToolType.Line;

  update: Function;

  emit: Function;

  private createID?: TimeTicket;

  constructor(update: Function, emit: Function) {
    super();
    this.update = update;
    this.emit = emit;
  }

  mousedown(point: Point, options: LineOption): void {
    let timeTicket: TimeTicket;

    this.update((root: Root) => {
      const shape = createLine(point, options);
      root.shapes.push(shape);

      const lastShape = root.shapes.getLast();
      timeTicket = lastShape.getID();
    });

    this.setIsEditShape(timeTicket!);
    this.createID = timeTicket!;
  }

  mousemove(point: Point) {
    scheduler.reserveTask(point, (tasks: Array<scheduler.Task>) => {
      const points = compressPoints(tasks);

      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        const lastShape = root.shapes.getElementByID(this.createID!) as Line;
        lastShape.points.push(...points);
      });

      this.drawAll();
    });
  }

  mouseup() {
    this.flushTask();
  }

  flushTask() {
    scheduler.flushTask();

    if (!this.createID) {
      return;
    }

    this.unsetIsEditShape(this.createID!);
    this.update((root: Root) => {
      const shape = root.shapes.getElementByID(this.createID!);

      // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
      if (shape.points.length < 2) {
        this.deleteShapeByID(this.createID!);
      }
    });

    this.drawAll();
    this.createID = undefined;
  }

  destroy() {
    this.flushTask();
  }
}

export default LineWorker;
