import { Cylinder } from "../../Geometries/3D/Cylinder";

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toVector3(): Vector3 {
    return new Vector3(this.x, this.y, 0);
  }
  public toVector2(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public signedAngle(v2: Vector2): number {
    const angle = Math.acos(this.dot(v2) / (this.magnitude() * v2.magnitude()));
    const sign = Math.sign(this.x * v2.y - this.y * v2.x);
    return sign * angle;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  static Zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  public subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  public scale(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  public dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector2(0, 0);
    }
    return new Vector2(this.x / mag, this.y / mag);
  }
  public equal(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  public distanceTo(vector: Vector2): number {
    return Math.sqrt(
      Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2)
    );
  }
}

export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public projectOnPlane(planeNormal: Vector3): Vector3 {
    const dotProduct = this.dot(planeNormal);
    return new Vector3(
      this.x - dotProduct * planeNormal.x,
      this.y - dotProduct * planeNormal.y,
      this.z - dotProduct * planeNormal.z
    );
  }

  public signedAngle(to: Vector3, axis: Vector3): number {
    const num1 = this.angleTo(to);
    const num2 = this.y * to.z - this.z * to.y;
    const num3 = this.z * to.x - this.x * to.z;
    const num4 = this.x * to.y - this.y * to.x;
    const num5 = Math.sign(axis.x * num2 + axis.y * num3 + axis.z * num4);
    return num1 * num5;
  }

  public toVector3(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
  public toVector2(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
  static Zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  applyMatrix4(matrix: number[]): Vector3 {
    const x = this.x,
      y = this.y,
      z = this.z;
    const w = 1 / (matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]);

    const nx = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) * w;
    const ny = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) * w;
    const nz =
      (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) * w;

    this.x = nx;
    this.y = ny;
    this.z = nz;

    return this;
  }

  public subtract(vector: Vector3): Vector3 {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  public scale(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public dot(vector: Vector3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  public equal(vector: Vector3, epsilon: number = 1e-6): boolean {
    return (
      Math.abs(this.x - vector.x) < epsilon &&
      Math.abs(this.y - vector.y) < epsilon &&
      Math.abs(this.z - vector.z) < epsilon
    );
  }

  public cross(vector: Vector3): Vector3 {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  public set(x: number, y: number, z: number): Vector3;
  public set(vector: Vector3): Vector3;
  public set(xOrVector: number | Vector3, y?: number, z?: number): Vector3 {
    if (xOrVector instanceof Vector3) {
      this.x = xOrVector.x;
      this.y = xOrVector.y;
      this.z = xOrVector.z;
    } else {
      this.x = xOrVector;
      this.y = y!;
      this.z = z!;
    }
    return this;
  }
  public angleTo(vector: Vector3): number {
    const dotProduct = this.dot(vector);
    const magA = this.magnitude();
    const magB = vector.magnitude();
    return Math.acos(dotProduct / (magA * magB));
  }

  public distanceTo(vector: Vector3): number {
    return Math.sqrt(
      Math.pow(this.x - vector.x, 2) +
        Math.pow(this.y - vector.y, 2) +
        Math.pow(this.z - vector.z, 2)
    );
  }

  static angle(vector1: Vector3, vector2: Vector3): number {
    const dotProduct = vector1.dot(vector2);
    const magA = vector1.magnitude();
    const magB = vector2.magnitude();
    return Math.acos(dotProduct / (magA * magB));
  }

  public normalize(): Vector3 {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector3(0, 0, 0);
    }
    return new Vector3(this.x / mag, this.y / mag, this.z / mag);
  }
  public rotateX(angle: number): Vector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3(
      this.x,
      this.y * cos - this.z * sin,
      this.y * sin + this.z * cos
    );
  }
  public rotateY(angle: number): Vector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3(
      this.x * cos + this.z * sin,
      this.y,
      -this.x * sin + this.z * cos
    );
  }
  public rotateZ(angle: number): Vector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
      this.z
    );
  }
  public rotate(Vector3: Vector3): Vector3 {
    return this.rotateX(Vector3.x).rotateY(Vector3.y).rotateZ(Vector3.z);
  }
}

/**
 * Finds the closest points between two lines in 3D space.
 * @param A1 - Start point of line A.
 * @param A2 - End point of line A.
 * @param B1 - Start point of line B.
 * @param B2 - End point of line B.
 * @returns The closest points on each line.
 */
export function FindClosestPoints(
  A1: Vector3,
  A2: Vector3,
  B1: Vector3,
  B2: Vector3
): { closestPointLineA: Vector3; closestPointLineB: Vector3 } {
  const directionA = A2.subtract(A1);
  const directionB = B2.subtract(B1);
  const crossProduct = directionA.cross(directionB);

  // Check if lines are parallel
  if (crossProduct.magnitude() < 0.01) {
    return { closestPointLineA: A1, closestPointLineB: B1 };
  }

  const lineVector = A1.subtract(B1);
  const a = directionA.dot(directionA);
  const b = directionA.dot(directionB);
  const c = directionB.dot(directionB);
  const d = directionA.dot(lineVector);
  const e = directionB.dot(lineVector);

  const denominator = a * c - b * b;

  // Calculate the parameters for the lines
  const s = (b * e - c * d) / denominator;
  const t = (a * e - b * d) / denominator;

  const closestPointLineA = A1.add(directionA.scale(s));
  const closestPointLineB = B1.add(directionB.scale(t));

  return { closestPointLineA, closestPointLineB };
}

/**
 * Computes the Euclidean distance between two 2D points.
 * @param point1 - First 2D point.
 * @param point2 - Second 2D point.
 * @returns The distance between the two points.
 */
export function Distance(point1: Vector2, point2: Vector2): number {
  return point1.distanceTo(point2);
}

/**
 * Solves a quartic equation ax⁴ + bx³ + cx² + dx + e = 0 and returns real roots.
 * @param a - Coefficient of x⁴.
 * @param b - Coefficient of x³.
 * @param c - Coefficient of x².
 * @param d - Coefficient of x.
 * @param e - Constant term.
 * @returns An array of real roots.
 */
