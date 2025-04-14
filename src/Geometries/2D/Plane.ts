import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";
import * as THREE from "three";

export class Plane implements IGeometry2D {
  center: Vector2;
  segments: number;
  type: GeometryType2D;
  private geometry: any = null;
  rotation: number;
  width: number;
  height: number;

  constructor(center: Vector2, segments: number, type: GeometryType2D, rotation: number, width: number, height: number) {
    this.center = center;
    this.segments = segments;
    this.type = type;
    this.rotation = rotation;
    this.width = width;
    this.height = height;

  }

  public getGeometry(): any {
    if(this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Plane Geometry");
      let plane = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
      this.geometry = plane;
    }
    return this.geometry;
  }

  public getCenter(): Vector2 {
    // Returns the center of the plane
    return this.center;
  }
  public getSegments(): number {
    return this.segments;
  }

  MinimumDistance(geometry: IGeometry2D): [Vector2, Vector2] {
    // Calculates the minimum distance between this plane and another geometry
    const otherCenter = geometry.getCenter();
    const distanceVector = new Vector2(otherCenter.x - this.center.x, otherCenter.y - this.center.y);
    return [this.center, otherCenter];
  }
}
