import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { LineOption, createLine } from '../line';
import Worker from './Worker';
import Board from '../Board';
import { compressPoints } from '../utils';
import * as scheduler from '../scheduler';

class LineWorker extends Worker {
  type = ToolType.Line;

  update: Function;

  board: Board;

  private createID?: TimeTicket;

  constructor(update: Function, board: Board) {
    super();
    this.update = update;
    this.board = board;
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

  mousemove(point: Point) {
    scheduler.reserveTask(point, (tasks: Array<scheduler.Task>) => {
      const points = compressPoints(tasks);

      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        const lastShape = this.getElementByID(root, this.createID!);
        if (!lastShape) {
          return;
        }

        lastShape.points.push(...points);
        this.board.drawAll(root.shapes);
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

      const shape = this.getElementByID(root, this.createID!);
      if (!shape) {
        return;
      }

      // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
      if (shape.points.length < 2) {
        this.deleteByID(root, this.createID!);
      }

      this.board.drawAll(root.shapes);
    });
  }
}

export default LineWorker;
