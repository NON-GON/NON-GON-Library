import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import * as THREE from "three";
import {
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { superellipseLine } from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
import { Superellipse } from "./Superellipse";

export class Line implements IGeometry2D {
  center: Vector2;
  segments: number;
  type: GeometryType2D;
  rotation: number;
  private geometry: any = null; // Placeholder for geometry object
  start: Vector2;
  end: Vector2;

  constructor(start: Vector2, end: Vector2, rotation: number = 0) {
    this.start = start;
    this.end = end;
    this.center = new Vector2((start.x + end.x) / 2, (start.y + end.y) / 2);
    this.segments = 1; // A line has one segment by default
    this.type = GeometryType2D.Line;
    this.rotation = rotation;
  }

  TransformDirection(direction: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      direction.x * cos - direction.y * sin,
      direction.x * sin + direction.y * cos
    );
  }
  InverseTransformPoint(point: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      point.x * cos + point.y * sin,
      -point.x * sin + point.y * cos
    );
  }
  TransformPoint(point: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      point.x * cos - point.y * sin + this.center.x,
      point.x * sin + point.y * cos + this.center.y
    );
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Line Geometry");
      const points = [this.start, this.end];
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      return this.geometry;
    }
  }

  getCenter(): Vector2 {
    return this.center;
  }

  MinimumDistance2D(geometry: IGeometry2D): [Vector2, Vector2] {
    switch (geometry.type) {
      case GeometryType2D.Supperellipse:
        let res = superellipseLine(this, geometry as Superellipse);
        return [res[0], res[1]];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
    }
  }

  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      throw new Error("Minimum distance not implemented for 3D geometries.");
    } else if (isGeometryType2D(geometry.type)) {
      const temp = this.MinimumDistance2D(geometry as IGeometry2D);
      res = [
        new Vector3(temp[0].x, temp[0].y, 0),
        new Vector3(temp[1].x, temp[1].y, 0),
      ];
    }
    return [res[0], res[1]];
  }
}
