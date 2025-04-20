import { Ellipse } from "../../Geometries/2D/Ellipse";
import { Ellipsoid } from "../../Geometries/3D/Ellipsoid";
import { Sphere } from "../../Geometries/3D/Sphere";

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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

  static Zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  applyMatrix4(matrix: number[]): Vector3 {

    const x = this.x, y = this.y, z = this.z;
    const w = 1 / (matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]);

    const nx = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) * w;
    const ny = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) * w;
    const nz = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) * w;

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

export function LocalSpaceToWorldSpace3D(
  Ellipsoid: Ellipsoid | Sphere,
  point: Vector3
): Vector3 {
  // Step 1: Rotate point by ellipsoid rotation
  const cosX = Math.cos(Ellipsoid.rotation.x);
  const sinX = Math.sin(Ellipsoid.rotation.x);
  const cosY = Math.cos(Ellipsoid.rotation.y);
  const sinY = Math.sin(Ellipsoid.rotation.y);
  const cosZ = Math.cos(Ellipsoid.rotation.z);
  const sinZ = Math.sin(Ellipsoid.rotation.z);

  // Apply rotation around X-axis
  const rotatedX1 = point.x;
  const rotatedY1 = point.y * cosX - point.z * sinX;
  const rotatedZ1 = point.y * sinX + point.z * cosX;

  // Apply rotation around Y-axis
  const rotatedX2 = rotatedX1 * cosY - rotatedZ1 * sinY;
  const rotatedY2 = rotatedY1;
  const rotatedZ2 = rotatedX1 * sinY + rotatedZ1 * cosY;

  // Apply rotation around Z-axis
  const worldX = rotatedX2 * cosZ - rotatedY2 * sinZ;
  const worldY = rotatedX2 * sinZ + rotatedY2 * cosZ;
  const worldZ = rotatedZ2;

  // Step 2: Translate back to world space
  return new Vector3(
    worldX + Ellipsoid.center.x,
    worldY + Ellipsoid.center.y,
    worldZ + Ellipsoid.center.z
  );
}

export function WorldSpaceToLocalSpace3D(
  ellipsoid: Ellipsoid | Sphere,
  point: Vector3
): Vector3 {
  // Step 1: Translate point to ellipsoid's center
  const translatedX = point.x - ellipsoid.center.x;
  const translatedY = point.y - ellipsoid.center.y;
  const translatedZ = point.z - ellipsoid.center.z;

  // Step 2: Rotate point by negative ellipsoid rotation
  const cosX = Math.cos(-ellipsoid.rotation.x);
  const sinX = Math.sin(-ellipsoid.rotation.x);
  const cosY = Math.cos(-ellipsoid.rotation.y);
  const sinY = Math.sin(-ellipsoid.rotation.y);
  const cosZ = Math.cos(-ellipsoid.rotation.z);
  const sinZ = Math.sin(-ellipsoid.rotation.z);

  // Apply rotation around Z-axis
  const rotatedX1 = translatedX * cosZ - translatedY * sinZ;
  const rotatedY1 = translatedX * sinZ + translatedY * cosZ;
  const rotatedZ1 = translatedZ;

  // Apply rotation around Y-axis
  const rotatedX2 = rotatedX1 * cosY + rotatedZ1 * sinY;
  const rotatedY2 = rotatedY1;
  const rotatedZ2 = -rotatedX1 * sinY + rotatedZ1 * cosY;

  // Apply rotation around X-axis
  const localX = rotatedX2;
  const localY = rotatedY2 * cosX - rotatedZ2 * sinX;
  const localZ = rotatedY2 * sinX + rotatedZ2 * cosX;

  return new Vector3(localX, localY, localZ);
}
export function WorldSpaceToLocalSpace(
  ellipse: Ellipse,
  point: Vector2
): Vector2 {
  // Step 1: Translate point to ellipse's center
  const translatedX = point.x - ellipse.center.x;
  const translatedY = point.y - ellipse.center.y;

  // Step 2: Rotate point by negative ellipse rotation
  const cosTheta = Math.cos(-ellipse.rotation);
  const sinTheta = Math.sin(-ellipse.rotation);

  const localX = translatedX * cosTheta - translatedY * sinTheta;
  const localY = translatedX * sinTheta + translatedY * cosTheta;

  return new Vector2(localX, localY);
}

export function LocalSpaceToWorldSpace(
  ellipse: Ellipse,
  point: Vector2
): Vector2 {
  // Step 1: Rotate point by ellipse rotation
  const cosTheta = Math.cos(ellipse.rotation);
  const sinTheta = Math.sin(ellipse.rotation);

  const rotatedX = point.x * cosTheta - point.y * sinTheta;
  const rotatedY = point.x * sinTheta + point.y * cosTheta;

  // Step 2: Translate back to world space
  const worldX = rotatedX + ellipse.center.x;
  const worldY = rotatedY + ellipse.center.y;

  return new Vector2(worldX, worldY);
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
