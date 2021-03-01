import { Point } from './Shape';

export type Task = {
  point: Point;
};

const INTERVAL_TIME = 50;
let tasks: Array<Task> = [];
let intervalId: number;
let work: Function | undefined;

export function requestHostCallback(callback: (tasks: Array<Task>) => void) {
  work = () => {
    if (tasks.length > 0) {
      callback(tasks);
      tasks = [];
    }
  };

  intervalId = setInterval(work, INTERVAL_TIME);
}

export function reserveTask(task: Task) {
  tasks.push(task);
}

export function requestHostWorkFlush() {
  clearInterval(intervalId);

  if (typeof work === 'function') {
    work();
  }
  work = undefined;
}
