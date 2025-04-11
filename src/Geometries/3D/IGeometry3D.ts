import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";

export interface IGeometry3D {
  readonly center: Vector3;
  readonly segments: number;
  rotation: Vector3;
  getGeometry(): any;
  getCenter(): Vector3;
  type: GeometryType3D;
  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3];

}
