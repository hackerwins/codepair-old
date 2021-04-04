import { TimeTicket } from 'yorkie-js-sdk';

import { Tool } from 'features/boardSlices';

import { Root, Shape, Point, Line, Rect } from './Shape';
import { compressPoints, checkLineIntersection, reverseIter, isInnerBox, cloneBox } from './utils';
import { createLine, createEraserLine, fixEraserPoint } from './line';
import { createRect, adjustRectBox } from './rect';
import * as schedule from './schedule';

interface SelectedShape {
  status: 'move';
  shape: Shape;
  point: Point; // pin
}

export default class Worker {
  private update: Function;

  private selectedShape: SelectedShape | undefined;

  constructor(update: Function) {
    this.update = update;
  }

  /**
   * Create shape according to tool.
   */
  createShape(tool: Tool, point: Point): TimeTicket {
    let timeTicket: TimeTicket;

    this.update((root: Root) => {
      if (tool === Tool.Line) {
        const shape = createLine(point);
        root.shapes.push(shape);
      } else if (tool === Tool.Eraser) {
        const shape = createEraserLine(point);
        root.shapes.push(shape);
      } else if (tool === Tool.Rect) {
        const shape = createRect(point);
        root.shapes.push(shape);
      }

      const lastShape = root.shapes.getLast();
      timeTicket = lastShape.getID();
    });

    return timeTicket!;
  }

  /**
   * Select a shape that can be controlled.
   */
  selectShape(point: Point): Shape | undefined {
    this.update((root: Root) => {
      for (const shape of reverseIter(root.shapes)) {
        if (shape?.box && isInnerBox(shape.box, point)) {
          this.selectedShape = {
            shape,
            point,
            status: 'move',
          };
          return;
        }
      }
      this.selectedShape = undefined;
    });

    return this.selectedShape?.shape;
  }

  isEmptySelectedShape() {
    return !this.selectedShape;
  }

  /**
   * Task execution by scheduler.
   */
  executeTask(createId: TimeTicket, tool: Tool, callback: Function) {
    schedule.requestHostCallback((tasks) => {
      if (tasks.length < 2) {
        return;
      }

      this.update((root: Root) => {
        if (tool === Tool.Line) {
          const points = compressPoints(tasks.map((task) => task.point));
          const lastShape = root.shapes.getElementByID(createId) as Line;

          lastShape.points.push(...points);
          callback(root.shapes);
        } else if (tool === Tool.Eraser) {
          const points = compressPoints(tasks.map((task) => task.point));
          const pointStart = fixEraserPoint(points[0]);
          const pointEnd = fixEraserPoint(points[points.length - 1]);
          const lastShape = root.shapes.getElementByID(createId);

          const findAndRemoveShape = (point1: Point, point2: Point) => {
            for (const shape of root.shapes) {
              // TODO(ppeeou) selectable shape
              if (shape.type === 'rect') {
                if (isInnerBox(shape.box, point2)) {
                  root.shapes.deleteByID(shape.getID());
                }
              } else {
                for (let i = 1; i < shape.points.length; i += 1) {
                  const result = checkLineIntersection(point1, point2, shape.points[i - 1], shape.points[i]);
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
          callback(root.shapes);
        } else if (tool === Tool.Rect) {
          const { point } = tasks[tasks.length - 1];
          const lastShape = root.shapes.getElementByID(createId) as Rect;
          const box = adjustRectBox(lastShape, point);
          lastShape.box = box;
          callback(root.shapes);
        } else if (tool === Tool.Selector) {
          if (this.isEmptySelectedShape()) {
            return;
          }

          // TODO(ppeeou) selectable shape
          const lastShape = root.shapes.getElementByID(createId) as Rect;
          const pointEnd = tasks[tasks.length - 1].point;
          const offsetY = pointEnd.y - this.selectedShape!.point.y;
          const offsetX = pointEnd.x - this.selectedShape!.point.x;
          this.selectedShape!.point = pointEnd;

          lastShape.box = {
            ...cloneBox(lastShape.box),
            y: lastShape.box.y + offsetY,
            x: lastShape.box.x + offsetX,
          };

          lastShape.points[0] = {
            y: lastShape.points[0].y + offsetY,
            x: lastShape.points[0].x + offsetX,
          };
          callback(root.shapes);
        }
      });
    });
  }

  /**
   * Schedule the task to be executed in the scheduler.
   */
  reserveTask(task: schedule.Task) {
    schedule.reserveTask(task);
  }

  /**
   * Flush existing tasks in the scheduler.
   */
  flushTask(createId: TimeTicket, tool: Tool, callback: Function) {
    schedule.requestHostWorkFlush();

    if (!createId) {
      return;
    }

    this.update((root: Root) => {
      if (tool === Tool.Line) {
        const shape = root.shapes.getElementByID(createId);
        // When erasing a line, it checks that the lines overlap, so do not save if there are two points below
        if (shape.points.length < 2) {
          root.shapes.deleteByID(createId);
          callback(root.shapes);
        }
      } else if (tool === Tool.Eraser) {
        root.shapes.deleteByID(createId);
        callback(root.shapes);
      }
    });
  }
}
