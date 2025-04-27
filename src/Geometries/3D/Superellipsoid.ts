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
import { MinimumDistance3D } from "../../Calc/Minimum_Distance/Minimum_Distance_3D";


export class Superellipsoid implements IGeometry3D {
  readonly center: Vector3;
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  readonly e1: number;
  readonly e2: number;
  readonly segments: number;
  private segmentsU: number = 40;
  private segmentsV: number = 80;
  private geometry: any = null;
  public type: GeometryType3D = GeometryType3D.Superellipsoid;
  public rotation: Vector3 = new Vector3(0, 0, 0); // Rotation angles in radians

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zradius: number,
    e1: number,
    e2: number,
    segments: number = 80
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.e1 = e1;
    this.e2 = e2;
    this.segments = segments;
    this.geometry = null;
    this.segmentsU = segments/2;
    this.segmentsV = segments;
  }

  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Minimum distance 3D not implemented for this pairs of geometries."
      );
    } else if (isGeometryType2D(geometry.type)) {
      res = this.MinimumDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
  MinimumDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Plane:
        let res = MinimumDistance3D.superellipsoidPlane(geometry as Plane, this);
        return [res[0], res[1]];
      default:
        throw new Error(
          "Minimum distance not implemented for this geometry type."
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


      const points: Vector3[] = [];

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

          points.push(new Vector3(x, y, z));
        }
      }
      
      const threePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
      this.geometry = new THREE.BufferGeometry().setFromPoints(threePoints);
      return this.geometry;
    }
  }

  public getCenter(): Vector3 {
    return this.center;
  }

  public getRadii(): Vector3 {
    return new Vector3(this.xradius, this.yradius, this.zradius);
  }

  public getSegments(): number {
    return this.segments;
  }

  public getExponent(): [number, number] {
    return [this.e1, this.e2];
  }

  public InverseTransformPoint(point: Vector3): Vector3 {
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(this.rotation.x, this.rotation.y, this.rotation.z)
    );
    const inverseRotationMatrix = new THREE.Matrix4()
      .copy(rotationMatrix)
      .invert();
    const translatedPoint = point.clone().subtract(this.center);
    const transformedPoint = translatedPoint.applyMatrix4(
      inverseRotationMatrix
    );
    return transformedPoint;
  }
  public InverseTransformDirection(direction: Vector3): Vector3 {
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(this.rotation.x, this.rotation.y, this.rotation.z)
    );
    const inverseRotationMatrix = new THREE.Matrix4()
      .copy(rotationMatrix)
      .invert();
    const transformedDirection = direction
      .clone()
      .applyMatrix4(inverseRotationMatrix);
    return transformedDirection;
  }

  localToWorld(point: Vector3): Vector3 {
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(this.rotation.x, this.rotation.y, this.rotation.z)
    );
    const transformedPoint = point.clone().applyMatrix4(rotationMatrix);
    return transformedPoint.add(this.center);
  }
  worldToLocal(point: Vector3): Vector3 {
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(this.rotation.x, this.rotation.y, this.rotation.z)
    );
    const inverseRotationMatrix = new THREE.Matrix4()
      .copy(rotationMatrix)
      .invert();
    const translatedPoint = point.clone().subtract(this.center);
    const transformedPoint = translatedPoint.applyMatrix4(
      inverseRotationMatrix
    );
    return transformedPoint;
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
