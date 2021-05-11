import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Line } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { LineOption, createLine } from '../line';
import Worker from './Worker';
import { compressPoints } from '../utils';
import * as scheduler from '../scheduler';

class LineWorker implements Worker {
  type = ToolType.Line;

  private update: Function;

  private emit: Function;

  private createID?: TimeTicket;

  constructor(update: Function, emit: Function) {
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

    this.createID = timeTicket!;
  }

  mousemove(p: Point) {
    scheduler.reserveTask(p, (tasks: Array<scheduler.Task>) => {
      const points = compressPoints(tasks);

      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        const lastShape = root.shapes.getElementByID(this.createID!) as Line;
        lastShape.points.push(...points);
        this.emit('renderAll', root.shapes);
      });
    });
  }

  mouseup() {
    this.flushTask();
  }

  flushTask() {
    scheduler.flushTask();

    this.update((root: Root) => {
      if (!this.createID) {
        return;
      }

      const shape = root.shapes.getElementByID(this.createID);
      // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
      if (shape.points.length < 2) {
        root.shapes.deleteByID(this.createID!);
      }

      this.emit('renderAll', root.shapes);
    });
  }
}

export default LineWorker;
