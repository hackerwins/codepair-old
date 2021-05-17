import { Color } from 'features/boardSlices';
import { Line, Point, EraserLine } from 'features/docSlices';

export interface LineOption {
  color: Color;
}

/**
 * Create the basic object of the line with point.
 */
export function createLine(point: Point, options: LineOption): Line {
  return {
    type: 'line',
    color: options.color,
    points: [point],
  } as Line;
}

/**
 * Create the basic object of the line with point.
 */
export function createEraserLine(point: Point): EraserLine {
  return {
    type: 'eraser',
    points: [point],
  } as EraserLine;
}

/**
 * Draw a line on the canvas.
 */
export function drawLine(context: CanvasRenderingContext2D, line: Line | EraserLine) {
  context.save();
  context.beginPath();

  context.strokeStyle =
    line.type === 'eraser'
      ? '#ff7043' // eraser color
      : line.color;

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
  context.closePath();
  context.restore();
}

/**
 * Match the mouse point position for eraser
 */
export function fixEraserPoint(point: Point) {
  const eraserOffsetXSize = 8;
  const eraserOffsetYSize = 6;
  return {
    y: point.y + eraserOffsetXSize,
    x: point.x + eraserOffsetYSize,
  };
}
