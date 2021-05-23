import { TimeTicket } from 'yorkie-js-sdk';
import Board from 'components/Editor/DrawingBoard/Canvas/Board';
import { Root, Point, Shape } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { createEraserLine, fixEraserPoint } from '../line';
import Worker from './Worker';
import { compressPoints, checkLineIntersection, isInnerBox, isSelectable } from '../utils';
import * as scheduler from '../scheduler';

class EraserWorker extends Worker {
  type = ToolType.Eraser;

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
      const shape = createEraserLine(point);
      root.shapes.push(shape);

      const lastShape = root.shapes.getLast();
      timeTicket = lastShape.getID();
    });

    this.setIsEditShape(timeTicket!);
    this.createID = timeTicket!;
  }

  mousemove(p: Point) {
    scheduler.reserveTask(p, (tasks: Array<scheduler.Task>) => {
      const points = compressPoints(tasks);

      if (tasks.length < 2) {
        return;
      }

      const shapes: Array<Shape> = [];
      this.update((root: Root) => {
        const pointStart = fixEraserPoint(points[0]);
        const pointEnd = fixEraserPoint(points[points.length - 1]);
        const lastShape = root.shapes.getElementByID(this.createID!);

        const findShape = (point1: Point, point2: Point) => {
          for (const shape of root.shapes) {
            if (isSelectable(shape)) {
              if (isInnerBox(shape.box, point2)) {
                shapes.push(shape);
              }
            } else {
              for (let i = 1; i < shape.points.length; i += 1) {
                const result = checkLineIntersection(point1, point2, shape.points[i - 1], shape.points[i]);
                if (result.onLine1 && result.onLine2) {
                  shapes.push(shape);
                  break;
                }
              }
            }
          }
        };

        if (lastShape.points.length > 0) {
          const lastPoint = lastShape.points[lastShape.points.length - 1];
          findShape(lastPoint, pointStart);
        }

        findShape(pointStart, pointEnd);
        lastShape.points = [pointStart, pointEnd];
      });

      shapes.forEach((shape) => this.deleteShapeByID(shape.getID()));
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
    this.deleteShapeByID(this.createID!);
    this.drawAll();

    this.createID = undefined;
  }

  destroy() {
    this.flushTask();
  }
}

export default EraserWorker;
