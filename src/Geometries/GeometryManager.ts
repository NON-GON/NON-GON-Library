import * as THREE from "three";
import { Ellipse } from "./2D/Ellipse";
import { Superellipse } from "./2D/Superellipse";
import { Ellipsoid } from "./3D/Ellipsoid";
import { Sphere } from "./3D/Sphere";
import { Vector2 } from "../Calc/Util/Utils";
import { Vector3 } from "../Calc/Util/Utils";
import { ellipseEllipse } from "../Calc/Minimum_Distance/Minimum_Distance_2D";
import { GeometryType3D, isGeometryType3D } from "./GeoTypes";
import { GeometryType2D, isGeometryType2D } from "./GeoTypes";

export class GeometryManager {
  private static _instance: GeometryManager;
  private _geometries: { [key: string]: any } = {};

  public addGeometry(name: string, geometry: any): void {
    this._geometries[name] = geometry;
  }

  public getGeometry(name: string): any {
    return this._geometries[name];
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
      console.log("Creating 3D Geometry");
      return this.createGeometry3D(type, id, params, geometry);
    } else {
      console.error(`Invalid geometry type: ${type}`);
    }
  }

  public createGeometry3D(
    type: GeometryType3D,
    id: string,
    params: any,
    geometry: any
  ): any {
    switch (type) {
      case GeometryType3D.Sphere:
        geometry = new Sphere(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.segments
        );
        break;
      case GeometryType3D.Ellipsoid:
        geometry = new Ellipsoid(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.segments
        );
        break;
      case GeometryType3D.Cylinder:
        // Example: geometry = new Cylinder(params.center, params.radius, params.height, params.segments);
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

  public createGeometry2D(
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
          params.segments
        );
        break;
      case GeometryType2D.Supperellipse:
        geometry = new Superellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.segments,
          params.exponent
        );
        break;
      case GeometryType2D.Line:
        // Example: geometry = new Line(params.start, params.end);
        break;
      case GeometryType2D.Circle:
        geometry = new Ellipse(
          params.center,
          params.radius,
          params.radius,
          params.segments
        );
        break;
      case GeometryType2D.Convex_Line:
        // Example: geometry = new ConvexLine(params.points);
        break;
      case GeometryType2D.Convex_Circle:
        // Example: geometry = new ConvexCircle(params.center, params.radius);
        break;
      case GeometryType2D.Point:
        // Example: geometry = new Point(params.position);
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
    console.log(`Minimum distance between ${id1} and ${id2}: ${distance}`);
    return distance;
  }
}
