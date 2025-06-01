import * as THREE from "three";
import { Vector3,degToRad } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import {
  GeometryType2D,
  GeometryType3D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";
import { Plane } from "../2D/Plane";
import { ProximityQuery3D } from "../../Calc/ProximityQuery/ProximityQuery3D";

export class Hyperboloid extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly zfactor: number;
  readonly height: number;
  public hyperboloidType: "one-sheeted" | "two-sheeted";
  public type: GeometryType3D = GeometryType3D.Hyperboloid;

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zfactor: number,
    height: number,
    rotation: Vector3,
    hyperboloidType: "one-sheeted" | "two-sheeted" = "one-sheeted",
    segments: number
  ) {
    super();
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zfactor = zfactor; // Controls how quickly it narrows/widens vertically
    this.height = height;
    this.rotation = rotation;
    this.hyperboloidType = hyperboloidType;
    this.segments = segments;
  }
  ShortestDistance(_geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error(
      "Shortest distance for Hyperboloid is not implemented yet."
    );
  }
  ProximityQuery(
    _geometry: IGeometry3D | IGeometry2D,
    _method?: string
  ): boolean {
    if (isGeometryType3D(_geometry.type)) {
      throw new Error(
        "Proximity query 3D not implemented for this geometry type."
      );
    } else if (isGeometryType2D(_geometry.type)) {
      return this.ProximityQuery2D(_geometry as IGeometry2D);
    }
    return false;
  }

  ProximityQuery2D(geometry: IGeometry2D): boolean {
    if (geometry.type === GeometryType2D.Plane) {
      return ProximityQuery3D.Hyperboloid_Plane(this, geometry as Plane);
    }
    throw new Error("Proximity query not implemented for this geometry type.");
  }

  public forward(): Vector3 {
    let radX = degToRad(this.rotation.x);
    let radY = degToRad(this.rotation.y);
    let radZ = degToRad(this.rotation.z);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(radX, radY, radZ)
    );
    const forward = new THREE.Vector3(0, 0, 1).applyMatrix4(rotationMatrix); // Z-forward
    return new Vector3(forward.x, forward.y, forward.z).normalize();
  }

  private getHyperboloidTypeTwoSheeted(): any {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    const radialSegments = this.segments;
    const heightSegments = this.segments;

    const minZ = this.zfactor * 1.01; // Avoid z = zfactor for r = 0
    const maxZ = this.height / 2;

    const generateSheet = (sign: number) => {

      // Add tip vertex
      const epsilon = 1e-4;
      const tipZ = sign * minZ;
      const tipX = sign > 0 ? epsilon : -epsilon; // offset top and bottom tips slightly

      vertices.push(tipX, 0, tipZ);
      const tipIndex = vertices.length / 3 - 1;

      // Generate ring vertices
      for (let j = 0; j <= heightSegments; j++) {
        const v = j / heightSegments;
        const z = minZ + (maxZ - minZ) * v;
        const zSigned = sign * z;

        const r = Math.sqrt((z * z) / (this.zfactor * this.zfactor) - 1);
        const radiusX = this.xradius * r;
        const radiusY = this.yradius * r;

        for (let i = 0; i <= radialSegments; i++) {
          const theta = (i / radialSegments) * 2 * Math.PI;
          const x = radiusX * Math.cos(theta);
          const y = radiusY * Math.sin(theta);
          vertices.push(x, y, zSigned);
        }
      }

      const ringStart = tipIndex + 1;

      // Side faces
      for (let j = 0; j < heightSegments; j++) {
        for (let i = 0; i < radialSegments; i++) {
          const a = ringStart + i + j * (radialSegments + 1);
          const b = ringStart + i + (j + 1) * (radialSegments + 1);
          const c = ringStart + i + 1 + (j + 1) * (radialSegments + 1);
          const d = ringStart + i + 1 + j * (radialSegments + 1);

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      // Cap triangles (connect tip to base ring)
      for (let i = 0; i < radialSegments; i++) {
        const a = tipIndex;
        const b = ringStart + i;
        const c = ringStart + i + 1;

        if (sign > 0) {
          indices.push(a, b, c); // top
        } else {
          indices.push(a, c, b); // bottom
        }
      }
    };

    // Create both sheets
    generateSheet(1); // top
    generateSheet(-1); // bottom

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

  private getHyperboloidTypeOneSheeted(): any {
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

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      if (this.hyperboloidType === "one-sheeted") {
        return this.getHyperboloidTypeOneSheeted();
      } else if (this.hyperboloidType === "two-sheeted") {
        return this.getHyperboloidTypeTwoSheeted();
      }
    }
  }
}
