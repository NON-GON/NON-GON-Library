import * as THREE from "three";
import { Ellipse } from "./2D/Ellipse";
import { Superellipse } from "./2D/SuperEllipse";

enum geo_type {
  _2D,
  _3D,
}

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
  Superellipsoid,
  Plane,
  Convex,
  Point,
  Cylinder,
  EllipticParaboloid,
  OneSurfaceHyperboloid,
  TwoSurfaceHyperboloid,
}

export class GeometryCreator {
  public Dimension: geo_type;
  public Primitive_2D: _2Dgeo;
  public Primitive_3D: _3Dgeo;
  public xradius: number;
  public yradius: number;
  public zradius: number;
  public e: number;
  public radius: number;
  public e1: number;
  public e2: number;
  public render: boolean = false;
  public segments: number = 1000;
  public prevPrimitive2D: _2Dgeo;

  constructor(xradius?: number, yradius?: number, radius?: number) {
    this.Dimension = geo_type._2D;
    this.Primitive_2D = radius ? _2Dgeo.Circle : _2Dgeo.Ellipse;
    this.Primitive_3D = _3Dgeo.Ellipsoid;
    this.xradius = xradius || 0;
    this.yradius = yradius || 0;
    this.zradius = 0;
    this.e = 0;
    this.radius = radius || 0;
    this.e1 = 0;
    this.e2 = 0;
    this.render = false;
    this.segments = 1000;
    this.prevPrimitive2D = _2Dgeo.Ellipse;
  }

  /**
   * Class responsible for the creation of the 2D geometries.
   * It can create Ellipse, Superellipse, Convex Line, Circle, Convex Circle, and Point.
   * The class uses the specified radii and segments to generate the geometry points.
   */
  public create2DGeometry(): any {
    let angle = Math.PI * 2;
    let points;

    switch (this.Primitive_2D) {
      case _2Dgeo.Ellipse:
        points = Ellipse.create(
          this.xradius,
          this.yradius,
          angle,
          this.segments
        );
        break;
      case _2Dgeo.Supperellipse:
        points = Superellipse.create(
          this.xradius,
          this.yradius,
          this.e,
          this.segments
        );
        break;
      case _2Dgeo.Convex_Line:
        //TODO: Implement Convex Line
        break;
      case _2Dgeo.Circle:
        points = Ellipse.create(
          this.radius,
          this.radius,
          angle,
          this.segments
        );
        break;
      case _2Dgeo.Convex_Circle:
        //TODO: Implement Convex Circle
        break;
      case _2Dgeo.Point:
        //TODO: Implement point
        break;
    }

    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let line = new THREE.Line(geometry, material);
    return line;
  }
}
