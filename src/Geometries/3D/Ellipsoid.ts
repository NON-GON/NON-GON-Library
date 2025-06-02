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
import { ShortestDistance3D } from "../../Calc/Shortest_Distance/Shortest_Distance_3D";
import { Geometry3DBase } from "./Geometry3DBase";
import { ProximityQuery3D } from "../../Calc/ProximityQuery/ProximityQuery3D";
import { EllipticParaboloid } from "./Ellipticparaboloid";

export class Ellipsoid extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  public type: GeometryType3D = GeometryType3D.Ellipsoid;

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zradius: number,
    rotation: Vector3,
    segments: number
  ) {
    super();
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.rotation = rotation;
    this.segments = segments;
  }

  ShortestDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Ellipsoid:
        const res = ShortestDistance3D.ellipsoidEllipsoid(
          this,
          geometry as Ellipsoid
        );
        return [res[0], res[1]];
      case GeometryType3D.Sphere:
        const res1 = ShortestDistance3D.ellipsoidEllipsoid(
          this,
          geometry as Ellipsoid
        );
        return [res1[0], res1[1]];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }
  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Point:
        let point = geometry as Point;
        const res = ShortestDistance3D.point_Ellipsoid(
          new Vector3(point.center.x, point.center.y, point.center.z),
          this
        );
        return [res[0], res[1]];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }
  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      res = this.ShortestDistance3D(geometry as IGeometry3D);
    } else if (isGeometryType2D(geometry.type)) {
      res = this.ShortestDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }

  ProximityQuery(
    geometry: IGeometry3D | IGeometry2D,
    method?: string
  ): boolean {
    if (geometry.type === GeometryType3D.Ellipsoid) {
      return this.ProximityQueryEllipsoid(
        geometry as Ellipsoid,
        method === undefined ? "Caravantes" : method
      );
    } else if (geometry.type === GeometryType3D.EllipticParaboloid) {
      if (method === undefined || method === "Brozos") {
        return ProximityQuery3D.Ellipsoid_EllipticParaboloid_Brozos(
          this,
          geometry as EllipticParaboloid
        );
      }
      throw new Error("Proximity query not implemented for this method.");
    }
    throw new Error(
      "Proximity query not implemented for this pair of geometries."
    );
  }
  ProximityQueryEllipsoid(geometry: IGeometry3D, method?: string): boolean {
    if (method == "Caravantes" || method == undefined) {
      return ProximityQuery3D.Ellipsoid_Ellipsoid_Caravantes(
        this,
        geometry as Ellipsoid
      );
    }
    throw new Error("Proximity query not implemented for this method.");
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
      this.normalizeGeometry();

      return this.geometry;
    }
  }
}
