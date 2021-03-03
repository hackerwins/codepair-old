import { Line, Point, Box } from './Shape';
import { cloneBox } from './utils';

/**
 * Create the basic object of the line with point.
 */
export function createLine(point: Point): Line {
  return {
    type: 'line',
    points: [point],
    box: {
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    },
  } as Line;
}

/**
 * Draw a line on the canvas.
 */
export function drawLine(context: CanvasRenderingContext2D, line: Line) {
  context.beginPath();

  let isMoved = false;
  for (const p of line.points) {
    if (isMoved === false) {
      isMoved = true;
      context.moveTo(p.x, p.y);
    } else {
      context.lineTo(p.x, p.y);
    }
  }
  context.stroke();
}

/**
 * Create a box that wraps all of points
 */
export function adjustLineBox(shape: Line, points: Array<Point>): Box {
  const box = cloneBox(shape.box);

  for (const point of points) {
    if (point.y < box.y) {
      box.height = box.height + box.y - point.y;
      box.y = point.y;
    } else if (point.y > box.y + box.height) {
      box.height = point.y - box.y;
    }
    if (point.x < box.x) {
      box.width = box.width + box.x - point.x;
      box.x = point.x;
    } else if (point.x > box.x + box.width) {
      box.width = point.x - box.x;
    }
  }
  return box;
}