export function quarticRoots(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number
): number[] {
  function cubeRoot(x: number): number {
    return x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
  }

  const s0 = c * c - 3 * b * d + 12 * a * e;
  const s1 =
    2 * c * c * c -
    9 * b * c * d +
    27 * b * b * e +
    27 * a * d * d -
    72 * a * c * e;
  const p = (8 * a * c - 3 * b * b) / (8 * a * a);
  const q = (b * b * b - 4 * a * b * c + 8 * a * a * d) / (8 * a * a * a);

  let Q = cubeRoot(0.5 * (s1 + Math.sqrt(s1 * s1 - 4 * s0 * s0 * s0)));
  let S: number;

  if (isNaN(Q)) {
    const phi = Math.acos(s1 / (2 * Math.sqrt(s0 * s0 * s0)));
    S =
      0.5 *
      Math.sqrt(
        (-2 / 3) * p + (2 / (3 * a)) * Math.sqrt(s0) * Math.cos(phi / 3)
      );
  } else {
    S = 0.5 * Math.sqrt(-(2 / 3) * p + (1 / (3 * a)) * (Q + s0 / Q));
  }

  const sols: number[] = [0, 0, 0, 0];
  const base = (-0.25 * b) / a;
  const sqrt1 = Math.sqrt(-4 * S * S - 2 * p + q / S);
  const sqrt2 = Math.sqrt(-4 * S * S - 2 * p - q / S);

  sols[0] = base - S + 0.5 * sqrt1;
  sols[1] = base - S - 0.5 * sqrt1;
  sols[2] = base + S + 0.5 * sqrt2;
  sols[3] = base + S - 0.5 * sqrt2;

  return sols;
}

/**
 * Solves a cubic equation of the form ax³ + bx² + cx + d = 0 using Cardano's method.
 * @param a - Coefficient of x³ (must not be zero).
 * @param b - Coefficient of x².
 * @param c - Coefficient of x.
 * @param d - Constant term.
 * @returns An array of real roots of the cubic equation.
 */
function solveCubic(a: number, b: number, c: number, d: number): number[] {
  const p = (3 * a * c - b ** 2) / (3 * a ** 2);
  const q = (2 * b ** 3 - 9 * a * b * c + 27 * a ** 2 * d) / (27 * a ** 3);
  const discriminant = q ** 2 / 4 + p ** 3 / 27;
  const roots: number[] = [];

  if (discriminant >= 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    const u = Math.cbrt(-q / 2 + sqrtDisc);
    const v = Math.cbrt(-q / 2 - sqrtDisc);
    roots.push(u + v - b / (3 * a));
  } else {
    const r = Math.sqrt((-p) ** 3 / 27);
    const phi = Math.acos(-q / (2 * r));
    const t = 2 * Math.cbrt(r);
    roots.push(t * Math.cos(phi / 3) - b / (3 * a));
    roots.push(t * Math.cos((phi + 2 * Math.PI) / 3) - b / (3 * a));
    roots.push(t * Math.cos((phi + 4 * Math.PI) / 3) - b / (3 * a));
  }

  return roots;
}

/**
 * Solves a quadratic equation of the form ax² + bx + c = 0.
 * @param a - Coefficient of x².
 * @param b - Coefficient of x.
 * @param c - Constant term.
 * @returns An array containing the two real roots, or [NaN, NaN] if roots are complex.
 */
function solveQuadratic(a: number, b: number, c: number): number[] {
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant >= 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    return [(-b + sqrtDisc) / (2 * a), (-b - sqrtDisc) / (2 * a)];
  } else {
    // Complex roots (return NaN for simplicity)
    return [NaN, NaN];
  }
}

/**
 * Solves for a root using a numerical method with constraints.
 * @param r0 - Radius in x-dimension.
 * @param r1 - Radius in y-dimension.
 * @param r2 - Radius in z-dimension.
 * @param z0 - Component of vector in x-dimension.
 * @param z1 - Component of vector in y-dimension.
 * @param z2 - Component of vector in z-dimension.
 * @param g - Initial guess or constraint variable.
 * @param maxIterations - Maximum number of iterations for convergence.
 * @returns The computed root.
 */
export function getRoot(
  r0: number,
  r1: number,
  r2: number,
  z0: number,
  z1: number,
  z2: number,
  g: number,
  maxIterations: number
): number {
  let n0 = r0 * z0;
  let n1 = r1 * z1;
  let n2 = r2 * z2;
  let t0 = z2 - 1;

  if (r0 === 1) {
    t0 = z0 - 1;
  }
  if (r1 === 1) {
    t0 = z1 - 1;
  }
  if (r2 === 1) {
    t0 = z2 - 1;
  }

  let t1: number;
  if (g < 0) {
    t1 = 0;
  } else {
    t1 = -1 + Math.sqrt(n0 * n0 + n1 * n1 + n2 * n2);
  }

  let t = 0;
  for (let i = 0; i < maxIterations; i++) {
    t = (t0 + t1) / 2;
    if (t === t0 || t === t1) {
      break;
    }
    let ratio0 = n0 / (t + r0);
    let ratio1 = n1 / (t + r1);
    let ratio2 = n2 / (t + r2);
    g = ratio0 * ratio0 + ratio1 * ratio1 + ratio2 * ratio2 - 1;
    if (g > 0) {
      t0 = t;
    } else {
      if (g < 0) {
        t1 = t;
      } else {
        break;
      }
    }
  }

  return t;
}

/**
 * Projects corners of a shape onto an axis and returns the min and max projections.
 * Used in the Separating Axis Theorem (SAT).
 * @param axis - The axis to project onto.
 * @param corners - An array of corner points (vertices) of the shape.
 * @param minAlong - Variable to store minimum projection (overwritten).
 * @param maxAlong - Variable to store maximum projection (overwritten).
 * @returns An array with the min and max projected values.
 */
