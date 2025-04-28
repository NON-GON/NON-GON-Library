import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";

export class EllipticParaboloid extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly height: number;
  public type: GeometryType3D = GeometryType3D.EllipticParaboloid;

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    height: number,
    rotation: Vector3,
    segments: number
  ) {
    super();
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.height = height;
    this.rotation = rotation;
    this.segments = segments;
  }

  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error("Minimum distance not implemented for this geometry type.");
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Elliptic Paraboloid Geometry");

      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];

      const radialSegments = this.segments;
      const heightSegments = this.segments;

      for (let j = 0; j <= heightSegments; j++) {
        const v = j / heightSegments;
        const z = v * this.height;
        const radiusX = (Math.sqrt(z) * this.xradius) / Math.sqrt(this.height);
        const radiusY = (Math.sqrt(z) * this.yradius) / Math.sqrt(this.height);

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
