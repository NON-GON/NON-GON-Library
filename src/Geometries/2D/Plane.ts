import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import { GeometryType3D, isGeometryType3D, isGeometryType2D } from "../GeoTypes";
import * as THREE from "three";
import { superellipsoidPlane } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";
import { Superellipsoid } from "../3D/Superellipsoid";


export class Plane implements IGeometry2D {
  center: Vector2;
  segments: number;
  type: GeometryType2D = GeometryType2D.Plane;
  private geometry: any = null;
  rotation: number;
  width: number;
  height: number;

  constructor(
    center: Vector2,
    segments: number,
    rotation: number,
    width: number,
    height: number
  ) {
    this.center = center;
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
      throw new Error(
        "Minimum distance not implemented for 2D geometries.");
    }
    return [res[0], res[1]];
  }

  MinimumDistance3D(geometry: IGeometry3D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType3D.Superellipsoid:
        let res = superellipsoidPlane(this, geometry as Superellipsoid);
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
    return this.geometry;
  }

  public getCenter(): Vector2 {
    // Returns the center of the plane
    return this.center;
  }
  
  public getSegments(): number {
    return this.segments;
  }
  TransformPoint(point: Vector2): Vector2 {
    // Transforms a point from world coordinates to local coordinates
    const transformedPoint = new Vector2(
      point.x - this.center.x,
      point.y - this.center.y
    );
    return transformedPoint;
  }

  TransformDirection(direction: Vector2 | Vector3): Vector2 | Vector3 {
    // Transforms a direction vector from world coordinates to local coordinates
    if (direction instanceof Vector2) {
      const transformedDirection = new Vector2(
        direction.x * Math.cos(this.rotation) -
          direction.y * Math.sin(this.rotation),
        direction.x * Math.sin(this.rotation) +
          direction.y * Math.cos(this.rotation)
      );
      return transformedDirection;
    } else if (direction instanceof Vector3) {
      const transformedDirection = new Vector3(
        direction.x * Math.cos(this.rotation) -
          direction.y * Math.sin(this.rotation),
        direction.x * Math.sin(this.rotation) +
          direction.y * Math.cos(this.rotation),
        direction.z // Z-axis remains unchanged for 2D plane rotation
      );
      return transformedDirection;
    }
    throw new Error("Unsupported vector type");
  }

  InverseTransformPoint(point: Vector2): Vector2 {
    // Transforms a point from local coordinates to world coordinates
    const transformedPoint = new Vector2(
      point.x * Math.cos(this.rotation) +
        point.y * Math.sin(this.rotation) +
        this.center.x,
      -point.x * Math.sin(this.rotation) +
        point.y * Math.cos(this.rotation) +
        this.center.y
    );
    return transformedPoint;
  }

  worldToLocal(point: Vector2): Vector2 {
    // Converts a point from world coordinates to local coordinates
    const transformedPoint = new Vector2(
      point.x - this.center.x,
      point.y - this.center.y
    );
    return transformedPoint;
  }

  localToWorld(point: Vector2): Vector3 {
    // Converts a point from local coordinates to world coordinates
    const transformedPoint = new Vector2(
      point.x * Math.cos(this.rotation) -
        point.y * Math.sin(this.rotation) +
        this.center.x,
      point.x * Math.sin(this.rotation) +
        point.y * Math.cos(this.rotation) +
        this.center.y
    );
    return new Vector3(transformedPoint.x, transformedPoint.y, 0);
  }
}
