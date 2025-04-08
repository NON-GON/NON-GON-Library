import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import {ellipseEllipse} from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
import { pointEllipse } from "../../Calc/Minimum_Distance/Minimum_Distance_2D";
export class Ellipse implements IGeometry2D {
  readonly center: Vector2;
  readonly xradius: number;
  readonly yradius: number;
  readonly segments: number;
  private geometry: any = null;
  public rotation: number= 0; // TODO: Implement rotation 
  public type: GeometryType2D = GeometryType2D.Ellipse; 

  constructor(
    center: Vector2,
    xradius: number,
    yradius: number,
    segments: number
  ) {
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.segments = segments;
    this.geometry = null;
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Ellipse Geometry");
      let curve = new THREE.EllipseCurve(
        this.center.x,
        this.center.y,
        this.xradius,
        this.yradius,
        0,
        2 * Math.PI,
        false,
        0
      );
      this.geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(this.segments)
      );
      return this.geometry;
    }
  }

  public getCenter(): Vector2 {
    return this.center;
  }
  public getRadius(): Vector2 {
    return new Vector2(this.xradius, this.yradius);
  }
  public getSegments(): number {
    return this.segments;
  }

  public MinimumDistance(Geometry: any): [Vector2, Vector2] {
    let result: Vector2[] = [new Vector2(0, 0), new Vector2(0, 0)];
    switch (Geometry.type) {
      case GeometryType2D.Ellipse:
        result = ellipseEllipse(this, Geometry);
        break;
      case GeometryType2D.Point:
        //result = pointEllipse(Geometry, this);
        break;
      default:
        throw new Error("Unsupported geometry type for distance calculation.");
    }
    if (result.length < 2) {
      throw new Error("Result does not contain exactly two elements.");
    }
    return [result[0], result[1]];
  }
}
