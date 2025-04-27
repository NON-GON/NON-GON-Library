import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { Point } from "../2D/Point";
import { IGeometry2D } from "../2D/IGeometry2D";
import {
  GeometryType3D,
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { MinimumDistance3D } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";

export class Ellipsoid implements IGeometry3D {
  readonly center: Vector3;
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  readonly segments: number;
  private geometry: any = null;
  public type: GeometryType3D = GeometryType3D.Ellipsoid;
  public rotation: Vector3 = new Vector3(0, 0, 0); // Rotation angles in radians

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zradius: number,
    segments: number
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.segments = segments;
    this.geometry = null;
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Ellipsoid:
        const res = MinimumDistance3D.ellipsoidEllipsoid(this, geometry as Ellipsoid);
        return [res[0], res[1]];
      case GeometryType3D.Sphere:
        const res1 = MinimumDistance3D.ellipsoidEllipsoid(this, geometry as Ellipsoid);
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
