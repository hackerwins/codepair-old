import { Tool } from 'features/boardSlices';

import { Root, Point, Line, TimeTicket } from './Shape';
import { compressPoints, checkLineIntersection } from './utils';
import { createLine, createEraserLine, fixEraserPoint } from './line';
import * as schedule from './schedule';

export default class Worker {
  update: Function;

  constructor(update: Function) {
    this.update = update;
  }

  /**
   * Check if the work is to be recorded
   */
  isRecordWork(tool: Tool) {
    if (tool === Tool.Line || tool === Tool.Eraser) {
      return true;
    }
    return false;
  }

  /**
   * Create shape according to tool
   */
  createShape(tool: Tool, point: Point): TimeTicket {
    let createId;

    this.update((root: Root) => {
      if (tool === Tool.Line) {
        const shape = createLine(point);
        root.shapes.push(shape);
      } else if (tool === Tool.Eraser) {
        const shape = createEraserLine(point);
        root.shapes.push(shape);
      }

      const lastShape = root.shapes.getLast();
      createId = lastShape.getID();
    });

    return createId;
  }

  /**
   * Task execution by scheduler
   */
  executeTask(createId: TimeTicket, tool: Tool, callback: Function) {
    schedule.requestHostCallback((tasks) => {
      this.update((root: Root) => {
        if (tool === Tool.Line) {
          const points = compressPoints(tasks.map((task) => task.point));
          const lastShape = root.shapes.getElementByID(createId) as Line;

          lastShape.points.push(...points);
          callback(root.shapes);
        } else if (tool === Tool.Eraser) {
          if (tasks.length < 2) {
            return;
          }

          const points = compressPoints(tasks.map((task) => task.point));
          const pointStart = fixEraserPoint(points[0]);
          const pointEnd = fixEraserPoint(points[points.length - 1]);
          const lastShape = root.shapes.getElementByID(createId) as Line;

          const findAndRemoveShape = (point1: Point, point2: Point) => {
            for (const shape of root.shapes) {
              for (let i = 1; i < shape.points.length; i += 1) {
                const result = checkLineIntersection(point1, point2, shape.points[i - 1], shape.points[i]);
                if (result.onLine1 && result.onLine2) {
                  root.shapes.deleteByID(shape.getID());
                  break;
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
        }
      });
    });
  }

  /**
   * Schedule the task to be executed in the scheduler
   */
  reserveTask(task: schedule.Task) {
    schedule.reserveTask(task);
  }

  /**
   * Flush existing tasks in the scheduler
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
