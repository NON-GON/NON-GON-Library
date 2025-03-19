import * as THREE from "three";
import { Ellipse } from "./2D/Ellipse";
import { Vector2 } from "../Calc/Util/Utils";

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
  public Dimension: geo_type = geo_type._2D;
  public Primitive_2D: _2Dgeo = _2Dgeo.Ellipse;
  public Primitive_3D: _3Dgeo = _3Dgeo.Ellipsoid;
  public xradius: number = 0;
  public yradius: number = 0;
  public zradius: number = 0;
  public e: number = 0;
  public radius: number = 0;
  public segments: number = 1000;
  public xposition: number = 0;
  public yposition: number = 0;
  constructor(
    xradius: number,
    yradius: number,
    xposition: number,
    yposition: number
  );
  constructor(radius: number, xposition: number, yposition: number);
  constructor(
    xradiusOrRadius: number,
    yradiusOrXposition: number,
    xpositionOrYpostion: number,
    yposition?: number
  ) {
    console.log(arguments.length);
    if (arguments.length === 4) {
      // Ellipse case
      this.Dimension = geo_type._2D;
      this.Primitive_2D = _2Dgeo.Ellipse;
      this.Primitive_3D = _3Dgeo.Ellipsoid;
      this.xradius = xradiusOrRadius;
      this.yradius = yradiusOrXposition;
      this.zradius = 0;
      this.e = 0;
      this.radius = 0;
      this.xposition = xpositionOrYpostion;
      this.yposition = yposition ?? 0;
    } else {
      console.log("Circle Case");
      // Circle case
      this.Dimension = geo_type._2D;
      this.Primitive_2D = _2Dgeo.Circle;
      this.Primitive_3D = _3Dgeo.Ellipsoid;
      this.xradius = 0;
      this.yradius = 0;
      this.zradius = 0;
      this.e = 0;
      this.radius = xradiusOrRadius;
      this.xposition = yradiusOrXposition;
      this.yposition = xpositionOrYpostion;
    }

    this.segments = 1000;
  }

  /**
   * Class responsible for the creation of the 2D geometries.
   * It can create Ellipse, Superellipse, Convex Line, Circle, Convex Circle, and Point.
   * The class uses the specified radii and segments to generate the geometry points.
   */
  public create2DGeometry(): any {
    let geometry: any;
    switch (this.Primitive_2D) {
      case _2Dgeo.Ellipse:
        geometry = new Ellipse(
          new Vector2(this.xposition, this.yposition),
          this.xradius,
          this.yradius,
          this.segments
        );

        break;
      case _2Dgeo.Supperellipse:
        //TODO: Implement Superellipse
        break;
      case _2Dgeo.Convex_Line:
        //TODO: Implement Convex Line
        break;
      case _2Dgeo.Circle:
        geometry = new Ellipse(
          new Vector2(this.xposition, this.yposition),
          this.radius,
          this.radius,
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
    console.log(geometry.getGeometry());
    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let line = new THREE.Line(geometry.getGeometry(), material);
    return line;
  }
}
