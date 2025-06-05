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
import { Circle } from "./2D/Circle";
import { Convexcircle } from "./2D/Convexcircle";
import { ConvexLine } from "./2D/Convexline";
import { Convex } from "./3D/Convex";
import { Geometry3DBase } from "./3D/Geometry3DBase";
import { Geometry2DBase } from "./2D/Geometry2DBase";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export enum HyperboloidType {
  OneSheeted = "OneSheeted",
  TwoSheeted = "TwoSheeted",
}
/**
 * Singleton class to manage creation, storage, and operations on geometries.
 */
export class GeometryManager {
  private static _instance: GeometryManager;
  private _geometries: { [key: string]: any } = {};

  /**
   * Adds a geometry object to the internal dictionary.
   * @param id Unique identifier for the geometry.
   * @param geometry Geometry instance to store.
   */
  private addGeometry(id: string, geometry: any): void {
    this._geometries[id] = geometry;
  }

  /**
   * Retrieves a geometry by ID.
   * @param id Identifier of the geometry to retrieve.
   * @returns The geometry object or undefined if not found.
   */
  public getGeometry(id: string): any {
    return this._geometries[id];
  }

  /**
   * Retrieves a geometry mesh by ID and color.
   * @param id Identifier of the geometry to retrieve.
   * @param color Color for the mesh material.
   * @param type Optional type of geometry (line or mesh).
   * @returns A THREE.Mesh or THREE.Line object representing the geometry.
   */
  public getGeometryMesh(
    id: string,
    color: number,
    type?: string,
    width?: number
  ): any {
    let geometry = this._geometries[id];
    if (geometry) {
      type = type ?? "line";
      if (type === "line") {
        if (width !== undefined) {
          const positions = geometry.getGeometry().attributes.position.array;
          // If only two points, interpolate more for a clean line
          let points: number[] = [];
          if (positions.length === 6) {
            // positions = [x1, y1, z1, x2, y2, z2]
            const start = new THREE.Vector3(
              positions[0],
              positions[1],
              positions[2]
            );
            const end = new THREE.Vector3(
              positions[3],
              positions[4],
              positions[5]
            );
            const segments = 32; // More segments = smoother line
            for (let i = 0; i <= segments; i++) {
              const t = i / segments;
              const pt = new THREE.Vector3().lerpVectors(start, end, t);
              points.push(pt.x, pt.y, pt.z);
            }
          } else {
            points = Array.from(positions);
          }

          const meshLineGeometry = new MeshLineGeometry();
          meshLineGeometry.setPoints(points);

          const meshLineMaterial = new MeshLineMaterial({
            color: color,
            lineWidth: width, // width in world units
            resolution:  new THREE.Vector2(
              window.innerWidth, window.innerHeight),
          });

          const line = new THREE.Mesh(meshLineGeometry, meshLineMaterial);
          line.name = id;
          return line;
        }

        let material = new THREE.LineBasicMaterial({
          color: color,
          linewidth: width ?? 1,
        });
        let line = new THREE.Line(geometry.getGeometry(), material);
        line.name = id;
        return line;
      } else if (type === "mesh") {
        if (geometry instanceof Geometry3DBase) {
          let material = new THREE.MeshPhongMaterial({
            color: color,
            side: 2,
            shininess: 1000,
          });
          let mesh = new THREE.Mesh(geometry.getGeometry(), material);
          mesh.name = id;
          return mesh;
        } else if (geometry instanceof Geometry2DBase) {
          if (geometry instanceof Plane) {
            const planeGeometry = geometry.getGeometry();
            const mesh = new THREE.Mesh(
              planeGeometry,
              new THREE.MeshPhongMaterial({
                color: color,
                side: 2,
                shininess: 100,
              })
            );
            mesh.name = id;
            return mesh;
          }

          if (geometry instanceof Point) {
            const sphereGeometry = new THREE.SphereGeometry(1);
            const material = new THREE.MeshBasicMaterial({ color: color });
            const mesh = new THREE.Mesh(sphereGeometry, material);
            const center = geometry.getCenter();
            mesh.position.set(center.x, center.y, center.z);
            mesh.name = id;
            return mesh;
          }

          const positions = geometry.getGeometry().attributes.position.array;
          const points = [];
          for (let i = 0; i < positions.length; i += 3) {
            points.push(new THREE.Vector2(positions[i], positions[i + 1]));
          }

          // Make sure the shape is closed
          if (!points[0].equals(points[points.length - 1])) {
            points.push(points[0]);
          }

          const shape = new THREE.Shape(points);
          const shapeGeometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(
            shapeGeometry,
            new THREE.MeshBasicMaterial({
              color: color,
              side: THREE.DoubleSide,
            })
          );
          mesh.name = id;
          return mesh;
        }
      }
    } else {
      throw new Error(`Geometry with id ${id} not found.`);
    }
  }

  /**
   * Returns all stored geometries.
   * @returns An object containing all geometries keyed by their IDs.
   */
  public getAllGeometries(): any[] {
    return Object.values(this._geometries);
  }