export function SAT(
  axis: Vector3,
  corners: Vector3[],
  minAlong: number,
  maxAlong: number
): number[] {
  minAlong = Number.MAX_VALUE;
  maxAlong = -Number.MAX_VALUE;

  for (let i = 0; i < corners.length; i++) {
    const dotVal = axis.dot(corners[i]);
    if (dotVal < minAlong) minAlong = dotVal;
    if (dotVal > maxAlong) maxAlong = dotVal;
  }

  return [minAlong, maxAlong];
}

/**
 * Determines whether two scalar projection intervals overlap.
 * @param min1 - Minimum of the first interval.
 * @param max1 - Maximum of the first interval.
 * @param min2 - Minimum of the second interval.
 * @param max2 - Maximum of the second interval.
 * @returns True if the intervals overlap, false otherwise.
 */
export function overlaps(
  min1: number,
  max1: number,
  min2: number,
  max2: number
): boolean {
  return (
    isBetweenOrdered(min2, min1, max1) || isBetweenOrdered(min1, min2, max2)
  );
}

/**
 * Checks if a value is within the specified bounds (inclusive).
 * @param val - The value to check.
 * @param lowerBound - The lower bound.
 * @param upperBound - The upper bound.
 * @returns True if val is between lowerBound and upperBound.
 */
export function isBetweenOrdered(
  val: number,
  lowerBound: number,
  upperBound: number
): boolean {
  return lowerBound <= val && val <= upperBound;
}

/**
 * Calculates the determinant of a 3x3 matrix.
 * @param matrix - A 3x3 array of numbers.
 * @returns The determinant of the matrix.
 * @throws Error if the input is not a 3x3 matrix.
 */
export function calDetMatrix3x3(matrix: number[][]): number {
  if (matrix.length !== 3 || matrix.some((row) => row.length !== 3)) {
    throw new Error("Input must be a 3x3 matrix.");
  }

  let det = 0;
  for (let i = 0; i < 3; i++) {
    det +=
      matrix[0][i] *
      (matrix[1][(i + 1) % 3] * matrix[2][(i + 2) % 3] -
        matrix[1][(i + 2) % 3] * matrix[2][(i + 1) % 3]);
  }
  return det;
}

/**
 * Calculates the determinant of a 4x4 matrix.
 * @param matrix - A 4x4 array of numbers.
 * @returns The determinant of the matrix.
 * @throws Error if the input is not a 4x4 matrix.
 */
export function calDetMatrix4x4(matrix: number[][]): number {
  if (matrix.length !== 4 || matrix.some((row) => row.length !== 4)) {
    throw new Error("Input must be a 4x4 matrix.");
  }

  const getSubMatrix3x3 = (
    excludeRow: number,
    excludeCol: number
  ): number[][] => {
    return matrix
      .filter((_, rowIndex) => rowIndex !== excludeRow)
      .map((row) => row.filter((_, colIndex) => colIndex !== excludeCol));
  };

  const det =
    matrix[0][0] * calDetMatrix3x3(getSubMatrix3x3(0, 0)) -
    matrix[1][0] * calDetMatrix3x3(getSubMatrix3x3(1, 0)) +
    matrix[2][0] * calDetMatrix3x3(getSubMatrix3x3(2, 0)) -
    matrix[3][0] * calDetMatrix3x3(getSubMatrix3x3(3, 0));

  return det;
}

/**
 * Uses Descartes' Rule of Signs to check if a third-degree polynomial may have a negative root.
 * @param a3 - Coefficient of x³.
 * @param a2 - Coefficient of x².
 * @param a1 - Coefficient of x¹.
 * @param a0 - Constant term.
 * @returns True if the sign pattern suggests at least one positive real root.
 */
export function descartesLawOfSignsThirdDegreePolynomial(
  a3: number,
  a2: number,
  a1: number,
  a0: number
): boolean {
  return (
    (a3 < 0 && a2 === 0 && a1 > 0 && a0 < 0) ||
    (a3 < 0 && a2 > 0 && a1 === 0 && a0 < 0) ||
    (a3 < 0 && a2 > 0 && a1 < 0 && a0 < 0) ||
    (a3 < 0 && a2 > 0 && a1 > 0 && a0 < 0) ||
    (a3 < 0 && a2 < 0 && a1 > 0 && a0 < 0)
  );
}

/**
 * Finds the intersection points between a plane and a circle that lies in another plane.
 * @param planePoint - A point on the intersecting plane.
 * @param planeNormal - The normal vector of the intersecting plane.
 * @param circleCenter - Center of the circle.
 * @param circleNormal - Normal of the plane in which the circle lies.
 * @param radius - Radius of the circle.
 * @returns An array of 0, 1, or 2 intersection points; null if the planes are not perpendicular.
 */
export function FindIntersectionPoints(
  planePoint: Vector3,
  planeNormal: Vector3,
  circleCenter: Vector3,
  circleNormal: Vector3,
  radius: number
): Vector3[] | null {
  // Ensure normals are normalized
  planeNormal = planeNormal.clone().normalize();
  circleNormal = circleNormal.clone().normalize();

  // Check perpendicularity
  const dot = planeNormal.dot(circleNormal);
  if (Math.abs(dot) > 1e-5) return null;

  // Project circle center onto the plane
  const distanceToPlane = planeNormal.dot(
    circleCenter.clone().subtract(planePoint)
  );
  const projectedCenter = circleCenter
    .clone()
    .subtract(planeNormal.clone().scale(distanceToPlane));

  // Distance from projected center to circle center
  const centerDistance = projectedCenter.distanceTo(circleCenter);

  if (centerDistance > radius) {
    return [];
  } else if (Math.abs(centerDistance - radius) < 1e-6) {
    return [projectedCenter];
  } else {
    const distanceFromProjectedCenter = Math.sqrt(
      radius * radius - centerDistance * centerDistance
    );
    const direction = planeNormal.clone().cross(circleNormal).normalize();
    const intersectionPoint1 = projectedCenter
      .clone()
      .add(direction.clone().scale(distanceFromProjectedCenter));
    const intersectionPoint2 = projectedCenter
      .clone()
      .subtract(direction.clone().scale(distanceFromProjectedCenter));
    return [intersectionPoint1, intersectionPoint2];
  }
}

