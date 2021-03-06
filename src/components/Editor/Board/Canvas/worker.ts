import { Tool } from 'features/boardSlices';

import { Root, Point, Line, TimeTicket } from './Shape';
import { compressPoints } from './utils';
import { createLine } from './line';
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
    if (tool === Tool.Line) {
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
  flushTask() {
    schedule.requestHostWorkFlush();
  }
}
