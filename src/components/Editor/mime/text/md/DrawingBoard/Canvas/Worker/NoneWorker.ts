import Board from 'components/Editor/mime/text/md/DrawingBoard/Canvas/Board';
import { ToolType } from 'features/boardSlices';
import Worker from './Worker';

class NoneWorker extends Worker {
  type = ToolType.None;

  update: Function;

  board: Board;

  constructor(update: Function, board: Board) {
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
