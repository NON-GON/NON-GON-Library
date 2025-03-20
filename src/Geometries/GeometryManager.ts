import * as THREE from "three";
import { Ellipse } from "./2D/Ellipse";
import { Superellipse } from "./2D/Superellipse";
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
  constructor(type: String) {
    if (type === "2D") {
    } else {
    }
  }
  public static getInstance(type: String): GeometryManager {
    if (!GeometryManager._instance) {
      GeometryManager._instance = new GeometryManager(type);
    }
    return GeometryManager._instance;
  }
  
  public createGeometry(type: _2Dgeo, id: string, params: any): void {
    let geometry: any = null;
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
    type: _2Dgeo,
    id1: string,
    id2: string
  ): [Vector2, Vector2] {
    let geometry1 = this.getGeometry(id1);
    let geometry2 = this.getGeometry(id2);
    let distance: [Vector2, Vector2] = [new Vector2(0, 0), new Vector2(0, 0)];
    switch (type) {
      case _2Dgeo.Ellipse:
        distance = ellipseEllipse(geometry1, geometry2);
        break;
      case _2Dgeo.Supperellipse:
        // Example: distance = superellipseSuperellipse(geometry1, geometry2);
        break;
      case _2Dgeo.Line:
        // Example: distance = lineLine(geometry1, geometry2);
        break;
      case _2Dgeo.Circle:
        // Example: distance = circleCircle(geometry1, geometry2);
        break;
      case _2Dgeo.Convex_Line:
        // Example: distance = convexLineConvexLine(geometry1, geometry2);
        break;
      case _2Dgeo.Convex_Circle:
        // Example: distance = convexCircleConvexCircle(geometry1, geometry2);
        break;
      case _2Dgeo.Point:
        // Example: distance = pointPoint(geometry1, geometry2);
        break;
    }
    console.log(`Minimum distance between ${id1} and ${id2}: ${distance}`);
    return distance;
  }
}
