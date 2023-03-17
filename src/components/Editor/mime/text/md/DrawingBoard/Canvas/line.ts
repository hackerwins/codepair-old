import { Color } from 'features/boardSlices';
import fitCurve from 'fit-curve';
import { Line, Point, EraserLine } from 'features/docSlices';

type CanvasLine = Pick<Line, 'type' | 'points' | 'color'>;

type CanvasEraser = Pick<EraserLine, 'type' | 'points'>;

/**
 * Create the basic object of the line with point.
 */
export function createLine(point: Point, color: Color): Line {
  return {
    type: 'line',
    color,
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
 * drawTrace draws a trace of the line
 */
export function drawTrace(context: CanvasRenderingContext2D, line: CanvasLine) {
  const { points, color } = line;
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.stroke();
}

/**
 * drawLine draws a line with bezier curves.
 */
export function drawLine(context: CanvasRenderingContext2D, line: CanvasLine) {
  let points: number[][] = [];
  for (const p of line.points) {
    points.push([p.x, p.y]);
  }

  if (points.length <= 100) {
    points = points
      .map((p, index) => {
        if (index > 0) {
          const prevP = points[index - 1];
          const currentP = p;

          // how to create 10 points between two points
          const diffX = (currentP[0] - prevP[0]) / 10;
          const diffY = (currentP[1] - prevP[1]) / 10;

          const newPoints = [];
          for (let i = 1; i < 10; i += 1) {
            newPoints.push([prevP[0] + diffX * i, prevP[1] + diffY * i]);
          }

          return newPoints;
        }

        return [];
      })
      .flat();
  }

  const curves = fitCurve(points, 3);
  if (!curves.length) {
    return;
  }

  context.save();
  context.beginPath();
  context.strokeStyle = line.color || '#ff7043';

  const firstCurve = curves[0];
  context.moveTo(firstCurve[0][0], firstCurve[0][1]);

  for (const curve of curves) {
    context.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]);
  }

  context.stroke();
  context.closePath();
  context.restore();
}

/**
 * drawEraser draws the line of the eraser on the canvas.
 */
export function drawEraser(context: CanvasRenderingContext2D, line: CanvasEraser) {
  context.save();
  context.beginPath();

  context.strokeStyle = '#ff7043';

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
