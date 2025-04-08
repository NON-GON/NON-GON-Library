import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
export interface IGeometry2D {
  readonly center: Vector2;
  readonly segments: number;
  readonly type: GeometryType2D;
  rotation: number;
  getGeometry(): any;
  getCenter(): Vector2;
  MinimumDistance(geometry: IGeometry2D): [Vector2, Vector2];
}