/**
 * Checks whether any of the sides of two rectangles intersect.
 * @param rect1Points - Array of 4 Vector3 points defining rectangle 1 (ordered in a loop).
 * @param rect2Points - Array of 4 Vector3 points defining rectangle 2 (ordered in a loop).
 * @returns True if any edges intersect; false otherwise.
 */
export function RectanglesIntersect(
  rect1Points: Vector3[],
  rect2Points: Vector3[]
): boolean {
  return (
    DoLinesIntersect(
      rect1Points[0],
      rect1Points[1],
      rect2Points[0],
      rect2Points[1]
    ) ||
    DoLinesIntersect(
      rect1Points[0],
      rect1Points[1],
      rect2Points[1],
      rect2Points[2]
    ) ||
    DoLinesIntersect(
      rect1Points[0],
      rect1Points[1],
      rect2Points[2],
      rect2Points[3]
    ) ||
    DoLinesIntersect(
      rect1Points[0],
      rect1Points[1],
      rect2Points[3],
      rect2Points[0]
    ) ||
    DoLinesIntersect(
      rect1Points[1],
      rect1Points[2],
      rect2Points[0],
      rect2Points[1]
    ) ||
    DoLinesIntersect(
      rect1Points[1],
      rect1Points[2],
      rect2Points[1],
      rect2Points[2]
    ) ||
    DoLinesIntersect(
      rect1Points[1],
      rect1Points[2],
      rect2Points[2],
      rect2Points[3]
    ) ||
    DoLinesIntersect(
      rect1Points[1],
      rect1Points[2],
      rect2Points[3],
      rect2Points[0]
    ) ||
    DoLinesIntersect(
      rect1Points[2],
      rect1Points[3],
      rect2Points[0],
      rect2Points[1]
    ) ||
    DoLinesIntersect(
      rect1Points[2],
      rect1Points[3],
      rect2Points[1],
      rect2Points[2]
    ) ||
    DoLinesIntersect(
      rect1Points[2],
      rect1Points[3],
      rect2Points[2],
      rect2Points[3]
    ) ||
    DoLinesIntersect(
      rect1Points[2],
      rect1Points[3],
      rect2Points[3],
      rect2Points[0]
    ) ||
    DoLinesIntersect(
      rect1Points[3],
      rect1Points[0],
      rect2Points[0],
      rect2Points[1]
    ) ||
    DoLinesIntersect(
      rect1Points[3],
      rect1Points[0],
      rect2Points[1],
      rect2Points[2]
    ) ||
    DoLinesIntersect(
      rect1Points[3],
      rect1Points[0],
      rect2Points[2],
      rect2Points[3]
    ) ||
    DoLinesIntersect(
      rect1Points[3],
      rect1Points[0],
      rect2Points[3],
      rect2Points[0]
    )
  );
}

/**
 * Checks if two lines in 3D space intersect.
 * @param A1 - Start point of line A.
 * @param A2 - End point of line A.
 * @param B1 - Start point of line B.
 * @param B2 - End point of line B.
 * @returns True if the lines intersect; false otherwise.
 */
export function DoLinesIntersect(
  A1: Vector3,
  A2: Vector3,
  B1: Vector3,
  B2: Vector3
): boolean {
  const directionA = A2.subtract(A1);
  const directionB = B2.subtract(B1);
  const crossProduct = directionA.cross(directionB);

  // Check if lines are parallel
  if (crossProduct.magnitude() < 0.001) {
    const lineVector = B1.subtract(A1);
    const dotProduct = lineVector.dot(directionA);

    // Check if lines coincide
    if (Math.abs(dotProduct) < 0.001) {
      return true; // Lines coincide
    } else {
      return false; // Lines are parallel but not coincident
    }
  }

  const lineVector = A1.subtract(B1);
  const a = directionA.dot(directionA);
  const b = directionA.dot(directionB);
  const c = directionB.dot(directionB);
  const d = directionA.dot(lineVector);
  const e = directionB.dot(lineVector);

  const denominator = a * c - b * b;

  // Calculate the parameters for the lines
  const s = (b * e - c * d) / denominator;
  const t = (a * e - b * d) / denominator;

  const closestPointLineA = A1.add(directionA.scale(s));
  const closestPointLineB = B1.add(directionB.scale(t));

  return closestPointLineA.equal(closestPointLineB);
}

/**
 * Checks whether a pair of vertices from two cylinders intersect or overlap
 * using either rectangle intersection or side verification logic.
 *
 * The method dynamically evaluates vertex-cylinder combinations and applies
 * the appropriate geometric verification based on predefined configurations.
 *
 * @param {number} vertexCylinder1 - Index of the first cylinder's vertex (0–3).
 * @param {number} vertexCylinder2 - Index of the second cylinder's vertex (0, 1, 2, or 3).
 * @param {number} u - A parameter vector component used in geometric calculations.
 * @param {number} w - Another vector parameter used in geometric calculations.
 * @param {number} s1 - Half-height of the first cylinder.
 * @param {number} s2 - Half-height of the second cylinder.
 * @param {number} r1 - Radius of the first cylinder.
 * @param {number} r2 - Radius of the second cylinder.
 * @param {number} a - A geometric parameter related to the cylinder axis.
 * @param {number} b - A geometric parameter (unused here).
 * @param {number} c - Offset along the axis used in side projection.
 * @param {number} alpha - Angle between the axes of the cylinders (in radians).
 * @param {Cylinder} cylinder1 - The first cylinder object.
 * @param {Cylinder} cylinder2 - The second cylinder object.
 * @param {Vector3} commonNormal - The vector representing the shortest path between axes.
 *
 * @returns {boolean} True if the vertex pair configuration intersects; otherwise false.
 */
