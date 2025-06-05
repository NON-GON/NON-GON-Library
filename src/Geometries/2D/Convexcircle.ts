import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import {
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Geometry2DBase } from "./Geometry2DBase";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import * as THREE from "three";
import { Circle } from "./Circle";
import { ShortestDistance2D } from "../../Calc/Shortest_Distance/Shortest_Distance_2D";
export class Convexcircle extends Geometry2DBase implements IGeometry2D {
  private angle: number = -Math.PI / 2;
  readonly segments: number;
  readonly radius: number;
  public type: GeometryType2D = GeometryType2D.ConvexCircle;
  constructor(
    center: Vector3 | Vector2,
    radius: number,
    rotation: Vector3 | Vector2,
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
      const points: Vector2[] = [];
      this.angle = -Math.PI / 2; // <-- Reset angle here

      for (let i = 0; i <= this.segments + 1; i++) {
        let f = this.f_c(this.angle, this.radius);
        let fd = this.fd_c(this.angle, this.radius);
        let xpc = (fd * this.radius) / Math.sqrt(f * f + fd * fd);
        let zpc = (f * this.radius) / Math.sqrt(f * f + fd * fd) - f;
        let r = Math.sqrt(xpc ** 2 + zpc ** 2);
        let phi = this.angle - Math.atan(xpc / zpc);
        let pos = new Vector2(Math.cos(phi), Math.sin(phi));
        points.push(
          new THREE.Vector2(
            pos.x * r + this.center.x,
            pos.y * r + this.center.y
          )
        );
        this.angle += (2 * Math.PI) / this.segments;
      }
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.normalizeGeometry();
      return this.geometry;
    }
  }

  /**
   * Returns the effective radius at a given angle for the convex circle.
   * @param angle The angle (in radians) at which to get the radius.
   */
  public getRadius(): number {
    return this.radius;
  }
  public point(angle: number, radius: number): Vector2 {
    let f = this.f_c(angle, radius);
    let fd = this.fd_c(angle, radius);
    let xpc = (fd * radius) / Math.sqrt(f * f + fd * fd);
    let zpc = (f * radius) / Math.sqrt(f * f + fd * fd) - f;
    let r = Math.sqrt(xpc ** 2 + zpc ** 2);
    let phi = angle - Math.atan(xpc / zpc);
    return new Vector2(Math.cos(phi), Math.sin(phi)).scale(r);
  }
  private f_c(alpha: number, r: number): number {
    let res: number;
    if (alpha > 0 && alpha < (2 / 3) * Math.PI) {
      res =
        2 * r +
        (1 / 3) *
          Math.pow(alpha, 3) *
          Math.pow((2 / 3) * Math.PI - alpha, 4) *
          r;
    } else {
      res = 2 * r;
    }
    return res;
  }
  public getAngle(): number {
    return this.angle;
  }
  private fd_c(alpha: number, r: number): number {
    let res: number;
    if (alpha > 0 && alpha < (2 / 3) * Math.PI) {
      res =
        (Math.pow(alpha, 2) * Math.pow((2 / 3) * Math.PI - alpha, 4) -
          (4 / 3) *
            Math.pow((2 / 3) * Math.PI - alpha, 3) *
            Math.pow(alpha, 3)) *
        r;
    } else {
      res = 0;
    }
    return res;
  }

  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Circle:
        let circle = geometry as Circle;
        let res = ShortestDistance2D.ConvexCircle_Circle(this, circle);
        return [
          new Vector3(res[0].x, res[0].y, 0),
          new Vector3(res[1].x, res[1].y, 0),
        ];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }

  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Shortest distance 3D not implemented for this geometry type."
      );
    } else if (isGeometryType2D(geometry.type)) {
      res = this.ShortestDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
}
