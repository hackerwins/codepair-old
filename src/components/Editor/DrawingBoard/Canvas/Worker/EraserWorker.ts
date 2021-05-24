import { TimeTicket } from 'yorkie-js-sdk';
import { Root, Point, Box } from 'features/docSlices';
import { ToolType } from 'features/boardSlices';
import { createEraserLine, fixEraserPoint } from '../line';
import Worker from './Worker';
import { compressPoints, checkLineIntersection, isInnerBox, isSelectable } from '../utils';
import * as scheduler from '../scheduler';

class EraserWorker implements Worker {
  type = ToolType.Eraser;

  private update: Function;

  private emit: Function;

  private createID?: TimeTicket;

  private eraserBoxSize: number = 24;

  constructor(update: Function, emit: Function) {
    this.update = update;
    this.emit = emit;
  }

  mousedown(point: Point): void {
    let timeTicket: TimeTicket;

    this.update((root: Root) => {
      const shape = createEraserLine(point);
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
        const pointStart = fixEraserPoint(points[0]);
        const pointEnd = fixEraserPoint(points[points.length - 1]);
        const lastShape = root.shapes.getElementByID(this.createID!);

        const findAndRemoveShape = (point1: Point, point2: Point) => {
          for (const shape of root.shapes) {
            if (shape.type === 'eraser') {
              continue;
            }

            if (isSelectable(shape)) {
              if (isInnerBox(shape.box, point2)) {
                root.shapes.deleteByID(shape.getID());
              }
            } else {
              for (let i = 1; i < shape.points.length; i += 1) {
                const shapePoint1 = shape.points[i - 1];
                const shapePoint2 = shape.points[i];

                if (isInnerBox(this.eraserBox(point2), shapePoint2)) {
                  root.shapes.deleteByID(shape.getID());
                  break;
                }

                if (isInnerBox(this.eraserBox(point1), shapePoint2)) {
                  root.shapes.deleteByID(shape.getID());
                  break;
                }

                const result = checkLineIntersection(point1, point2, shapePoint1, shapePoint2);
                if (result.onLine1 && result.onLine2) {
                  root.shapes.deleteByID(shape.getID());
                  break;
                }
              }
            }
          }
        };

        if (lastShape.points.length > 0) {
          const lastPoint = lastShape.points[lastShape.points.length - 1];
          findAndRemoveShape(lastPoint, pointStart);
        }

        findAndRemoveShape(pointStart, pointEnd);
        lastShape.points = [pointStart, pointEnd];

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

      root.shapes.deleteByID(this.createID);
      this.emit('renderAll', root.shapes);
    });
  }

  eraserBox(point: Point): Box {
    const x = point.x - this.eraserBoxSize / 2;
    const y = point.y - this.eraserBoxSize / 2;
    const width = this.eraserBoxSize;
    const height = this.eraserBoxSize;

    return { y, x, width, height };
  }
}

export default EraserWorker;
