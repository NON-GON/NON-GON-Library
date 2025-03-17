import { Vector2 } from "../../Calc/Util/Utils";

export interface IGeometry2D {
  readonly center: Vector2;
  readonly segments: number;
  rotation: number;
  getGeometry(): any;
  getCenter(): Vector2;
}