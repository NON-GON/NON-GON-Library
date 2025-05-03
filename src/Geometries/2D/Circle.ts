import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { Vector3 } from "../../Calc/Util/Utils";
import { Geometry2DBase } from "./Geometry2DBase";

export class Circle extends Geometry2DBase implements IGeometry2D {
  readonly radius: number;
  public type: GeometryType2D = GeometryType2D.Ellipse;

  constructor(
    center: Vector3 | Vector2,
    rotation: Vector3 | Vector2,
    radius: number,
    segments: number
  ) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation =
      rotation instanceof Vector2
        ? new Vector3(rotation.x, rotation.y, 0)
        : rotation;
    this.radius = radius;
    this.segments = segments;
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipse Geometry");
      let curve = new THREE.EllipseCurve(
        this.center.x,
        this.center.y,
        this.radius,
        this.radius,
        0,
        2 * Math.PI,
        false,
        0
      );
      this.geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(this.segments)
      );
      this.normalizeGeometry();
      return this.geometry;
    }
  }
  public getRadius(): number {
    return this.radius;
  }
}
