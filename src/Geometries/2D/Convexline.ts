import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { Geometry2DBase } from "./Geometry2DBase";
import { IGeometry2D } from "./IGeometry2D";
import * as THREE from "three";
export class ConvexLine extends Geometry2DBase implements IGeometry2D {
  private angle: number = -Math.PI / 2;
  readonly segments: number;
  public type: GeometryType2D = GeometryType2D.ConvexLine;
  constructor(
    rotation: Vector3 | Vector2,
    center: Vector3 | Vector2,
    segments: number,
  ) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation =
      rotation instanceof Vector2
        ? new Vector3(rotation.x, rotation.y, 0)
        : rotation;
    this.segments = segments;
  }
  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      const points: Vector2[] = [];
      for (let i = 0; i <= this.segments + 1; i++) {
        let r = Math.sqrt(
          Math.pow(this.f(this.angle), 2) + Math.pow(this.fd(this.angle), 2)
        );
        let phi =
          this.angle +
          Math.atan2(this.fd(this.angle), this.f(this.angle)) -
          Math.PI / 2;
        let pos = new Vector2(Math.cos(phi), Math.sin(phi));
        points.push(new THREE.Vector2(pos.x * r, pos.y * r));
      }
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.geometry.normalizeGeometry();
      return this.geometry;
    }
  }
  public f(alpha: number): number {
    let res: number;
    if (alpha >= -Math.PI / 2 && alpha <= Math.PI / 2) {
      res =
        10 *
        (1 +
          0.9 * Math.cos(alpha - 0.2 * Math.PI) +
          (1 / 6) * Math.sin(2 * (alpha - 0.2 * Math.PI)) +
          (1 / 15) * Math.sin(3 * (alpha - 0.2 * Math.PI)));
    } else {
      res = 0;
    }
    return res;
  }
  public fd(alpha: number): number {
    let res: number;
    if (alpha >= -Math.PI / 2 && alpha <= Math.PI / 2) {
      res =
        10 *
        (-0.9 * Math.sin(alpha - 0.2 * Math.PI) +
          (1 / 3) * Math.cos(2 * (alpha - 0.2 * Math.PI)) +
          0.2 * Math.cos(3 * (alpha - 0.2 * Math.PI)));
    } else {
      res = 0;
    }
    return res;
  }
}
