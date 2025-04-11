import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";
//TODO: think more how to do this
export class Point implements IGeometry2D {
  center: Vector2;
  segments: number = 0; // Not applicable for a point, default to 0
  type: GeometryType2D = GeometryType2D.Point; // Assuming GeometryType2D.Point exists
  rotation: number = 0; // Not applicable for a point, default to 0

  constructor(center: Vector2) {
    this.center = center;
  }

  getGeometry(): Vector2 {
    return this.center;
  }

  getCenter(): Vector2 {
    return this.center;
  }

  MinimumDistance(geometry: IGeometry2D): [Vector2, Vector2] {
    // Calculate the minimum distance between this point and another geometry
    const otherCenter = geometry.getCenter();
    return [this.center, otherCenter];
  }
}