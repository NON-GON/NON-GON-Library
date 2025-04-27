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
import { Ellipsoid } from "../3D/Ellipsoid";
import { Ellipse } from "./Ellipse";
import { Geometry2DBase } from "./Geometry2DBase";
import { MinimumDistance2D } from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
import { MinimumDistance3D } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";

export class Point extends Geometry2DBase implements IGeometry2D {
  segments: number = 1;
  type: GeometryType2D = GeometryType2D.Point;

  constructor(center: Vector3 | Vector2) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
  }

  getGeometry(): Vector2 {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Point Geometry");
      const points = [this.center];
      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.normalizeGeometry();
      return this.geometry;
    }
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Ellipsoid:
        let vec3 = new Vector3(this.center.x, this.center.y, 0);
        let res = MinimumDistance3D.point_Ellipsoid(
          vec3,
          geometry as Ellipsoid
        );
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
        let res = MinimumDistance2D.pointEllipseObj(
          this.center,
          geometry as Ellipse
        );
        return [
          new Vector3(res[0].x, res[0].y, res[0].z),
          new Vector3(res[1].x, res[1].y, res[1].z),
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
