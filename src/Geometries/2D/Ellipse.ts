import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { Vector2 } from "../../Calc/Util/Utils";

export class Ellipse implements IGeometry2D {
  readonly center: Vector2;
  readonly xradius: number;
  readonly yradius: number;
  readonly segments: number;
  private geometry: any = null;
  public rotation: number = 0;

  constructor(
    center: Vector2,
    xradius: number,
    yradius: number,
    segments: number
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.segments = segments;
    this.geometry = null;
  }
  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipse Geometry");
      let curve = new THREE.EllipseCurve(
        this.center.x,
        this.center.y,
        this.xradius,
        this.yradius,
        0,
        2 * Math.PI,
        false,
        0
      );
      this.geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(this.segments)
      );
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
  
}
