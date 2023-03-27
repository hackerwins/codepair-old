import { Point } from 'features/docSlices';

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

function requestTask(isDone: Boolean) {
  if (isDone) {
    doWork();
    return;
  }

  timeout = setTimeout(() => {
    doWork();
    requestTask(false);
  }, INTERVAL_TIME);
}

export function reserveTask(task: Task, _work: Function) {
  tasks.push(task);

  if (work === undefined) {
    work = _work;
    requestTask(false);
  }
}

export function flushTask() {
  clearTimeout(timeout);

  if (typeof work === 'function') {
    requestTask(true);
  }
  work = undefined;
}
