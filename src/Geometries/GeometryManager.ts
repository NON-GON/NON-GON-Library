import * as THREE from "three";
import { Ellipse } from "./2D/Ellipse";
import { Superellipse } from "./2D/Superellipse";
import { Ellipsoid } from "./3D/Ellipsoid";
import { Sphere } from "./3D/Sphere";
import { Vector2 } from "../Calc/Util/Utils";
import { Vector3 } from "../Calc/Util/Utils";
import { GeometryType3D, isGeometryType3D } from "./GeoTypes";
import { GeometryType2D, isGeometryType2D } from "./GeoTypes";
import { Superellipsoid } from "./3D/Superellipsoid";
import { Line } from "./2D/Line";
import { Point } from "./2D/Point";
import { Plane } from "./2D/Plane";
import { Cylinder } from "./3D/Cylinder";
import { EllipticParaboloid } from "./3D/Ellipticparaboloid";
import { Hyperboloid } from "./3D/Hyperboloid";

export class GeometryManager {
  private static _instance: GeometryManager;
  private _geometries: { [key: string]: any } = {};

  private addGeometry(id: string, geometry: any): void {
    this._geometries[id] = geometry;
  }

  public getGeometry(id: string): any {
    return this._geometries[id];
  }

  public getGeometryMesh(id: string): any {
    let geometry = this._geometries[id];
    if (geometry) {
      let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      let line = new THREE.Line(geometry.getGeometry(), material);
      return line;
    } else {
      console.error(`Geometry with id ${id} not found.`);
      return null;
    }
  }

  public getAllGeometries(): { [key: string]: any } {
    return this._geometries;
  }

  public clearGeometries(): void {
    this._geometries = {};
  }

  constructor() {
    if (GeometryManager._instance) {
      return GeometryManager._instance;
    }
    GeometryManager._instance = this;
  }

  public static getInstance(): GeometryManager {
    if (!GeometryManager._instance) {
      GeometryManager._instance = new GeometryManager();
    }
    return GeometryManager._instance;
  }

  public createGeometry(type: GeometryType2D, id: string, params: any): void;
  public createGeometry(type: GeometryType3D, id: string, params: any): void;

  public createGeometry(
    type: GeometryType2D | GeometryType3D,
    id: string,
    params: any
  ): any {
    let geometry: any = null;
    if (isGeometryType2D(type)) {
      return this.createGeometry2D(type, id, params, geometry);
    } else if (isGeometryType3D(type)) {
      return this.createGeometry3D(type, id, params, geometry);
    } else {
      console.error(`Invalid geometry type: ${type}`);
    }
  }

  private createGeometry3D(
    type: GeometryType3D,
    id: string,
    params: any,
    geometry: any
  ): any {
    switch (type) {
      case GeometryType3D.Cylinder:
        geometry = new Cylinder(
          params.center,
          params.xradius,
          params.yradius,
          params.height,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType3D.Ellipsoid:
        geometry = new Ellipsoid(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType3D.EllipticParaboloid:
        geometry = new EllipticParaboloid(
          params.center,
          params.xradius,
          params.yradius,
          params.height,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType3D.Hyperboloid:
        geometry = new Hyperboloid(
          params.center,
          params.xradius,
          params.yradius,
          params.zfactor,
          params.height,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType3D.Sphere:
        geometry = new Sphere(
          params.center,
          params.radius,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType3D.Superellipsoid:
        geometry = new Superellipsoid(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.e1,
          params.e2,
          params.rotation,
          params.segments
        );
        break;
      default:
        console.error(`Invalid parameters for geometry type: ${type}`);
        break;
    }
    if (geometry) {
      this.addGeometry(id, geometry);
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let mesh = new THREE.Mesh(geometry.getGeometry(), material);
      return mesh;
    } else {
      console.error(`Invalid parameters for geometry type: ${type}`);
    }
  }

  private createGeometry2D(
    type: GeometryType2D,
    id: string,
    params: any,
    geometry: any
  ): any {
    switch (type) {
      case GeometryType2D.Ellipse:
        geometry = new Ellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType2D.Line:
        geometry = new Line(params.start, params.end, params.rotation);
        break;
      case GeometryType2D.Plane:
        geometry = new Plane(
          params.center,
          params.rotation,
          params.width,
          params.height,
          params.segments
        );
        break;
      case GeometryType2D.Point:
        geometry = new Point(params.center);
        break;
      case GeometryType2D.Supperellipse:
        geometry = new Superellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.exponent,
          params.rotation,
          params.segments
        );
        break;
      case GeometryType2D.Circle:
        geometry = new Ellipse(
          params.center,
          params.radius,
          params.radius,
          params.rotation,
          params.segments
        );
        break;
    }
    if (geometry) {
      this.addGeometry(id, geometry);
      let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      let line = new THREE.Line(geometry.getGeometry(), material);
      return line;
    } else {
      console.error(`Invalid parameters for geometry type: ${type}`);
    }
  }

  public calculateMinimumDistance(
    id1: string,
    id2: string
  ): [Vector2, Vector2] | [Vector3, Vector3] {
    let geometry1 = this.getGeometry(id1);
    let geometry2 = this.getGeometry(id2);
    let distance = geometry1.MinimumDistance(geometry2);
    console.log(
      `Minimum distance between ${id1} and ${id2}: ${distance[0].distanceTo(
        distance[1]
      )}`
    );
    return distance;
  }
  public calculateProximityQuery(id1: string, id2: string) {
    throw new Error("Method not implemented yet.");
  }
}
