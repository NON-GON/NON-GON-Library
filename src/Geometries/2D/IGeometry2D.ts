import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "../3D/IGeometry3D";
import { GeometryType2D } from "../GeoTypes";
export interface IGeometry2D {
  readonly center: Vector3;
  readonly segments: number;
  readonly type: GeometryType2D;
  readonly geometry: any;
  rotation: Vector3;
  getGeometry(): any;
  getCenter(): Vector3;
  getRotation(): Vector3;
  getType(): GeometryType2D;
  getSegments(): number;
  MinimumDistance(geometry: IGeometry2D | IGeometry3D): [Vector3, Vector3];
}
