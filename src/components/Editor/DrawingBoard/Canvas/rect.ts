import { Rect, Point, Box } from 'features/docSlices';

import { cloneBox } from './utils';

/**
 * 'createRect' create the basic object of the rect with point.
 */
export function createRect(point: Point): Rect {
  return {
    type: 'rect',
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
export function drawRect(context: CanvasRenderingContext2D, rect: Rect) {
  /**
   * TODO(ppeeou):We have to draw the possible parts of the control area separately
   * debug
   */
  // if (rect.isEditing) {
  //   context.save();
  //   context.fillStyle = 'rgba(102,153,255,0.1)';
  //   context.fillRect(rect.box.x, rect.box.y, rect.box.width, rect.box.height);
  //   context.restore();
  // }
  context.strokeRect(rect.box.x, rect.box.y, rect.box.width, rect.box.height);
}

/**
 * 'adjustRectBox' adjust the box according to the incoming point.
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
