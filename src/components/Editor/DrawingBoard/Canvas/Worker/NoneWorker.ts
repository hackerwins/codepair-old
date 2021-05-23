import { ToolType } from 'features/boardSlices';
import Worker from './Worker';

class NoneWorker extends Worker {
  type = ToolType.None;

  update: Function;

  emit: Function;

  constructor(update: Function, emit: Function) {
    super();
    this.update = update;
    this.emit = emit;
  }

  mousedown() {}

  mousemove() {}

  mouseup() {}

  destroy() {}

  flushTask() {}
}

export default NoneWorker;