  /**
   * Clears all stored geometries.
   */
  public clearGeometries(): void {
    this._geometries = {};
  }

  private constructor() {
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

  /**
   * Creates a geometry based on type and parameters, stores it and returns its mesh.
   * @param type The type of geometry (2D).
   * @param id Unique identifier for the geometry.
   * @param params Parameters for the geometry construction.
   * @returns A THREE.Mesh or THREE.Line object representing the geometry.
   */
  public createGeometry(type: GeometryType2D, id: string, params: any): void;
  /**
   * Creates a geometry based on type and parameters, stores it and returns its mesh.
   * @param type The type of geometry (3D).
   * @param id Unique identifier for the geometry.
   * @param params Parameters for the geometry construction.
   * @returns A THREE.Mesh or THREE.Line object representing the geometry.
   */
  public createGeometry(type: GeometryType3D, id: string, params: any): void;

  /**
   * Creates a geometry based on type and parameters, stores it and returns its mesh.
   * @param type The type of geometry (2D or 3D).
   * @param id Unique identifier for the geometry.
   * @param params Parameters for the geometry construction.
   * @returns A THREE.Mesh or THREE.Line object representing the geometry.
   */
  public createGeometry(
    type: GeometryType2D | GeometryType3D,
    id: string,
    params: any
  ): any {
    let geometry: any = null;

    if (isGeometryType2D(type)) {
      geometry = this.createGeometryByType2D(type, params);
    } else if (isGeometryType3D(type)) {
      geometry = this.createGeometryByType3D(type, params);
    } else {
      throw new Error(`Invalid geometry type: ${type}`);
    }
    if (geometry) {
      this.addGeometry(id, geometry);
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let mesh = new THREE.Mesh(geometry.getGeometry(), material);
      return mesh;
    } else {
      throw new Error(`Invalid parameters for geometry type: ${type}`);
    }
  }

  /**
   * Creates a geometry based on type and parameters, stores it and returns its mesh.
   * @param type The type of geometry (3D).
   * @param id Unique identifier for the geometry.
   * @param params Parameters for the geometry construction.
   * @returns A THREE.Mesh or THREE.Line object representing the geometry.
   */

  private createGeometryByType3D(type: GeometryType3D, params: any): any {
    switch (type) {
      case GeometryType3D.Cylinder:
        return new Cylinder(
          params.center,
          params.xradius,
          params.yradius,
          params.height,
          params.rotation,
          params.segments
        );
      case GeometryType3D.Ellipsoid:
        return new Ellipsoid(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.rotation,
          params.segments
        );
      case GeometryType3D.EllipticParaboloid:
        return new EllipticParaboloid(
          params.center,
          params.xradius,
          params.yradius,
          params.height,
          params.rotation,
          params.segments
        );
      case GeometryType3D.Hyperboloid:
        return new Hyperboloid(
          params.center,
          params.xradius,
          params.yradius,
          params.zfactor,
          params.height,
          params.rotation,
          params.hyperboloidType,
          params.segments
        );
      case GeometryType3D.Sphere:
        return new Sphere(
          params.center,
          params.radius,
          params.rotation,
          params.segments
        );
      case GeometryType3D.Superellipsoid:
        return new Superellipsoid(
          params.center,
          params.xradius,
          params.yradius,
          params.zradius,
          params.e1,
          params.e2,
          params.rotation,
          params.segments
        );
      case GeometryType3D.Convex:
        return new Convex(params.center, params.rotation, params.segments);
      default:
        return null;
    }
  }

  /**
   * Creates a geometry based on type and parameters, stores it and returns its mesh.
   * @param type The type of geometry (2D).
   * @param id Unique identifier for the geometry.
   * @param params Parameters for the geometry construction.
   * @returns A THREE.Mesh or THREE.Line object representing the geometry.
   */
  private createGeometryByType2D(type: GeometryType2D, params: any): any {
    switch (type) {
      case GeometryType2D.Ellipse:
        return new Ellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.rotation,
          params.segments
        );
      case GeometryType2D.Line:
        return new Line(params.start, params.end, params.rotation);
      case GeometryType2D.Plane:
        return new Plane(params.center, params.rotation, params.segments);
      case GeometryType2D.Point:
        return new Point(params.center);
      case GeometryType2D.Supperellipse:
        return new Superellipse(
          params.center,
          params.xradius,
          params.yradius,
          params.exponent,
          params.rotation,
          params.segments
        );
      case GeometryType2D.Circle:
        return new Circle(
          params.center,
          params.radius,
          params.rotation,
          params.segments
        );
      case GeometryType2D.ConvexCircle:
        return new Convexcircle(
          params.center,
          params.radius,
          params.rotation,
          params.segments
        );
      case GeometryType2D.ConvexLine:
        return new ConvexLine(params.center, params.rotation, params.segments);
      default:
        return null;
    }
  }

