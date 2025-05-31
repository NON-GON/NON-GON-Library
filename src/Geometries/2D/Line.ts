import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import * as THREE from "three";
import {
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Superellipse } from "./Superellipse";
import { Geometry2DBase } from "./Geometry2DBase";
import { ShortestDistance2D } from "../../Calc/Shortest_Distance/Shortest_Distance_2D";
import { ConvexLine } from "./Convexline";

export class Line extends Geometry2DBase implements IGeometry2D {
  segments: number;
  type: GeometryType2D;
  start: Vector3;
  end: Vector3;

  constructor(
    start: Vector2 | Vector3,
    end: Vector2 | Vector3,
    rotation: Vector3 | Vector2
  ) {
    super();
    this.start =
      start instanceof Vector2 ? new Vector3(start.x, start.y, 0) : start;
    this.end = end instanceof Vector2 ? new Vector3(end.x, end.y, 0) : end;
    if (this.start instanceof Vector3 || this.end instanceof Vector3) {
      this.center = new Vector3(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        (start.toVector3().z + end.toVector3().z) / 2
      );
    }
    this.segments = 1; // A line has one segment by default
    this.type = GeometryType2D.Line;
    this.rotation =
      rotation instanceof Vector2
        ? new Vector3(rotation.x, rotation.y, 0)
        : rotation;
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Line Geometry");
      console.log(this.start, this.end);
      let points = [
        new THREE.Vector3(this.start.x, this.start.y, this.start.z),
        new THREE.Vector3(this.end.x, this.end.y, this.end.z),
      ];
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      //this.geometry.rotateX(this.rotation.x);
      //this.geometry.rotateY(this.rotation.y);
      //this.geometry.rotateZ(this.rotation.z);
      return this.geometry;
    }
  }

  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    switch (geometry.type) {
      case GeometryType2D.Supperellipse:
        res = ShortestDistance2D.superellipseLine(
          this,
          geometry as Superellipse
        );
        return [
          new Vector3(res[0].x, res[0].y, 0),
          new Vector3(res[1].x, res[1].y, 0),
        ];
      case GeometryType2D.ConvexLine:
        let convexline = geometry as ConvexLine;
        res = ShortestDistance2D.Convex_Line(convexline, this);
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
      throw new Error("Shortest distance not implemented for 3D geometries.");
    } else if (isGeometryType2D(geometry.type)) {
      const temp = this.ShortestDistance2D(geometry as IGeometry2D);
      res = [
        new Vector3(temp[0].x, temp[0].y, 0),
        new Vector3(temp[1].x, temp[1].y, 0),
      ];
    }
    return [res[0], res[1]];
  }
}
