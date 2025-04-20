import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import {
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { superellipseLine } from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
import { Line } from "./Line";

export class Superellipse implements IGeometry2D {
  readonly center: Vector2;
  readonly xradius: number;
  readonly yradius: number;
  readonly segments: number;
  readonly exponent: number;
  private geometry: any = null;
  public rotation: number = 0;
  public type: GeometryType2D = GeometryType2D.Supperellipse;

  constructor(
    center: Vector2,
    xradius: number,
    yradius: number,
    segments: number,
    exponent: number // n in superellipse formula
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.segments = segments;
    this.exponent = exponent;
    this.geometry = null;
  }

  InverseTransformDirection(direction: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      direction.x * cos + direction.y * sin,
      -direction.x * sin + direction.y * cos
    );
  }
  TransformPoint(point: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      point.x * cos - point.y * sin + this.center.x,
      point.x * sin + point.y * cos + this.center.y
    );
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Superellipse Geometry");

      const points: Vector2[] = [];

      for (let i = 0; i <= this.segments; i++) {
        const theta = (i / this.segments) * 2 * Math.PI;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        // Apply superellipse formula
        const x =
          this.xradius *
          Math.sign(cosTheta) *
          Math.pow(Math.abs(cosTheta), 2 / this.exponent);
        const y =
          this.yradius *
          Math.sign(sinTheta) *
          Math.pow(Math.abs(sinTheta), 2 / this.exponent);

        points.push(new THREE.Vector2(x + this.center.x, y + this.center.y));
      }

      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
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
  public getExponent(): number {
    return this.exponent;
  }

  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Line:
        const res = superellipseLine(geometry as Line, this);
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
      throw new Error("Minimum distance not implemented for 3D geometries.");
    } else if (isGeometryType2D(geometry.type)) {
      res = this.MinimumDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
}
