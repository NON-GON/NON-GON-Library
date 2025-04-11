import * as THREE from "three";
import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { Ellipse } from "../2D/Ellipse";
import { Superellipse } from "../2D/Superellipse";
import { Point } from "../2D/Point";
import { Ellipsoid } from "./Ellipsoid";
import {
  ellipsoidEllipsoid,
  point_Ellipsoid,
} from "../../Calc/Minimum_Distance/Minimum_Distance_3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import {
  GeometryType3D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
export class Sphere implements IGeometry3D {
  readonly center: Vector3;
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  readonly segments: number;
  private geometry: any = null;
  public type: GeometryType3D = GeometryType3D.Sphere;
  public rotation: Vector3 = new Vector3(0, 0, 0); // Rotation angles in radians

  constructor(center: Vector3, radius: number, segments: number) {
    this.center = center;
    this.xradius = radius;
    this.yradius = radius;
    this.zradius = radius;
    this.segments = segments;
    this.geometry = null;
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Ellipsoid:
        const res = ellipsoidEllipsoid(this, geometry as Ellipsoid);
        return [res[0], res[1]];
      case GeometryType3D.Sphere:
        const res1 = ellipsoidEllipsoid(this, geometry as Ellipsoid);
        return [res1[0], res1[1]];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
    }
  }
  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.constructor) {
      case Point:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
      case Ellipse:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
      case Superellipse:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
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
        1,
        this.segments,
        this.segments
      );
      sphereGeometry.scale(this.xradius, this.yradius, this.zradius);
      this.geometry = sphereGeometry;

      // Position the geometry at the ellipsoid's center
      this.geometry.translate(this.center.x, this.center.y, this.center.z);

      return this.geometry;
    }
  }

  public getCenter(): Vector3 {
    return this.center;
  }

  public getRadii(): Vector3 {
    return new Vector3(this.xradius, this.yradius, this.zradius);
  }

  public getSegments(): number {
    return this.segments;
  }
}
