import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { Point } from "../2D/Point";
import { Ellipsoid } from "./Ellipsoid";
import { IGeometry2D } from "../2D/IGeometry2D";
import {
  GeometryType2D,
  GeometryType3D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { MinimumDistance3D } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";
import { Geometry3DBase } from "./Geometry3DBase";

export class Sphere extends Geometry3DBase implements IGeometry3D {
  readonly radius: number;
  readonly segments: number;
  public type: GeometryType3D = GeometryType3D.Sphere;

  constructor(
    center: Vector3,
    radius: number,
    rotation: Vector3,
    segments: number
  ) {
    super();
    this.center = center;
    this.radius = radius;
    this.rotation = rotation;
    this.segments = segments;
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Ellipsoid:
        const res = MinimumDistance3D.ellipsoidEllipsoid(
          this,
          geometry as Ellipsoid
        );
        return [res[0], res[1]];
      case GeometryType3D.Sphere:
        const res1 = MinimumDistance3D.ellipsoidEllipsoid(
          this,
          geometry as Ellipsoid
        );
        return [res1[0], res1[1]];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
    }
  }
  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Point:
        let point = geometry as Point;
        const res = MinimumDistance3D.point_Ellipsoid(
          new Vector3(point.center.x, point.center.y, 0),
          this
        );
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
      res = this.MinimumDistance3D(geometry as IGeometry3D);
    } else if (isGeometryType2D(geometry.type)) {
      res = this.MinimumDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipsoid Geometry");
      const sphereGeometry = new THREE.SphereGeometry(
        this.radius,
        this.segments,
        this.segments
      );
      this.geometry = sphereGeometry;
      this.normalizeGeometry();

      return this.geometry;
    }
  }
}