export function checkVertices(
  vertexCylinder1: number,
  vertexCylinder2: number,
  u: number,
  w: number,
  s1: number,
  s2: number,
  r1: number,
  r2: number,
  a: number,
  b: number,
  c: number,
  alpha: number,
  cylinder1: Cylinder,
  cylinder2: Cylinder,
  commonNormal: Vector3
): boolean {
  // Case 1: top and bottom verification
  // Case 2 is in SideVerifications function

  // Vertex K1 Edge K2 L2
  if (vertexCylinder1 === 0 && vertexCylinder2 === 0) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex K1 Edge M2 N2
  if (vertexCylinder1 === 0 && vertexCylinder2 === 2) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex K1 Edge L2 M2
  if (vertexCylinder1 === 0 && vertexCylinder2 === 1) {
    const f = 1;
    const g = Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex K1 Edge K2 N2
  if (vertexCylinder1 === 0 && vertexCylinder2 === 3) {
    const f = 1;
    const g = -Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex L1 Edge K2 L2
  if (vertexCylinder1 === 1 && vertexCylinder2 === 0) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex L1 Edge M2 N2
  if (vertexCylinder1 === 1 && vertexCylinder2 === 2) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex L1 Edge L2 M2
  if (vertexCylinder1 === 1 && vertexCylinder2 === 1) {
    const f = -1;
    const g = Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex L1 Edge K2 N2
  if (vertexCylinder1 === 1 && vertexCylinder2 === 3) {
    const f = -1;
    const g = -Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex M1 Edge K2 L2
  if (vertexCylinder1 === 2 && vertexCylinder2 === 0) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex M1 Edge M2 N2
  if (vertexCylinder1 === 2 && vertexCylinder2 === 2) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex M1 Edge L2 M2
  if (vertexCylinder1 === 2 && vertexCylinder2 === 1) {
    const f = -1;
    const g = Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex M1 Edge K2 N2
  if (vertexCylinder1 === 2 && vertexCylinder2 === 3) {
    const f = -1;
    const g = -Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex N1 Edge K2 L2
  if (vertexCylinder1 === 3 && vertexCylinder2 === 0) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex N1 Edge M2 N2
  if (vertexCylinder1 === 3 && vertexCylinder2 === 2) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex N1 Edge L2 M2
  if (vertexCylinder1 === 3 && vertexCylinder2 === 1) {
    const f = 1;
    const g = Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex N1 Edge K2 N2
  if (vertexCylinder1 === 3 && vertexCylinder2 === 3) {
    const f = 1;
    const g = -Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex K2 Edge K1 L1
  if (vertexCylinder1 === 0 && vertexCylinder2 === 0) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex K2 Edge M1 N1
  if (vertexCylinder1 === 2 && vertexCylinder2 === 0) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex K2 Edge L1 M1
  if (vertexCylinder1 === 1 && vertexCylinder2 === 0) {
    const f = -1;
    const g = -Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex K2 Edge K1 N1
  if (vertexCylinder1 === 3 && vertexCylinder2 === 0) {
    const f = 1;
    const g = -Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex L2 Edge K1 L1
  if (vertexCylinder1 === 0 && vertexCylinder2 === 1) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex L2 Edge M1 N1
  if (vertexCylinder1 === 2 && vertexCylinder2 === 1) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex L2 Edge L1 M1
  if (vertexCylinder1 === 1 && vertexCylinder2 === 1) {
    const f = -1;
    const g = Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex L2 Edge K1 N1
  if (vertexCylinder1 === 3 && vertexCylinder2 === 1) {
    const f = 1;
    const g = Math.cos(alpha);
    const h = (c + s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex M2 Edge K1 L1
  if (vertexCylinder1 === 0 && vertexCylinder2 === 2) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex M2 Edge M1 N1
  if (vertexCylinder1 === 2 && vertexCylinder2 === 2) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex M2 Edge L1 M1
  if (vertexCylinder1 === 1 && vertexCylinder2 === 2) {
    const f = -1;
    const g = Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex M2 Edge K1 N1
  if (vertexCylinder1 === 3 && vertexCylinder2 === 2) {
    const f = 1;
    const g = Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  // Vertex N2 Edge K1 L1
  if (vertexCylinder1 === 0 && vertexCylinder2 === 3) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex N2 Edge M1 N1
  if (vertexCylinder1 === 2 && vertexCylinder2 === 3) {
    if (
      rectangleIntersection(
        u,
        w,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal,
        r1,
        r2
      )
    ) {
      return true;
    }
  }
  // Vertex N2 Edge L1 M1
  if (vertexCylinder1 === 1 && vertexCylinder2 === 3) {
    const f = -1;
    const g = -Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }
  // Vertex N2 Edge K1 N1
  if (vertexCylinder1 === 3 && vertexCylinder2 === 3) {
    const f = 1;
    const g = -Math.cos(alpha);
    const h = (c - s2) * Math.sin(alpha);
    if (
      SideVerification(
        f,
        g,
        h,
        u,
        w,
        a,
        r1,
        r2,
        cylinder1,
        cylinder2,
        s1,
        s2,
        commonNormal
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Performs a side verification check between two cylinders to determine if they intersect.
 * This method evaluates the geometric relationship between the sides of the cylinders
 * using a quartic equation and rectangle intersection logic.
 *
 * @param {number} f - A geometric parameter related to the orientation of the cylinder.
 * @param {number} g - A cosine-based parameter derived from the angle between the cylinders.
 * @param {number} h - An offset parameter along the axis used in the side projection.
 * @param {number} u - A parameter vector component used in geometric calculations.
 * @param {number} w - Another vector parameter used in geometric calculations.
 * @param {number} a - A geometric parameter related to the cylinder axis.
 * @param {number} r1 - Radius of the first cylinder.
 * @param {number} r2 - Radius of the second cylinder.
 * @param {Cylinder} cylinder1 - The first cylinder object.
 * @param {Cylinder} cylinder2 - The second cylinder object.
 * @param {number} s1 - Half-height of the first cylinder.
 * @param {number} s2 - Half-height of the second cylinder.
 * @param {Vector3} commonNormal - The vector representing the shortest path between the axes of the cylinders.
 *
 * @returns {boolean} True if the sides of the cylinders intersect; otherwise, false.
 */
export function SideVerification(
  f: number,
  g: number,
  h: number,
  u: number,
  w: number,
  a: number,
  r1: number,
  r2: number,
  cylinder1: Cylinder,
  cylinder2: Cylinder,
  s1: number,
  s2: number,
  commonNormal: Vector3
): boolean {
  // Quartic equation coefficients
  const lambda1 =
    -Math.pow(f, 4) + 2 * Math.pow(f, 2) * Math.pow(g, 2) - Math.pow(g, 4);
  const lambda2 =
    -4 * a * Math.pow(f, 2) * Math.pow(g, 2) + 4 * a * Math.pow(g, 4);
  const lambda3 =
    2 * Math.pow(r1, 2) * Math.pow(f, 4) +
    2 * Math.pow(a, 2) * Math.pow(f, 2) * Math.pow(g, 2) -
    2 * Math.pow(r1, 2) * Math.pow(f, 2) * Math.pow(g, 2) -
    2 * Math.pow(r1, 2) * Math.pow(f, 2) * Math.pow(g, 2) -
    6 * Math.pow(a, 2) * Math.pow(g, 4) +
    2 * Math.pow(r2, 2) * Math.pow(g, 4) -
    2 * Math.pow(f, 2) * Math.pow(h, 2) -
    2 * Math.pow(g, 2) * Math.pow(h, 2);
  const lambda4 =
    4 * a * Math.pow(r1, 2) * Math.pow(f, 2) * Math.pow(g, 2) +
    4 * Math.pow(a, 3) * Math.pow(g, 4) -
    4 * a * Math.pow(r2, 2) * Math.pow(g, 4) +
    4 * a * Math.pow(g, 2) * Math.pow(h, 2);
  const lambda5 =
    -Math.pow(r1, 4) * Math.pow(f, 4) -
    2 * Math.pow(a, 2) * Math.pow(r1, 2) * Math.pow(f, 2) * Math.pow(g, 2) +
    2 * Math.pow(r1, 2) * Math.pow(r2, 2) * Math.pow(f, 2) * Math.pow(g, 2) -
    Math.pow(a, 4) * Math.pow(g, 4) +
    2 * Math.pow(a, 2) * Math.pow(r2, 2) * Math.pow(g, 4) -
    Math.pow(r2, 4) * Math.pow(g, 4) +
    2 * Math.pow(r1, 2) * Math.pow(f, 2) * Math.pow(h, 2) -
    2 * Math.pow(a, 2) * Math.pow(g, 2) * Math.pow(h, 2) +
    2 * Math.pow(r2, 2) * Math.pow(g, 2) * Math.pow(h, 2) -
    Math.pow(h, 4);

  // Solve quartic equation for u
  const solutions = quarticRoots(lambda1, lambda2, lambda3, lambda4, lambda5);

  if (solutions.length === 2) {
    if (
      (solutions[0] >= a - Math.min(r1, r2) &&
        solutions[0] <= a + Math.max(r1, r2)) ||
      (solutions[1] >= a - Math.min(r1, r2) &&
        solutions[1] <= a + Math.max(r1, r2))
    ) {
      if (
        rectangleIntersection(
          u,
          w,
          cylinder1,
          cylinder2,
          s1,
          s2,
          commonNormal,
          r1,
          r2
        )
      ) {
        return true;
      }
    }
  } else if (solutions.length === 1) {
    if (
      solutions[0] >= a - Math.min(r1, r2) &&
      solutions[0] <= a + Math.max(r1, r2)
    ) {
      if (
        rectangleIntersection(
          u,
          w,
          cylinder1,
          cylinder2,
          s1,
          s2,
          commonNormal,
          r1,
          r2
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Determines whether the rectangular projections of the end caps of two cylinders
 * intersect in the plane defined by a common normal. This function applies a
 * Separating Axis Theorem (SAT) based test using computed intersection points.
 *
 * The rectangles are formed by slicing each cylinder with a plane perpendicular to the
 * shortest vector between their axes and checking whether the resulting cross-sections overlap.
 *
 * @param {number} u - Distance along the common normal from cylinder1's center to its slicing plane.
 * @param {number} w - Distance along the common normal from cylinder2's center to its slicing plane.
 * @param {Cylinder} cylinder1 - The first cylinder object.
 * @param {Cylinder} cylinder2 - The second cylinder object.
 * @param {number} s1 - Half-height of the first cylinder.
 * @param {number} s2 - Half-height of the second cylinder.
 * @param {Vector3} commonNormal - The shortest vector between the axes of the two cylinders.
 * @param {number} r1 - Radius of the first cylinder.
 * @param {number} r2 - Radius of the second cylinder.
 *
 * @returns {boolean} True if the projected rectangles intersect, false otherwise.
 *
 * @remarks
 * - Uses `FindIntersectionPoints` to compute intersections between planes and cylinder end-caps.
 * - Applies Separating Axis Test (SAT) via `RectanglesIntersect` to determine overlap.
 * - Returns false if any of the intersection point sets are invalid or incomplete.
 */
export function rectangleIntersection(
  u: number,
  w: number,
  cylinder1: Cylinder,
  cylinder2: Cylinder,
  s1: number,
  s2: number,
  commonNormal: Vector3,
  r1: number,
  r2: number
): boolean {
  const cylinder1Position = cylinder1.getCenter();
  const cylinder2Position = cylinder2.getCenter();

  const Circle1Center1 = cylinder1Position.add(cylinder1.forward().scale(s1));
  const Circle2Center1 = cylinder1Position.subtract(
    cylinder1.forward().scale(s1)
  );
  const Circle1Center2 = cylinder2Position.add(cylinder2.forward().scale(s2));
  const Circle2Center2 = cylinder2Position.subtract(
    cylinder2.forward().scale(s2)
  );
  const PlanePosition1 = cylinder1Position.add(commonNormal.scale(u));
  const PlanePosition2 = cylinder2Position.add(commonNormal.scale(w));

  const point1 = FindIntersectionPoints(
    PlanePosition1,
    commonNormal,
    Circle1Center1,
    cylinder1.forward(),
    r1
  );
  const point2 = FindIntersectionPoints(
    PlanePosition1,
    commonNormal,
    Circle2Center1,
    cylinder1.forward(),
    r1
  );
  const point3 = FindIntersectionPoints(
    PlanePosition2,
    commonNormal,
    Circle1Center2,
    cylinder2.forward(),
    r2
  );
  const point4 = FindIntersectionPoints(
    PlanePosition2,
    commonNormal,
    Circle2Center2,
    cylinder2.forward(),
    r2
  );

  if (
    point1 &&
    point1.length === 2 &&
    point2 &&
    point2.length === 2 &&
    point3 &&
    point3.length === 2 &&
    point4 &&
    point4.length === 2
  ) {
    const Q1Vertices: Vector3[] = [];
    if (point1[1].distanceTo(point2[0]) < point1[1].distanceTo(point2[1])) {
      Q1Vertices.push(point1[0], point1[1], point2[0], point2[1]);
    } else {
      Q1Vertices.push(point1[0], point1[1], point2[1], point2[0]);
    }

    const Q2Vertices: Vector3[] = [];
    if (point3[1].distanceTo(point4[0]) < point3[1].distanceTo(point4[1])) {
      Q2Vertices.push(point3[0], point3[1], point4[0], point4[1]);
    } else {
      Q2Vertices.push(point3[0], point3[1], point4[1], point4[0]);
    }

    // Separating Axis Test (SAT) in Vertex Edge Test - Check for overlap along each axis of Q1 and Q2
    if (RectanglesIntersect(Q1Vertices, Q2Vertices)) {
      console.log("Intersection detected by SAT in Vertex Edge Test");
      return true;
    }
  }
  return false;
}

/**
 * Performs a Vertex-Edge test as part of a collision detection algorithm between two cylinders.
 *
 * The function transforms 2D representations of the vertices of two cylinders' cross-sections and
 * calculates potential intersection points in the transformed space. It then validates those
 * points via a helper function (`checkVertices`) to determine whether a vertex-edge intersection occurs.
 *
 * @param {number} s1 - Half-height of the first cylinder.
 * @param {number} s2 - Half-height of the second cylinder.
 * @param {number} r1 - Radius of the first cylinder.
 * @param {number} r2 - Radius of the second cylinder.
 * @param {number} a - Scalar parameter used in geometric transformation (commonly center-to-center distance).
 * @param {number} b - Scalar offset parameter used in transformation.
 * @param {number} c - Scalar offset parameter used in transformation.
 * @param {number} alpha - Angle (in degrees) between the cylinder axes projected in 2D.
 * @param {Cylinder} cylinder1 - The first cylinder object.
 * @param {Cylinder} cylinder2 - The second cylinder object.
 * @param {Vector3} commonNormal - The shortest vector between the axes of the two cylinders.
 *
 * @returns {boolean} True if a vertex-edge intersection is detected; false otherwise.
 *
 * @remarks
 * - Uses `ApplyTransformation` to convert local vertex coordinates into a shared frame.
 * - Checks two possible roots (`u1`, `u2`) from solving the cylinder-circle intersection equation.
 * - Delegates detailed geometric checks to `checkVertices`.
 * - Assumes the use of a coordinate space where both cylinders have simplified square cross-sections.
 */
export function VertexEdgeTestFunction(
  s1: number,
  s2: number,
  r1: number,
  r2: number,
  a: number,
  b: number,
  c: number,
  alpha: number,
  cylinder1: Cylinder,
  cylinder2: Cylinder,
  commonNormal: Vector3
): boolean {
  const cylinder1Vertices: Vector2[] = [
    new Vector2(1, 1),
    new Vector2(-1, 1),
    new Vector2(-1, -1),
    new Vector2(1, -1),
  ];
  const cylinder2Vertices: Vector2[] = [
    new Vector2(1, 1),
    new Vector2(-1, 1),
    new Vector2(-1, -1),
    new Vector2(1, -1),
  ];

  let vertexCylinder1 = 0;
  let vertexCylinder2 = 0;

  for (const cylinder1Vertex of cylinder1Vertices) {
    for (const cylinder2Vertex of cylinder2Vertices) {
      const v1AndV2 = ApplyTransformation(
        cylinder1Vertex,
        cylinder2Vertex,
        s1,
        s2,
        b,
        c,
        alpha * (Math.PI / 180)
      );
      const u1 =
        a + Math.sqrt(Math.abs(Math.pow(r2, 2) - Math.pow(v1AndV2.y, 2)));
      const u2 =
        a - Math.sqrt(Math.abs(Math.pow(r2, 2) - Math.pow(v1AndV2.y, 2)));
      const w1 = u1 - a;
      const w2 = u2 - a;

      if (!isNaN(u1)) {
        if (u1 >= a - Math.min(r1, r2) && u1 <= Math.max(r1, r2)) {
          if (
            checkVertices(
              vertexCylinder1,
              vertexCylinder2,
              u1,
              w1,
              s1,
              s2,
              r1,
              r2,
              a,
              b,
              c,
              alpha,
              cylinder1,
              cylinder2,
              commonNormal
            )
          ) {
            return true;
          }
        }
      }

      if (!isNaN(u2)) {
        if (u2 >= a - Math.min(r1, r2) && u2 <= Math.max(r1, r2)) {
          if (
            checkVertices(
              vertexCylinder1,
              vertexCylinder2,
              u2,
              w2,
              s1,
              s2,
              r1,
              r2,
              a,
              b,
              c,
              alpha,
              cylinder1,
              cylinder2,
              commonNormal
            )
          ) {
            return true;
          }
        }
      }

      vertexCylinder2++;
    }
    vertexCylinder1++;
    vertexCylinder2 = 0;
  }

  return false;
}

/**
 * Applies a 2D geometric transformation based on the spatial relationship between two cylinders.
 *
 * This function computes the transformed 2D coordinates (`v1`, `v2`) for a given vertex pair,
 * factoring in the relative cylinder heights (`s1`, `s2`), offsets (`b`, `c`), and angle `alpha`.
 * The result is used to simulate the projection of 3D geometry into a 2D plane for collision analysis.
 *
 * @param {Vector2} v1Ands1Signs - Sign multipliers for x and y components of the first cylinder vertex and its height (`s1`).
 * @param {Vector2} v2Ands2Signs - Sign multipliers for x and y components of the second cylinder vertex and its height (`s2`).
 * @param {number} s1 - Half-height of the first cylinder.
 * @param {number} s2 - Half-height of the second cylinder.
 * @param {number} b - Scalar offset along the common normal.
 * @param {number} c - Additional scalar shift in the coordinate system.
 * @param {number} alpha - Angle (in radians) between the projected axes of the two cylinders in 2D.
 *
 * @returns {Vector2} The transformed 2D coordinates corresponding to the input vertex pair.
 *
 * @remarks
 * - Converts signs and scaling information into actual spatial positions.
 * - Projects and rotates those positions based on the angle between axes (`alpha`).
 * - Typically used in Vertex-Edge collision tests between cylinders.
 */
export function ApplyTransformation(
  v1Ands1Signs: Vector2,
  v2Ands2Signs: Vector2,
  s1: number,
  s2: number,
  b: number,
  c: number,
  alpha: number
): Vector2 {
  const actualS1 = v1Ands1Signs.y * s1;
  const actualS2 = v2Ands2Signs.y * s2;

  // (s1 - b - (c - s2) cos alpha) / sin alpha
  const v2 =
    v2Ands2Signs.x *
    ((actualS1 - b - c * Math.cos(alpha) - actualS2 * Math.cos(alpha)) /
      Math.sin(alpha));

  // (s1 - b - (c - s2) cos alpha) / sin alpha
  const v1 =
    v1Ands1Signs.x *
    (v2 * Math.cos(alpha) - actualS2 * Math.sin(alpha) - c * Math.sin(alpha));

  return new Vector2(v1, v2);
}

/**
 * Checks whether the coefficients of a 4th-degree polynomial match any known sign-change patterns
 * consistent with Descartes' Rule of Signs for indicating positive real roots.
 *
 * This is a pattern-matching approach and not a general rule-checker.
 *
 * @param {number} a4 - Coefficient of x⁴
 * @param {number} a3 - Coefficient of x³
 * @param {number} a2 - Coefficient of x²
 * @param {number} a1 - Coefficient of x
 * @param {number} a0 - Constant term
 *
 * @returns {boolean} True if the pattern matches one of the known sign variations
 * indicating a possible positive real root.
 *
 * @remarks
 * - Based on manually encoded patterns (1 to 18).
 * - Used in specialized geometric or algebraic heuristics rather than general polynomial solving.
 */
export function DescartesLawOfSignsFourthDegreePolynomial(
  a4: number,
  a3: number,
  a2: number,
  a1: number,
  a0: number
): boolean {
  const pattern1to18 =
    (a4 < 0 && a3 > 0 && a2 > 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 < 0 && a2 > 0 && a1 < 0 && a0 < 0) ||
    (a4 < 0 && a3 < 0 && a2 > 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 < 0 && a2 < 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 < 0 && a1 < 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 > 0 && a1 < 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 === 0 && a1 < 0 && a0 < 0) ||
    (a4 < 0 && a3 === 0 && a2 > 0 && a1 < 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 < 0 && a1 === 0 && a0 < 0) ||
    (a4 < 0 && a3 < 0 && a2 === 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 < 0 && a2 > 0 && a1 === 0 && a0 < 0) ||
    (a4 < 0 && a3 === 0 && a2 < 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 === 0 && a1 === 0 && a0 < 0) ||
    (a4 < 0 && a3 === 0 && a2 > 0 && a1 === 0 && a0 < 0) ||
    (a4 < 0 && a3 === 0 && a2 === 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 === 0 && a1 > 0 && a0 < 0) ||
    (a4 < 0 && a3 > 0 && a2 > 0 && a1 === 0 && a0 < 0) ||
    (a4 < 0 && a3 === 0 && a2 > 0 && a1 > 0 && a0 < 0);

  return pattern1to18;
}

/**
 * Checks whether two numeric values are approximately equal within a specified margin (epsilon).
 *
 * Useful for comparing floating-point values where exact equality is unreliable.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @param {number} [epsilon=0.001] - The maximum allowed difference for the values to be considered equal.
 * @returns {boolean} True if the values are approximately equal; otherwise, false.
 */
export function ApproximatlyEqual(
  a: number,
  b: number,
  epsilon: number = 0.001
): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Determines whether a plane (represented by its center) lies between two other planes in 3D space.
 *
 * It uses vector projection to determine if the middle plane lies along the axis defined by the
 * line segment connecting the first and second plane centers.
 *
 * @param {Vector3} plane1Center - Center of the first plane.
 * @param {Vector3} middlePlaneCenter - Center of the plane to check.
 * @param {Vector3} plane2Center - Center of the second plane.
 * @returns {boolean} True if the middle plane is located between plane1 and plane2; otherwise, false.
 */
export function IsPlaneBetween(
  plane1Center: Vector3,
  middlePlaneCenter: Vector3,
  plane2Center: Vector3
): boolean {
  // Define vectors along the common axis
  let axis = plane2Center.subtract(plane1Center).normalize();
  let toMiddle = middlePlaneCenter.subtract(plane1Center);

  // Project the toMiddle vector onto the axis
  let projection = toMiddle.dot(axis);

  // Check if the middle plane is between the other two along the common axis
  return projection > 0 && projection < plane1Center.distanceTo(plane2Center);
}

/**
 * Converts an angle in degress to radians.
 *
 * @param {number} degrees - The angle in radians to convert.
 * @returns {number} The angle converted to degrees.
 *
 * @remarks
 * - Uses the formula: radians = (degress * π) / 180
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts an angle in radians to degrees.
 *
 * @param {number} radians - The angle in radians to convert.
 * @returns {number} The angle converted to degrees.
 *
 * @remarks
 * - Uses the formula: degrees = radians * (180 / π)
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}
