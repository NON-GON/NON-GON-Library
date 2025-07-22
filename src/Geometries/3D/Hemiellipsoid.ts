import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { GeometryType3D } from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";

export class HemiEllipsoid extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  public type: GeometryType3D = GeometryType3D.HemiEllipsoid;

  constructor(
    center: Vector3,
    a: number,
    b: number,
    c: number,
    rotation: Vector3,
    segments: number
  ) {
    super();
    this.center = center;
    this.xradius = a;
    this.yradius = b;
    this.zradius = c;
    this.rotation = rotation;
    this.segments = segments;
  }

  private generatingPotential(phi: number, theta: number): number {
    return Math.sqrt(
      this.xradius ** 2 * Math.sin(phi) ** 2 * Math.cos(theta) ** 2 +
        this.yradius ** 2 * Math.sin(phi) ** 2 * Math.sin(theta) ** 2 +
        this.zradius ** 2 * Math.cos(phi) ** 2
    );
  }

  private normalParameterization(phi: number, theta: number): Vector3 {
    const g = this.generatingPotential(phi, theta);

    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    const dg_dphi =
      (this.xradius ** 2 * sinPhi * cosPhi * cosTheta ** 2 +
        this.yradius ** 2 * sinPhi * cosPhi * sinTheta ** 2 -
        this.zradius ** 2 * sinPhi * cosPhi) /
      g;

    const dg_dtheta =
      (-(this.xradius ** 2 * sinPhi ** 2 * sinTheta * cosTheta) +
        this.yradius ** 2 * sinPhi ** 2 * sinTheta * cosTheta) /
      g;

    const e_phi = new THREE.Vector3(
      cosPhi * cosTheta,
      cosPhi * sinTheta,
      -sinPhi
    );
    const e_theta = new THREE.Vector3(-sinTheta, cosTheta, 0);
    const e_n = new THREE.Vector3(sinPhi * cosTheta, sinPhi * sinTheta, cosPhi);

    let r_BP: Vector3;

    if (phi > 0 && phi < Math.PI) {
      r_BP = new THREE.Vector3()
        .addScaledVector(e_phi, dg_dphi)
        .addScaledVector(e_theta, dg_dtheta / sinPhi)
        .addScaledVector(e_n, g);
    } else {
      r_BP = new THREE.Vector3(0, 0, Math.sign(cosPhi) * this.zradius);
    }

    // Apply rotation if needed (currently not rotated)
    return r_BP.add(this.center);
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    }

    console.log("Creating Hemiellipsoid Geometry");

    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    const nPhi = this.segments;
    const nTheta = this.segments;

    for (let i = 0; i <= nPhi; i++) {
      const phi = (i / nPhi) * (Math.PI / 2); // upper hemisphere
      for (let j = 0; j <= nTheta; j++) {
        const theta = (j / nTheta) * 2 * Math.PI;
        const point = this.normalParameterization(phi, theta);
        vertices.push(point.x, point.y, point.z);
      }
    }

    for (let i = 0; i < nPhi; i++) {
      for (let j = 0; j < nTheta; j++) {
        const a = i * (nTheta + 1) + j;
        const b = a + nTheta + 1;
        const c = b + 1;
        const d = a + 1;
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
