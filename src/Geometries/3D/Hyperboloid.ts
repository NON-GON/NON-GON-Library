import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";

export class Hyperboloid extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly zfactor: number;
  readonly height: number;
  public type: GeometryType3D = GeometryType3D.Hyperboloid;

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zfactor: number,
    height: number,
    rotation: Vector3,
    segments: number
  ) {
    super();
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zfactor = zfactor; // Controls how quickly it narrows/widens vertically
    this.height = height;
    this.rotation = rotation;
    this.segments = segments;
  }
  MinimumDistance(_geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error("Minimum distance for Hyperboloid is not implemented yet.");
  }

  public forward(): Vector3 {
    const x = Math.cos(this.rotation.y) * Math.cos(this.rotation.x);
    const y = Math.sin(this.rotation.x);
    const z = Math.sin(this.rotation.y) * Math.cos(this.rotation.x);
    return new Vector3(x, y, z).normalize();
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Hyperboloid Geometry");

      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];

      const radialSegments = this.segments;
      const heightSegments = this.segments;

      for (let j = 0; j <= heightSegments; j++) {
        const v = j / heightSegments;
        const z = (v - 0.5) * this.height; // from -height/2 to +height/2

        const r = Math.sqrt(1 + (z * z) / (this.zfactor * this.zfactor));
        const radiusX = this.xradius * r;
        const radiusY = this.yradius * r;

        for (let i = 0; i <= radialSegments; i++) {
          const u = i / radialSegments;
          const theta = u * 2 * Math.PI;

          const x = radiusX * Math.cos(theta);
          const y = radiusY * Math.sin(theta);

          vertices.push(x, y, z);
        }
      }

      for (let j = 0; j < heightSegments; j++) {
        for (let i = 0; i < radialSegments; i++) {
          const a = i + (radialSegments + 1) * j;
          const b = i + (radialSegments + 1) * (j + 1);
          const c = i + 1 + (radialSegments + 1) * (j + 1);
          const d = i + 1 + (radialSegments + 1) * j;

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      this.geometry = geometry;
      this.normalizeGeometry();

      return this.geometry;
    }
  }
}