  /**
   * Calculates and logs the Shortest distance between two geometries.
   * @param id1 ID of the first geometry.
   * @param id2 ID of the second geometry.
   * @returns A tuple of the closest two points ([point1, point2]).
   */
  public calculateShortestDistance(
    id1: string,
    id2: string
  ): [Vector2, Vector2] | [Vector3, Vector3] {
    let geometry1 = this.getGeometry(id1);
    let geometry2 = this.getGeometry(id2);
    if (!geometry1 || !geometry2) {
      throw new Error(
        `One or both geometries with ids ${id1} and ${id2} not found.`
      );
    }
    let distance = geometry1.ShortestDistance(geometry2);
    console.log(
      `Shortest distance between ${id1} and ${id2}: ${distance[0].distanceTo(
        distance[1]
      )}`
    );
    return distance;
  }

  /**
   * Performs a proximity query between two geometries using the specified method.
   * @param id1 ID of the first geometry.
   * @param id2 ID of the second geometry.
   * @param method Optional method string to define query type.
   * @returns Boolean result of the proximity query.
   */
  public calculateProximityQuery(
    id1: string,
    id2: string,
    method?: string
  ): boolean {
    let geometry1 = this.getGeometry(id1);
    let geometry2 = this.getGeometry(id2);
    let result = geometry1.ProximityQuery(geometry2, method);
    console.log(`Proximity query between ${id1} and ${id2}: ${result}`);
    return result;
  }

  public deletePreviousGeometry(id: string) {
    let geometry = this.getGeometry(id);
    geometry.geometry = null;
  }

  public changeCenterX(id: string, x: number) {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type === GeometryType2D.Line) {
      throw new Error("Cannot change center of a Line geometry.");
    }
    let geometry = this.getGeometry(id);
    geometry.center = new Vector3(x, geometry.center.y, geometry.center.z);
    geometry.geometry = null;
  }

  public changeCenterY(id: string, y: number) {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type === GeometryType2D.Line) {
      throw new Error("Cannot change center of a Line geometry.");
    }
    let geometry = this.getGeometry(id);
    geometry.center = new Vector3(geometry.center.x, y, geometry.center.z);
    geometry.geometry = null;
  }

  public changeCenterZ(id: string, z: number) {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type === GeometryType2D.Line) {
      throw new Error("Cannot change center of a Line geometry.");
    }
    let geometry = this.getGeometry(id);
    geometry.center = new Vector3(geometry.center.x, geometry.center.y, z);
    geometry.geometry = null;
  }

  public changeRotationX(id: string, x: number) {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type === GeometryType2D.Line) {
      throw new Error("Cannot change rotation of a Line geometry.");
    }
    console.log("changeRotationX", id, x);
    let geometry = this.getGeometry(id);
    geometry.rotation = new Vector3(
      x,
      geometry.rotation.y,
      geometry.rotation.z
    );
    geometry.geometry = null;
  }

  public changeRotationY(id: string, y: number) {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type === GeometryType2D.Line) {
      throw new Error("Cannot change rotation of a Line geometry.");
    }
    console.log("changeRotationY", id, y);
    let geometry = this.getGeometry(id);
    geometry.rotation = new Vector3(
      geometry.rotation.x,
      y,
      geometry.rotation.z
    );
    geometry.geometry = null;
  }

  public changeRotationZ(id: string, z: number) {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type === GeometryType2D.Line) {
      throw new Error("Cannot change rotation of a Line geometry.");
    }
    console.log("changeRotationZ", id, z);
    let geometry = this.getGeometry(id);
    geometry.rotation = new Vector3(
      geometry.rotation.x,
      geometry.rotation.y,
      z
    );
    geometry.geometry = null;
  }

  public changePointsOfLine(
    id: string,
    start?: Vector2 | Vector3,
    end?: Vector2 | Vector3
  ): void {
    if (this._geometries[id] === undefined) {
      throw new Error(`Geometry with id ${id} not found.`);
    }
    if (this._geometries[id].type !== GeometryType2D.Line) {
      throw new Error("Cannot change points of a non-Line geometry.");
    }
    let geometry = this.getGeometry(id);
    const currentStart = geometry.start;
    const currentEnd = geometry.end;

    geometry.start = start
      ? new Vector3(start.x, start.y, (start as Vector3).z ?? 0)
      : currentStart;
    geometry.end = end
      ? new Vector3(end.x, end.y, (end as Vector3).z ?? 0)
      : currentEnd;
    geometry.geometry = null;
  }

  public static isPlaneBetween(
    plane1Center: Vector3,
    middlePlaneCenter: Vector3,
    plane2Center: Vector3
  ): boolean {
    // Define vector along the axis from plane1 to plane2
    const axis = plane2Center.clone().subtract(plane1Center).normalize();
    const toMiddle = middlePlaneCenter.clone().subtract(plane1Center);
    // Project the toMiddle vector onto the axis
    const projection = toMiddle.dot(axis);
    // Check if the middle plane is between the other two along the axis
    return projection > 0 && projection < plane1Center.distanceTo(plane2Center);
  }
}
