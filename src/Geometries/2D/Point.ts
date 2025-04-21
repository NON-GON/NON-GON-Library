import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import {
  isGeometryType2D,
  isGeometryType3D,
  GeometryType3D,
  GeometryType2D,
} from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";
import * as THREE from "three";
import { IGeometry3D } from "../3D/IGeometry3D";
import { point_Ellipsoid } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";
import { Ellipsoid } from "../3D/Ellipsoid";
import { pointEllipseObj } from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
import { Ellipse } from "./Ellipse";

export class Point implements IGeometry2D {
  center: Vector2;
  segments: number = 0;
  type: GeometryType2D = GeometryType2D.Point;
  rotation: number = 0;
  private geometry: any = null;

  constructor(center: Vector2) {
    this.center = center;
  }

  getGeometry(): Vector2 {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Point Geometry");
      const points = [this.center];
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      return this.geometry;
    }
  }

  getCenter(): Vector2 {
    return this.center;
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Ellipsoid:
        let vec3 = new Vector3(this.center.x, this.center.y, 0);
        let res = point_Ellipsoid(vec3, geometry as Ellipsoid);
        return [res[0], res[1]];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
    }
  }
  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Ellipse:
        let res = pointEllipseObj(this.center, geometry as Ellipse);
        return [
          new Vector3(res[0].x, res[0].y, 0),
          new Vector3(res[1].x, res[1].y, 0),
        ];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
    }
  }
  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      res = this.MinimumDistance3D(geometry as IGeometry3D);
    } else if (isGeometryType2D(geometry.type)) {
      res = this.MinimumDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
}
