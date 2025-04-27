import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";

export interface IGeometry3D {
  readonly center: Vector3;
  readonly segments: number;
  readonly type: GeometryType3D;
  readonly geometry: any;
  rotation: Vector3;
  getGeometry(): any;
  getCenter(): Vector3;
  getRotation(): Vector3;
  getType(): GeometryType3D;
  getSegments(): number;
  MinimumDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3];
}
