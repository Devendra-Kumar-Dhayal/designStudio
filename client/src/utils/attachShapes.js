import { fixedWidth } from "./constants";

export const attachLineToShape = (shape, line, start) => {
  const { x1, y1, x2, y2 } = shape;
  const { x1: lx1, y1: ly1, x2: lx2, y2: ly2 } = line;
  // Calculate the x3, y3 based on the 'start' parameter
  const shapeCenterX = (x1 + x2) / 2;
  const shapeCenterY = (y1 + y2) / 2;
  const x3 = start ? lx2 : lx1;
  const y3 = start ? ly2 : ly1;

  // Calculate the slope of the line
  const m = (shapeCenterY - y3) / (shapeCenterX - x3);

  // Calculate the y-intercept of the line
  const c = y3 - m * x3;
  // Check if the line is vertical
  if (!isFinite(m)) {
    // Vertical line case (x = constant)
    const x = x3;
    const y = y3 - y1 < y3 - y2 ? y3 - y1 : y3 - y2;
    return { x, y };
  }
  if (m === 0) {
    const x = x3 - x1 < x3 - x2 ? x3 - x1 : x3 - x2;
    const y = y3;
    return { x, y };
  }

  let intersectionPoints = [];

  // Top side
  let x = (y1 - c) / m;
  if (x >= x1 && x <= x2) {
    intersectionPoints.push({ x, y: y1 });
  }

  // Bottom side
  x = (y2 - c) / m;
  if (x >= x1 && x <= x2) {
    intersectionPoints.push({ x, y: y2 });
  }

  // Left side
  let y = m * x1 + c;
  if (y >= y1 && y <= y2) {
    intersectionPoints.push({ x: x1, y });
  }

  // Right side
  y = m * x2 + c;
  if (y >= y1 && y <= y2) {
    intersectionPoints.push({ x: x2, y });
  }

  // Find the closest intersection point to the external point
  let closestIntersection = null;
  let closestDistance = Infinity;

  intersectionPoints.forEach((point) => {
    const distance = Math.sqrt((point.x - x3) ** 2 + (point.y - y3) ** 2);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIntersection = point;
    }
  });

  return closestIntersection;

  // Calculate intersection point with the line segment

  // Return null if there is no intersection within the line segment
  // return { x: intersectionX, y: intersectionY };
};

export const attachLineToShapeCircle = (shape, line, start) => {
  const { x1, y1, x2, y2 } = shape; // Circle's coordinates
  const { x1: lx1, y1: ly1, x2: lx2, y2: ly2 } = line;

  // Calculate the circle's center coordinates

  // Calculate the other end of the line coordinates
  const x3 = start ? lx2 : lx1;
  const y3 = start ? ly2 : ly1;

  // Calculate the slope of the line passing through the circle's center and the other end of the line
  let distance = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2));

  // Calculate unit vector along the line
  let unitVector = [(x3 - x1) / distance, (y3 - y1) / distance];

  // Calculate point on the circle
  let intersectionX = x1 + (fixedWidth / 2) * unitVector[0];
  let intersectionY = y1 + (fixedWidth / 2) * unitVector[1];

  return { x: intersectionX, y: intersectionY };
};
