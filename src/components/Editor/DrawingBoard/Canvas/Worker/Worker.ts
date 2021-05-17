import { ToolType } from 'features/boardSlices';
import { Point } from 'features/docSlices';
import { LineOption } from '../line';

type Options = LineOption;

interface Worker {
  type: ToolType;

  mousedown: (point: Point, options: Options) => void;

  mousemove: (point: Point) => void;

  mouseup: () => void;

  flushTask: () => void;
}

export default Worker;
