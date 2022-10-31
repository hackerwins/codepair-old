import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Line } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import Board from 'components/Editor/DrawingBoard/Canvas/Board';
import { createLine } from '../line';
import Worker, { MouseMoveCallback, MouseUpCallback, Options } from './Worker';
import { compressPoints } from '../utils';
// import * as scheduler from '../scheduler';

class LineWorker extends Worker {
  type = ToolType.Line;

  update: Function;

  board: Board;

  private createID?: TimeTicket;

  private previewLine: Omit<Line, 'getID'>;

  constructor(update: Function, board: Board, options: Options) {
    super(options);
    this.update = update;
    this.board = board;
    this.previewLine = {
      type: 'line',
      color: this.options!.color,
      points: [],
    };
  }

  mousedown(point: Point): void {
    // let timeTicket: TimeTicket;

    this.previewLine = createLine(point, this.options?.color!);
    // this.update((root: Root) => {
    //   const shape = createLine(point, this.options?.color!);
    //   root.shapes.push(shape);

    //   const lastShape = root.shapes.getLast();
    //   timeTicket = lastShape.getID();
    // });

    // this.createID = timeTicket!;
  }

  mousemove(point: Point, callback: MouseMoveCallback) {
    this.previewLine.points.push(point);
    callback({ line: { ...this.previewLine } });
    // scheduler.reserveTask(point, (tasks: Array<scheduler.Task>) => {
    //   const points = compressPoints(tasks);

    //   if (tasks.length < 2) {
    //     return;
    //   }

    //   this.update((root: Root) => {
    //     const lastShape = this.getElementByID(root, this.createID!);
    //     if (!lastShape) {
    //       return;
    //     }

    //     lastShape.points.push(...points);
    //     this.board.drawAll(root.shapes);
    //   });
    // });
  }

  mouseup(callback: MouseUpCallback) {
    this.flushTask();
    this.previewLine = { ...this.previewLine, points: [] };
    callback({});
  }

  flushTask() {
    // scheduler.flushTask();
    if (this.previewLine.points.length > 0) {
      this.update((root: Root) => {
        this.previewLine.points = compressPoints(this.previewLine.points);
        root.shapes.push(this.previewLine as Line);

        const lastShape = root.shapes.getLast();
        this.createID = lastShape.getID();
        this.board.drawAll(root.shapes);
      });
    }

    // this.update((root: Root) => {
    //   if (!this.createID) {
    //     return;
    //   }

    //   const shape = this.getElementByID(root, this.createID!);
    //   if (!shape) {
    //     return;
    //   }

    //   // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
    //   if (shape.points.length < 2) {
    //     this.deleteByID(root, this.createID!);
    //   }

    //   this.board.drawAll(root.shapes);
    // });
  }
}

export default LineWorker;
