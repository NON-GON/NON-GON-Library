import * as THREE from "three";
import { Ellipse } from "./2D/Ellipse";
import { Superellipse } from "./2D/Superellipse";
import { Ellipsoid } from "./3D/Ellipsoid";
import { Sphere } from "./3D/Sphere";
import { Vector2 } from "../Calc/Util/Utils";
import { ellipseEllipse } from "../Calc/Minimum_Distance/Minimum_Distance_2D";

enum _2Dgeo {
  Ellipse,
  Supperellipse,
  Line,
  Circle,
  Convex_Line,
  Convex_Circle,
  Point,
}
enum _3Dgeo {
  Ellipsoid,
  Sphere,
  Cylinder,
  Cone,
  Box,
  Convex_Hull,
  Point_Cloud,
  Point_Cloud_Sphere,
}

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

  public createGeometry(type: _2Dgeo, id: string, params: any): void;
  public createGeometry(type: _3Dgeo, id: string, params: any): void;

  public createGeometry(type: _2Dgeo | _3Dgeo, id: string, params: any): any {
    let geometry: any = null;
    if (type in _2Dgeo) {
      return this.createGeometry2D(type as _2Dgeo, id, params, geometry);
    } else if (type in _3Dgeo) {
      return this.createGeometry3D(type as _3Dgeo, id, params, geometry);
    }
  }

  public createGeometry3D(
    type: _3Dgeo,
    id: string,
    params: any,
    geometry: any
  ): any {
    switch (type) {
      case _3Dgeo.Sphere:
        geometry = new Sphere(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.segments
        );
        break;
      case _3Dgeo.Ellipsoid:
        geometry = new Ellipsoid(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.segments
        );
        break;
      case _3Dgeo.Cylinder:
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
    type: _2Dgeo,
    id: string,
    params: any,
    geometry: any
  ): any {
    switch (type) {
      case _2Dgeo.Ellipse:
        geometry = new Ellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.segments
        );
        break;
      case _2Dgeo.Supperellipse:
        geometry = new Superellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.segments,
          params.exponent
        );
        break;
      case _2Dgeo.Line:
        // Example: geometry = new Line(params.start, params.end);
        break;
      case _2Dgeo.Circle:
        geometry = new Ellipse(
          params.center,
          params.radius,
          params.radius,
          params.segments
        );
        break;
      case _2Dgeo.Convex_Line:
        // Example: geometry = new ConvexLine(params.points);
        break;
      case _2Dgeo.Convex_Circle:
        // Example: geometry = new ConvexCircle(params.center, params.radius);
        break;
      case _2Dgeo.Point:
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
  ): [Vector2, Vector2] {
    let geometry1 = this.getGeometry(id1);
    let geometry2 = this.getGeometry(id2);
    let distance: [Vector2, Vector2] = [new Vector2(0, 0), new Vector2(0, 0)];
    distance = geometry1.MinimumDistance(geometry2);
    if (distance.length < 2) {
      console.error("Distance calculation failed.");
      return [new Vector2(0, 0), new Vector2(0, 0)];
    }

    console.log(`Minimum distance between ${id1} and ${id2}: ${distance}`);
    return distance;
  }
}
