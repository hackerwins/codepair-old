import { Point } from './Shape';

/**
 * square distance between 2 points
 */
function getSqDist(p1: Point, p2: Point) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return dx * dx + dy * dy;
}

/**
 * square distance from a point to a segment
 */
function getSqSegDist(p: Point, p1: Point, p2: Point) {
  let { x, y } = p1;
  let dx = p2.x - x;
  let dy = p2.y - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2.x;
      y = p2.y;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p.x - x;
  dy = p.y - y;
  return dx * dx + dy * dy;
}

function douglasPeuckerStep(
  points: Array<Point>,
  first: number,
  last: number,
  tolerance: number,
  simplified: Array<Point>,
) {
  let maxDist = tolerance;
  let index = 0;

  for (let i = first + 1; i < last; i += 1) {
    const dist = getSqSegDist(points[i], points[first], points[last]);

    if (dist > maxDist) {
      index = i;
      maxDist = dist;
    }
  }

  if (maxDist > tolerance) {
    if (first + 1 < index) {
      douglasPeuckerStep(points, first, index, tolerance, simplified);
    }
    simplified.push(points[index]);
    if (index + 1 < last) {
      douglasPeuckerStep(points, index, last, tolerance, simplified);
    }
  }
}

function douglasPeucker(points: Array<Point>, tolerance: number): Array<Point> {
  const first = 0;
  const last = points.length - 1;
  const simplified = [];

  simplified.push(points[first]);
  douglasPeuckerStep(points, first, last, tolerance, simplified);
  simplified.push(points[last]);

  return simplified;
}

function simplifyRadialDist(points: Array<Point>, tolerance: number) {
  let point = points[0];
  let prevPoint = point;
  const simplified = [prevPoint];

  for (let i = 1, len = points.length; i < len; i += 1) {
    point = points[i];

    if (getSqDist(point, prevPoint) > tolerance) {
      simplified.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) {
    simplified.push(point);
  }
  return simplified;
}

/**
 * @see {@link https://cartography-playground.gitlab.io/playgrounds/douglas-peucker-algorithm/}
 * @see {@link https://github.com/mourner/simplify-js}
 */
export function compressPoints(points: Array<Point>, tolerance: number = 10): Array<Point> {
  return douglasPeucker(simplifyRadialDist(points, tolerance), tolerance);
}
