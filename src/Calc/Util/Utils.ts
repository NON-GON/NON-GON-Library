import { Ellipse } from "../../Geometries/2D/Ellipse";

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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
