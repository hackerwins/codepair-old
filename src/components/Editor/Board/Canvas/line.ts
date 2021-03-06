import { Line, Point } from './Shape';

/**
 * Create the basic object of the line with point.
 */
export function createLine(point: Point): Line {
  return {
    type: 'line',
    points: [point],
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
