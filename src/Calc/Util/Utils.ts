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

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
  public toVector3(): Vector3 {
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
  public equal(vector: Vector3): boolean {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
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
}

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
  if (crossProduct.magnitude() < 0.001) {
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

export function Distance(point1: Vector2, point2: Vector2): number {
  return point1.distanceTo(point2);
}

export function quarticRoots(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number
): number[] {
  if (a === 0) {
    throw new Error("Coefficient 'a' must not be zero for a quartic equation.");
  }

  // Normalize coefficients
  const A = b / a;
  const B = c / a;
  const C = d / a;
  const D = e / a;

  // Depress the quartic: x = y - A/4
  const p = B - (3 * A ** 2) / 8;
  const q = C + A ** 3 / 8 - (A * B) / 2;
  const r = D - (3 * A ** 4) / 256 + (A ** 2 * B) / 16 - (A * C) / 4;

  // Solve resolvent cubic: z³ + (p/2)z² + ((p² - 4r)/16)z - q²/64 = 0
  const cubicA = 1;
  const cubicB = 0.5 * p;
  const cubicC = (p ** 2 - 4 * r) / 16;
  const cubicD = -(q ** 2) / 64;

  const cubicRoots = solveCubic(cubicA, cubicB, cubicC, cubicD);
  const z = cubicRoots.find((root) => !isNaN(root))!; // Pick a real root

  const sqrt1 = Math.sqrt(2 * z - p);
  const sqrt2 = q / (2 * sqrt1);

  // Now solve two quadratics
  const quad1 = solveQuadratic(1, sqrt1, z - sqrt2);
  const quad2 = solveQuadratic(1, -sqrt1, z + sqrt2);

  // Undo the initial substitution (x = y - A/4)
  const offset = -A / 4;
  return [...quad1, ...quad2].map((root) => root + offset);
}

// Solve cubic using Cardano's method
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

// Solve quadratic ax² + bx + c = 0
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

export function isBetweenOrdered(
  val: number,
  lowerBound: number,
  upperBound: number
): boolean {
  return lowerBound <= val && val <= upperBound;
}

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

export function FindIntersectionPoints(
  planePoint: Vector3,
  planeNormal: Vector3,
  circleCenter: Vector3,
  circleNormal: Vector3,
  radius: number
): Vector3[] | null {
  // Ensure the circle's normal is perpendicular to the plane
  const dotProduct = planeNormal.dot(circleNormal);
  if (dotProduct >= 0.00001 || dotProduct <= -0.00001) {
    return null;
  }

  // Project circle center onto the plane
  const distanceToPlane = planeNormal.dot(circleCenter.subtract(planePoint));
  const projectedCenter = circleCenter.subtract(
    planeNormal.scale(distanceToPlane)
  );

  // Calculate distance from the projected center to the circle center
  const centerDistance = projectedCenter.distanceTo(circleCenter);

  if (centerDistance > radius) {
    // No intersection
    return [];
  } else if (centerDistance === radius) {
    // One intersection point
    return [projectedCenter];
  } else {
    // Two intersection points
    const distanceFromProjectedCenter = Math.sqrt(
      radius * radius - centerDistance * centerDistance
    );
    const direction = planeNormal.cross(circleNormal).normalize();

    const intersectionPoint1 = projectedCenter.add(
      direction.scale(distanceFromProjectedCenter)
    );
    const intersectionPoint2 = projectedCenter.subtract(
      direction.scale(distanceFromProjectedCenter)
    );

    return [intersectionPoint1, intersectionPoint2];
  }
}

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

export function checkVertices(
  vertexCylinder1: number,
  vertexCylinder2: number,
  u: number,
  w: number,
  v1: number,
  v2: number,
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
      const v1 = v1AndV2.x;
      const v2 = v1AndV2.y;

      if (!isNaN(u1)) {
        if (u1 >= a - Math.min(r1, r2) && u1 <= Math.max(r1, r2)) {
          if (
            checkVertices(
              vertexCylinder1,
              vertexCylinder2,
              u1,
              w1,
              v1,
              v2,
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
              v1,
              v2,
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
