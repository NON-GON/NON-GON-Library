import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import {
  GeometryType3D,
} from "../GeoTypes";

export class Cylinder implements IGeometry3D {
  readonly center: Vector3;
  readonly xradius: number;
  readonly yradius: number;
  readonly height: number;
  readonly segments: number;
  private geometry: any = null;
  public type: GeometryType3D = GeometryType3D.Cylinder;
  public rotation: Vector3 = new Vector3(0, 0, 0); // Rotation angles in radians

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    height: number,
    segments: number
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.height = height;
    this.segments = segments;
    this.geometry = null;
  }

  MinimumDistance(_geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error("Minimum distance not implemented for this geometry type.");
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

      this.geometry.translate(this.center.x, this.center.y, this.center.z);

      return this.geometry;
    }
  }

  public getCenter(): Vector3 {
    return this.center;
  }

  public getRadii(): Vector3 {
    throw new Error("getRadii not implemented for this geometry type.");
  }
  public getSegments(): number {
    return this.segments;
  }
}
