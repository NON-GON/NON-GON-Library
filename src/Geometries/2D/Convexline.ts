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
import { ShortestDistance2D } from "../../Calc/Shortest_Distance/Shortest_Distance_2D";
import { Line } from "./Line";
export class ConvexLine extends Geometry2DBase implements IGeometry2D {
  private angle: number = -Math.PI / 2;
  readonly segments: number;
  public type: GeometryType2D = GeometryType2D.ConvexLine;
  constructor(
    center: Vector3 | Vector2,
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
    this.segments = segments;
  }
  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      this.angle = -Math.PI / 2; 
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
        this.angle += (2 * Math.PI) / this.segments;
      }
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.normalizeGeometry();
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

  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Line:
        let line = geometry as Line;
        let res = ShortestDistance2D.Convex_Line(this, line);
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
