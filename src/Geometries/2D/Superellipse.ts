import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { IGeometry3D } from "../3D/IGeometry3D";
import { Vector2, Vector3 } from "../../Calc/Util/Utils";
import {
  GeometryType2D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Line } from "./Line";
import { Geometry2DBase } from "./Geometry2DBase";
import { ShortestDistance2D } from "../../Calc/Shortest_Distance/Shortest_Distance_2D";
export class Superellipse extends Geometry2DBase implements IGeometry2D {
  readonly xradius: number;
  readonly yradius: number;
  readonly segments: number;
  readonly e: number;
  public type: GeometryType2D = GeometryType2D.Supperellipse;

  constructor(
    center: Vector2 | Vector3,
    xradius: number,
    yradius: number,
    exponent: number,
    rotation: Vector2 | Vector3,
    segments: number
  ) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation =
      rotation instanceof Vector2
        ? new Vector3(rotation.x, rotation.y, 0)
        : rotation;
    this.xradius = xradius;
    this.yradius = yradius;
    this.e = exponent;
    this.segments = segments;
    this.geometry = null;
  }

  getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      const n = this.e ?? 2; // exponent for superellipse
      const a = this.xradius ?? 1; // horizontal radius
      const b = this.yradius ?? 1; // vertical radius
      const segments = this.segments ?? 64;

      const points: Vector3[] = [];

      const sign = (x: number) => (x < 0 ? -1 : 1);
      const exp = (base: number, p: number) =>
        sign(base) * Math.pow(Math.abs(base), p);

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        const x = a * exp(Math.cos(theta), n) + this.center.x;
        const y = b * exp(Math.sin(theta), n) + this.center.y;
        points.push(new Vector3(x, y, 0)); // z = 0 for 2D shape
      }

      this.geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.normalizeGeometry();
      return this.geometry;
    }
  }

  public getRadius(): Vector2 {
    return new Vector2(this.xradius, this.yradius);
  }
  public getExponent(): number {
    return this.e;
  }

  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Line:
        const res = ShortestDistance2D.superellipseLine(geometry as Line, this);
        return [
          new Vector3(res[0].x, res[0].y, res[0].z),
          new Vector3(res[1].x, res[1].y, res[1].z),
        ];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }

  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      throw new Error("Shortest distance not implemented for 3D geometries.");
    } else if (isGeometryType2D(geometry.type)) {
      res = this.ShortestDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
}
