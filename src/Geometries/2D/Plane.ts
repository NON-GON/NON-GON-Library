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
import { MinimumDistance3D } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";

export class Plane extends Geometry2DBase implements IGeometry2D {
  type: GeometryType2D = GeometryType2D.Plane;
  width: number;
  height: number;

  constructor(
    center: Vector2 | Vector3,
    rotation: Vector3,
    width: number,
    height: number,
    segments: number
  ) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation = rotation;
    this.segments = segments;
    this.rotation = rotation;
    this.width = width;
    this.height = height;
  }

  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      res = this.MinimumDistance3D(geometry as IGeometry3D);
    } else if (isGeometryType2D(geometry.type)) {
      throw new Error("Minimum distance not implemented for 2D geometries.");
    }
    return [res[0], res[1]];
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Superellipsoid:
        let res = MinimumDistance3D.superellipsoidPlane(
          this,
          geometry as Superellipsoid
        );
        return [res[0], res[1]];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
        );
    }
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
