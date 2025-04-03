import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";

export class Ellipsoid {
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
