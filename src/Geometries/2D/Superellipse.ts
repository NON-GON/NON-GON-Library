import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { Vector2 } from "../../Calc/Util/Utils";

export class Superellipse implements IGeometry2D {
  readonly center: Vector2;
  readonly xradius: number;
  readonly yradius: number;
  readonly segments: number;
  readonly exponent: number;
  private geometry: any = null;
  public rotation: number = 0;

  constructor(
    center: Vector2,
    xradius: number,
    yradius: number,
    segments: number,
    exponent: number // n in superellipse formula
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.segments = segments;
    this.exponent = exponent;
    this.geometry = null;
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Superellipse Geometry");

      const points: Vector2[] = [];

      for (let i = 0; i <= this.segments; i++) {
        const theta = (i / this.segments) * 2 * Math.PI;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        // Apply superellipse formula
        const x =
          this.xradius *
          Math.sign(cosTheta) *
          Math.pow(Math.abs(cosTheta), 2 / this.exponent);
        const y =
          this.yradius *
          Math.sign(sinTheta) *
          Math.pow(Math.abs(sinTheta), 2 / this.exponent);

        points.push(new THREE.Vector2(x + this.center.x, y + this.center.y));
      }

      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      return this.geometry;
    }
  }

  public getCenter(): Vector2 {
    return this.center;
  }
  public getRadius(): Vector2 {
    return new Vector2(this.xradius, this.yradius);
  }
  public getSegments(): number {
    return this.segments;
  }
  public getExponent(): number {
    return this.exponent;
  }
}
