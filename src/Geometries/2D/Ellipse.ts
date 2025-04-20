import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import {
  ellipseEllipse,
  pointEllipseObj,
} from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import { Vector3 } from "../../Calc/Util/Utils";
import { isGeometryType2D, isGeometryType3D } from "../GeoTypes";
import { Point } from "./Point";

export class Ellipse implements IGeometry2D {
  readonly center: Vector2;
  readonly xradius: number;
  readonly yradius: number;
  readonly segments: number;
  private geometry: any = null;
  public rotation: number = 0; // TODO: Implement rotation
  public type: GeometryType2D = GeometryType2D.Ellipse;

  constructor(
    center: Vector2,
    xradius: number,
    yradius: number,
    segments: number
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.segments = segments;
    this.geometry = null;
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipse Geometry");
      let curve = new THREE.EllipseCurve(
        this.center.x,
        this.center.y,
        this.xradius,
        this.yradius,
        0,
        2 * Math.PI,
        false,
        0
      );
      this.geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(this.segments)
      );
      return this.geometry;
    }
  }

  public getCenter(): Vector2 {
    return this.center;
  }
  public getRadius(): Vector2 {
    return new Vector2(this.xradius, this.yradius);
  }
  public getSegments(): number {
    return this.segments;
  }

  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Point:
        let point = geometry as Point;
        let res = pointEllipseObj(
          new Vector2(point.center.x, point.center.y),
          this
        );
        return [
          new Vector3(res[0].x, res[0].y, 0),
          new Vector3(res[1].x, res[1].y, 0),
        ];
      case GeometryType2D.Ellipse:
        let ellipse = geometry as Ellipse;
        let temp = ellipseEllipse(ellipse, this);
        return [
          new Vector3(temp[0].x, temp[0].y, 0),
          new Vector3(temp[1].x, temp[1].y, 0),
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
