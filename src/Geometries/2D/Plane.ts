import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import {
  GeometryType3D,
  isGeometryType3D,
  isGeometryType2D,
} from "../GeoTypes";
import * as THREE from "three";
import { Superellipsoid } from "../3D/Superellipsoid";
import { Geometry2DBase } from "./Geometry2DBase";
import { ShortestDistance3D } from "../../Calc/Shortest_Distance/Shortest_Distance_3D";
import { Convex } from "../3D/Convex";
import { ProximityQuery3D } from "../../Calc/ProximityQuery/ProximityQuery3D";
import { Hyperboloid } from "../3D/Hyperboloid";

export class Plane extends Geometry2DBase implements IGeometry2D {
  type: GeometryType2D = GeometryType2D.Plane;
  width: number;
  height: number;

  //WARNING: This is a infinity plane in the mathematical sense but in the visualization
  // it is a rectangle with width and height so the MD and PQ take the mathematical sense but the
  // visualization is a rectangle and can seem wrong.

  constructor(
    center: Vector2 | Vector3,
    rotation: Vector3,
    segments: number
  ) {
    
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation = rotation;
    this.segments = segments;
    this.rotation = rotation;
    this.width = 50;
    this.height = 100;
  }

  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      res = this.ShortestDistance3D(geometry as IGeometry3D);
    } else if (isGeometryType2D(geometry.type)) {
      throw new Error("Shortest distance not implemented for 2D geometries.");
    }
    return [res[0], res[1]];
  }

  ShortestDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    switch (geometry.type) {
      case GeometryType3D.Superellipsoid:
        res = ShortestDistance3D.superellipsoidPlane(
          this,
          geometry as Superellipsoid
        );
        return [res[0], res[1]];
      case GeometryType3D.Convex:
        let convex = geometry as Convex;
        res = ShortestDistance3D.AlmostConvexGeometryPlane(convex, this);
        return [res[0], res[1]];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }

  ProximityQuery(
    _geometry: IGeometry2D | IGeometry3D,
    _method?: string
  ): boolean {
    if (isGeometryType3D(_geometry.type)) {
      return this.ProxmityQuery3D(_geometry as IGeometry3D);
    } else if (isGeometryType2D(_geometry.type)) {
      throw new Error(
        "Proximity query 2D not implemented for this geometry type."
      );
    }
    return false;
  }

  public ProxmityQuery3D(geometry: IGeometry3D): boolean {
    if (geometry.type === GeometryType3D.Hyperboloid) {
      return ProximityQuery3D.Hyperboloid_Plane(
        geometry as Hyperboloid,
        this as Plane
      );
    }
    throw new Error("Proximity query not implemented for this geometry type.");
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Plane Geometry");
      let plane = new THREE.PlaneGeometry(
        this.width,
        this.height,
        this.segments,
        this.segments
      );
      plane.rotateX(Math.PI / 2);
      plane.translate(this.center.x, this.center.y, this.center.z);
      this.geometry = plane;
    }
    this.normalizeGeometry();
    return this.geometry;
  }

  public getNormal(): Vector3 {
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(this.rotation.x, this.rotation.y, this.rotation.z)
    );
    const normal = new THREE.Vector3(0, 0, 1).applyMatrix4(rotationMatrix);
    return new Vector3(normal.x, normal.y, normal.z);
  }
}
