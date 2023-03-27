import Board from 'components/Editor/mime/text/md/DrawingBoard/Canvas/Board';
import { ToolType } from 'features/boardSlices';
import Worker, { UpdateCallback } from './Worker';

class NoneWorker extends Worker {
  type = ToolType.None;

  update: (callback: UpdateCallback) => void;

  board: Board;

  constructor(update: (callback: UpdateCallback) => void, board: Board) {
    super();
    this.update = update;
    this.board = board;
  }

  mousedown() {}

  mousemove() {}

  mouseup() {}

  flushTask() {}
}

export default NoneWorker;
