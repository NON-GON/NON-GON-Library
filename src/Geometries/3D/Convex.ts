import { Vector3, Vector2 } from "../../Calc/Util/Utils";
import {
  GeometryType2D,
  GeometryType3D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import * as THREE from "three";
import { Plane } from "../2D/Plane";
import { ShortestDistance3D } from "../../Calc/Shortest_Distance/Shortest_Distance_3D";

export class Convex extends Geometry3DBase implements IGeometry3D {
  readonly segments: number;
  public type: GeometryType3D = GeometryType3D.Convex;
  constructor(
    center: Vector3 | Vector2,
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
    this.segments = segments;
  }
  getGeometry() {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      const points: Vector3[] = [];
      const indices: number[] = [];

      // Generate vertices
      for (let i = 0; i <= this.segments; i++) {
        const theta = -Math.PI + (2 * Math.PI * i) / this.segments; // x axis
        for (let j = 0; j <= this.segments; j++) {
          const phi = -Math.PI / 2 + (Math.PI * j) / this.segments; // y axis

          let prepoint = this.point(theta, phi);
          // Apply transformation
          prepoint = prepoint.add(this.center).rotate(this.rotation);
          points.push(prepoint);
        }
      }

      // Generate indices for faces
      for (let i = 0; i < this.segments; i++) {
        for (let j = 0; j < this.segments; j++) {
          const a = i * (this.segments + 1) + j;
          const b = i * (this.segments + 1) + (j + 1);
          const c = (i + 1) * (this.segments + 1) + j;
          const d = (i + 1) * (this.segments + 1) + (j + 1);

          // First triangle
          indices.push(a, b, d);

          // Second triangle
          indices.push(a, d, c);
        }
      }

      // Create BufferGeometry
      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          points.flatMap((v) => [v.x, v.y, v.z]),
          3
        )
      );
      this.geometry.setIndex(indices);
      this.geometry.computeVertexNormals(); // Compute normals for lighting
      this.normalizeGeometry();

      return this.geometry;
    }
  }

  public point(theta: number, phi: number): Vector3 {
    let res = Vector3.Zero();

    // Calculate ephi, etheta, and en
    let ephi = new Vector3(
      Math.cos(phi) * Math.cos(theta),
      Math.cos(phi) * Math.sin(theta),
      -Math.sin(phi)
    ).normalize();

    let etheta = new Vector3(-Math.sin(theta), Math.cos(theta), 0).normalize();

    let en = new Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    ).normalize();

    // Calculate res based on phi
    if (phi > 0 && phi < Math.PI) {
      res = ephi
        .scale(this.fda(phi, theta))
        .add(etheta.scale(this.fdb(phi, theta) / Math.sin(phi)))
        .add(en.scale(this.f(phi, theta)));
    } else if (phi === 0 || phi === Math.PI) {
      res = ephi
        .scale(this.fda(phi, theta))
        .add(etheta.scale(this.fdd(phi, theta) / Math.cos(phi)))
        .add(en.scale(this.f(phi, theta)));
    }
    return res;
  }

  private f(alpha: number, beta: number): number {
    let sina = Math.sin(alpha);
    let cosa = Math.cos(alpha);
    let sinb = Math.sin(beta);
    let cosb = Math.cos(beta);
    let res = Math.sqrt(
      100 * sina ** 2 * cosb ** 2 +
        900 * sina ** 2 * sinb ** 2 +
        400 * cosa ** 2
    );
    return res;
  }

  private fda(alpha: number, beta: number): number {
    let sina = Math.sin(alpha);
    let cosa = Math.cos(alpha);
    let sinb = Math.sin(beta);
    let cosb = Math.cos(beta);
    let res =
      ((900 * sinb * sinb + 100 * cosb * cosb - 400) * cosa * sina) /
      Math.sqrt(
        900 * sinb * sinb * sina * sina +
          100 * cosb * cosb * sina * sina +
          400 * cosa * cosa
      );
    return res;
  }

  private fdb(alpha: number, beta: number): number {
    let sina = Math.sin(alpha);
    let cosa = Math.cos(alpha);
    let sinb = Math.sin(beta);
    let cosb = Math.cos(beta);
    let res =
      (800 * sina * sina * cosb * sinb) /
      Math.sqrt(
        900 * sinb * sinb * sina * sina +
          100 * cosb * cosb * sina * sina +
          400 * cosa * cosa
      );
    return res;
  }

  private fdd(alpha: number, beta: number): number {
    let sina = Math.sin(alpha);
    let cosa = Math.cos(alpha);
    let sinb = Math.sin(beta);
    let cosb = Math.cos(beta);
    let res =
      (-800 * sina * sina * sinb * sinb) /
        Math.sqrt(
          900 * sinb * sinb * sina * sina +
            100 * cosb * cosb * sina * sina +
            400 * cosa * cosa
        ) +
      (800 * sina * sina * cosb * cosb) /
        Math.sqrt(
          900 * sina * sina * sinb * sinb +
            100 * sina * sina * cosb * cosb +
            400 * cosa * cosa
        ) -
      (800 *
        sina *
        sina *
        cosb *
        sinb *
        (1800 * sina * sina * cosb * sinb - 200 * sina * sina * cosb * sinb)) /
        (2 *
          Math.pow(
            900 * sina * sina * sinb * sinb +
              100 * sina * sina * cosb * cosb +
              400 * cosa * cosa,
            3 / 2
          ));
    return res;
  }

  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Plane:
        let plane = geometry as Plane;
        const res = ShortestDistance3D.AlmostConvexGeometryPlane(this, plane);
        return [res[0], res[1]];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }

  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    console.log("ShortestDistance3D");
    if (isGeometryType3D(geometry.type)) {
      throw new Error("Not ShortestDistance3D for this geometry type");
    } else if (isGeometryType2D(geometry.type)) {
      this.ShortestDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
}
