import { Vector3 } from "../../Calc/Util/Utils";

export interface IGeometry3D {
  readonly center: Vector3;
  readonly segments: number;
  rotation: Vector3;
  getGeometry(): any;
  getCenter(): Vector3;
  MinimumDistance(geometry: IGeometry3D): [Vector3, Vector3];
}
