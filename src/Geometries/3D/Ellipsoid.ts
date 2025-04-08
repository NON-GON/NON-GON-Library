import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import {
  ellipsoidEllipsoid,
  point_Ellipsoid,
} from "../../Calc/Minimum_Distance/Minimum_Distance_3D";

export class Ellipsoid implements IGeometry3D {
  readonly center: Vector3;
  readonly xradius: number;
  readonly yradius: number;
  readonly zradius: number;
  readonly segments: number;
  private geometry: any = null;
  public rotation: Vector3 = new Vector3(0, 0, 0); // Rotation angles in radians

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    zradius: number,
    segments: number
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.segments = segments;
    this.geometry = null;
  }
  MinimumDistance(geometry: IGeometry3D): [Vector3, Vector3] {
    if (geometry instanceof Ellipsoid) {
      const res = ellipsoidEllipsoid(this, geometry);
      return [res[0], res[1]];
    } else {
      throw new Error(
        "Minimum distance not implemented for this geometry type."
      );
    }
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipsoid Geometry");
      const sphereGeometry = new THREE.SphereGeometry(
        1,
        this.segments,
        this.segments
      );
      sphereGeometry.scale(this.xradius, this.yradius, this.zradius);
      this.geometry = sphereGeometry;
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
}
