import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import { Plane } from "../2D/Plane";
import {
  GeometryType2D,
  GeometryType3D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { ShortestDistance3D } from "../../Calc/Shortest_Distance/Shortest_Distance_3D";
import { Geometry3DBase } from "./Geometry3DBase";

export class Superellipsoid extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  readonly e1: number;
  readonly e2: number;
  readonly segments: number;
  private segmentsU: number = 40;
  private segmentsV: number = 80;
  public type: GeometryType3D = GeometryType3D.Superellipsoid;

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zradius: number,
    e1: number,
    e2: number,
    rotation: Vector3,
    segments: number = 80
  ) {
    super();
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.e1 = e1;
    this.e2 = e2;
    this.rotation = rotation;
    this.segments = segments;
    this.segmentsU = segments / 2;
    this.segmentsV = segments;
  }

  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Shortest distance 3D not implemented for this pairs of geometries."
      );
    } else if (isGeometryType2D(geometry.type)) {
      res = this.ShortestDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Plane:
        let res = ShortestDistance3D.superellipsoidPlane(
          geometry as Plane,
          this
        );
        return [res[0], res[1]];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Superellipsoid Geometry");
      console.log(this.segmentsU, this.segmentsV);

      const n1 = this.e1 ?? 2;
      const n2 = this.e2 ?? 2;
      const a = this.xradius ?? 1;
      const b = this.yradius ?? 1;
      const c = this.zradius ?? 1;

      const vertices: number[] = [];
      const indices: number[] = [];

      const sign = (x: number) => (x < 0 ? -1 : 1);
      const exp = (base: number, p: number) =>
        sign(base) * Math.pow(Math.abs(base), p);

      for (let i = 0; i <= this.segmentsU; i++) {
        const v = -Math.PI / 2 + (i / this.segmentsU) * Math.PI;
        for (let j = 0; j <= this.segmentsV; j++) {
          const u = -Math.PI + (j / this.segmentsV) * 2 * Math.PI;

          const x = a * exp(Math.cos(v), n1) * exp(Math.cos(u), n2);
          const y = b * exp(Math.cos(v), n1) * exp(Math.sin(u), n2);
          const z = c * exp(Math.sin(v), n1);

          vertices.push(x, y, z);
        }
      }

      // Create indices for the triangles
      for (let i = 0; i < this.segmentsU; i++) {
        for (let j = 0; j < this.segmentsV; j++) {
          const a = i * (this.segmentsV + 1) + j;
          const b = i * (this.segmentsV + 1) + (j + 1);
          const c = (i + 1) * (this.segmentsV + 1) + j;
          const d = (i + 1) * (this.segmentsV + 1) + (j + 1);

          indices.push(a, b, d);

          indices.push(a, d, c);
        }
      }

      // Create BufferGeometry
      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      this.geometry.setIndex(indices);
      this.geometry.computeVertexNormals();
      this.normalizeGeometry();

      return this.geometry;
    }
  }

  public getExponent(): [number, number] {
    return [this.e1, this.e2];
  }

  public point(theta: number, phi: number): Vector3 {
    const sign = (x: number) => (x < 0 ? -1 : 1);
    const exp = (base: number, p: number) =>
      sign(base) * Math.pow(Math.abs(base), p);

    const x =
      this.xradius *
      exp(Math.cos(theta), this.e1) *
      exp(Math.cos(phi), this.e2);
    const y =
      this.yradius *
      exp(Math.sin(theta), this.e1) *
      exp(Math.cos(phi), this.e2);
    const z = this.zradius * exp(Math.sin(phi), this.e2);

    return new Vector3(x, y, z);
  }
}
