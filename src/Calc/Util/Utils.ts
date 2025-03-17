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

  const maxIterations = 1000;
  const tolerance = 1e-12;

  // Evaluate quartic polynomial at x
  function evalPoly(x: number, coeffs: number[]): number {
    return (
      coeffs[0] * x ** 4 +
      coeffs[1] * x ** 3 +
      coeffs[2] * x ** 2 +
      coeffs[3] * x +
      coeffs[4]
    );
  }

  // Evaluate derivative
  function evalPolyDeriv(x: number, coeffs: number[]): number {
    return (
      4 * coeffs[0] * x ** 3 +
      3 * coeffs[1] * x ** 2 +
      2 * coeffs[2] * x +
      coeffs[3]
    );
  }

  // Newton-Raphson method to find one real root
  function newtonRaphson(coeffs: number[], guess: number): number {
    let x = guess;
    for (let i = 0; i < maxIterations; i++) {
      const fx = evalPoly(x, coeffs);
      const fpx = evalPolyDeriv(x, coeffs);

      if (Math.abs(fpx) < 1e-14) break; // avoid division by near-zero

      const x1 = x - fx / fpx;
      if (Math.abs(x1 - x) < tolerance) return x1;
      x = x1;
    }
    return x;
  }

  // Deflate polynomial by dividing by (x - root)
  function deflate(coeffs: number[], root: number): number[] {
    const n = coeffs.length - 1;
    let newCoeffs = [coeffs[0]]; // leading coefficient
    for (let i = 1; i < n; i++) {
      newCoeffs[i] = coeffs[i] + newCoeffs[i - 1] * root;
    }
    return newCoeffs;
  }

  let coeffs = [a, b, c, d, e];
  let roots: number[] = [];

  for (let k = 0; k < 4; k++) {
    // Arbitrary initial guess (can be improved)
    let guess = 0;
    let root = newtonRaphson(coeffs, guess);
    roots.push(root);
    coeffs = deflate(coeffs, root); // reduce polynomial degree
  }

  return roots;
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

