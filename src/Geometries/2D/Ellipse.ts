import * as THREE from "three";
import { IGeometry2D } from "./IGeometry2D";
import { Vector2 } from "../../Calc/Util/Utils";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry3D } from "../3D/IGeometry3D";
import { Vector3 } from "../../Calc/Util/Utils";
import { isGeometryType2D, isGeometryType3D } from "../GeoTypes";
import { Point } from "./Point";
import { Geometry2DBase } from "./Geometry2DBase";
import { ShortestDistance2D } from "../../Calc/Shortest_Distance/Shortest_Distance_2D";
import { ProximityQuery2D } from "../../Calc/ProximityQuery/ProximityQuery2D";

export class Ellipse extends Geometry2DBase implements IGeometry2D {
  readonly xradius: number;
  readonly yradius: number;
  public type: GeometryType2D = GeometryType2D.Ellipse;

  constructor(
    center: Vector3 | Vector2,
    xradius: number,
    yradius: number,
    rotation: Vector3 | Vector2,
    segments: number
  ) {
    super();
    this.center =
      center instanceof Vector2 ? new Vector3(center.x, center.y, 0) : center;
    this.rotation =
      rotation instanceof Vector2
        ? new Vector3(rotation.x, rotation.y, 0)
        : rotation;
    this.xradius = xradius;
    this.yradius = yradius;
    this.segments = segments;
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
      this.normalizeGeometry();
      return this.geometry;
    }
  }
  ShortestDistance2D(geometry: IGeometry2D): [Vector3, Vector3] {
    switch (geometry.type) {
      case GeometryType2D.Point:
        let point = geometry as Point;
        let res = ShortestDistance2D.pointEllipseObj(
          new Vector2(point.center.x, point.center.y),
          this
        );
        return [
          new Vector3(res[0].x, res[0].y, 0),
          new Vector3(res[1].x, res[1].y, 0),
        ];
      case GeometryType2D.Ellipse:
        let ellipse = geometry as Ellipse;
        let temp = ShortestDistance2D.ellipseEllipse(ellipse, this);
        return [
          new Vector3(temp[0].x, temp[0].y, 0),
          new Vector3(temp[1].x, temp[1].y, 0),
        ];
      default:
        throw new Error(
          "Shortest distance not implemented for this geometry type."
        );
    }
  }
  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Shortest distance 3D not implemented for this geometry type."
      );
    } else if (isGeometryType2D(geometry.type)) {
      res = this.ShortestDistance2D(geometry as IGeometry2D);
    }
    return [res[0], res[1]];
  }
  ProximityQuery(
    geometry: IGeometry3D | IGeometry2D,
    method?: string
  ): boolean {
    if (method === undefined) {
      method = "Caravantes";
    }
    if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Proximity query 3D not implemented for this geometry type."
      );
    } else if (isGeometryType2D(geometry.type)) {
      return this.ProximityQuery2D(geometry as IGeometry2D, method);
    }
    return false;
  }
  ProximityQuery2D(geometry: IGeometry2D, method: string): boolean {
    if (method === "Caravantes") {
      return ProximityQuery2D.Ellipse_Ellipse_Caravantes(
        this,
        geometry as Ellipse
      );
    } else if (method === "Alberich") {
      return ProximityQuery2D.Ellipse_Ellipse_Alberich(
        this,
        geometry as Ellipse
      );
    }
    throw new Error(
      `Proximity query not implemented for this method ${method}.`
    );
  }
}
