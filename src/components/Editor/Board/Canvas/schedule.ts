import { Point } from './Shape';

export type Task = Point;

const INTERVAL_TIME = 50;
let tasks: Array<Task> = [];
let timeout: ReturnType<typeof setTimeout>;
let work: Function | undefined;

const doWork = () => {
  if (typeof work === 'function') {
    work(tasks);
    tasks = [];
  }
};

function requestHostCallback(isDone: Boolean) {
  if (isDone) {
    doWork();
    return;
  }

  timeout = setTimeout(() => {
    doWork();
    requestHostCallback(false);
  }, INTERVAL_TIME);
}

export function reserveTask(task: Task, _work: Function) {
  tasks.push(task);

  if (work === undefined) {
    work = _work;
    requestHostCallback(false);
  }
}

export function requestHostWorkFlush() {
  clearTimeout(timeout);

  if (typeof work === 'function') {
    requestHostCallback(true);
  }
  work = undefined;
}
