import { Rect, Point, Box } from 'features/docSlices';
import { Color } from 'features/boardSlices';
import { cloneBox } from './utils';

export interface RectOptions {
  color: Color;
}

type CanvasRect = Pick<Rect, 'type' | 'color' | 'box'>;

/**
 * Create the basic object of the rect with point.
 */
export function createRect(point: Point, options: RectOptions): Rect {
  return {
    type: 'rect',
    color: options.color,
    box: {
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    },
    points: [{ x: point.x, y: point.y }],
  } as Rect;
}

/**
 * Draw a rect on the canvas.
 */
export function drawRect(context: CanvasRenderingContext2D, rect: CanvasRect) {
  context.save();
  context.strokeStyle = rect.color;
  context.strokeRect(rect.box.x, rect.box.y, rect.box.width, rect.box.height);
  context.restore();
}

/**
 * Adjust the box according to the incoming point.
 */
export function adjustRectBox(shape: Rect, point: Point): Box {
  const box = cloneBox(shape.box);
  const rectPoint = shape.points[0];

  const width = point.x - rectPoint.x;
  const height = point.y - rectPoint.y;
  const aWidth = Math.abs(width);
  const aHeight = Math.abs(height);

  box.x = rectPoint.x - (width > 0 ? 0 : -width);
  box.y = rectPoint.y - (height > 0 ? 0 : -height);
  box.width = aWidth;
  box.height = aHeight;

  return box;
}
