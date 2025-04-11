import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";

export class Line implements IGeometry2D {
  center: Vector2;
  segments: number;
  type: GeometryType2D;
  rotation: number;
  start: Vector2;
  end: Vector2;

  constructor(start: Vector2, end: Vector2, rotation: number = 0) {
    this.start = start;
    this.end = end;
    this.center = new Vector2((start.x + end.x) / 2, (start.y + end.y) / 2);
    this.segments = 1; // A line has one segment by default
    this.type = GeometryType2D.Line;
    this.rotation = rotation;
  }

  TransformDirection(direction: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      direction.x * cos - direction.y * sin,
      direction.x * sin + direction.y * cos
    );
  }
  InverseTransformPoint(point: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      point.x * cos + point.y * sin,
      -point.x * sin + point.y * cos
    );
  }
  TransformPoint(point: Vector2): Vector2 {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    return new Vector2(
      point.x * cos - point.y * sin + this.center.x,
      point.x * sin + point.y * cos + this.center.y
    );
  }

  getGeometry(): [Vector2, Vector2] {
    return [this.start, this.end];
  }

  getCenter(): Vector2 {
    return this.center;
  }

  MinimumDistance(geometry: IGeometry2D): [Vector2, Vector2] {
    // Example implementation for minimum distance calculation
    if (geometry instanceof Line) {
      const otherLine = geometry as Line;
      // For simplicity, return the start points of both lines
      return [this.start, otherLine.start];
    }
    throw new Error("MinimumDistance not implemented for this geometry type.");
  }
}
  