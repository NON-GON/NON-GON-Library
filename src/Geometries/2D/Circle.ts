import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import { Vector2 } from "../../Calc/Util/Utils";
import {
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Vector3 } from "../../Calc/Util/Utils";
import { Geometry2DBase } from "./Geometry2DBase";
import { Convexcircle } from "./Convexcircle";
import { MinimumDistance2D } from "../../Calc/Minimum_Distance/Minimum_Distance_2D";

export class Circle extends Geometry2DBase implements IGeometry2D {
  readonly radius: number;
  public type: GeometryType2D = GeometryType2D.Circle;

  constructor(
    center: Vector3 | Vector2,
    radius: number,
    rotation: Vector3 | Vector2,
    segments: number
  ) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation =
      rotation instanceof Vector2
        ? new Vector3(rotation.x, rotation.y, 0)
        : rotation;
    this.radius = radius;
    this.segments = segments;
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipse Geometry");
      let curve = new THREE.EllipseCurve(
        this.center.x,
        this.center.y,
        this.radius,
        this.radius,
        0,
        2 * Math.PI,
        false,
        0
      );
      this.geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(this.segments)
      );
      this.normalizeGeometry();
      return this.geometry;
    }
  }
  public getRadius(): number {
    return this.radius;
  }

  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.ConvexCircle:
        let convexcircle = geometry as Convexcircle;
        let res = MinimumDistance2D.ConvexCircle_Circle(convexcircle, this);
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
      throw new Error(
        "Minimum distance 3D not implemented for this geometry type."
      );
    } else if (isGeometryType2D(geometry.type)) {
      res = this.MinimumDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
}
