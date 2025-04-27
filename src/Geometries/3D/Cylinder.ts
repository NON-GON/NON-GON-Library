import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";

export class Cylinder extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly height: number;
  public type: GeometryType3D = GeometryType3D.Cylinder;

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

  MinimumDistance(_geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error("Minimum distance not implemented for this geometry type.");
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
      console.log("Creating Cylinder Geometry");
      const cylinderGeometry = new THREE.CylinderGeometry(
        this.xradius,
        this.yradius,
        this.height,
        this.segments
      );
      this.geometry = cylinderGeometry;

      this.normalizeGeometry();
      return this.geometry;
    }
  }
}
