import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "../2D/IGeometry2D";
import {
  GeometryType3D,
  isGeometryType2D,
  isGeometryType3D,
} from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";
import { IGeometry3D } from "./IGeometry3D";
import * as THREE from "three";
import { ShortestDistance3D } from "../../Calc/Shortest_Distance/Shortest_Distance_3D";
import { Plane } from "../2D/Plane";

/**
 * Represents a hemiellipsoid (half of an ellipsoid) geometry.
 * A hemiellipsoid is the upper half of an ellipsoid (z >= 0).
 */
export class HemiEllipsoid extends Geometry3DBase {
  type: GeometryType3D = GeometryType3D.HemiEllipsoid;

  /**
   * Semi-axis length along the x-axis
   */
  xradius: number;

  /**
   * Semi-axis length along the y-axis
   */
  yradius: number;

  /**
   * Semi-axis length along the z-axis
   */
  zradius: number;

  /**
   * Creates a new HemiEllipsoid instance.
   * @param xradius Semi-axis length along the x-axis
   * @param yradius Semi-axis length along the y-axis
   * @param zradius Semi-axis length along the z-axis
   * @param center Center point of the hemiellipsoid
   * @param rotation Rotation of the hemiellipsoid in degrees
   * @param segments Number of segments for mesh generation
   */
  constructor(
    xradius: number,
    yradius: number,
    zradius: number,
    center: Vector3 = new Vector3(0, 0, 0),
    rotation: Vector3 = new Vector3(0, 0, 0),
    segments: number = 32
  ) {
    super();
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.center = center;
    this.rotation = rotation;
    this.segments = segments;
  }

  /**
   * Generates the THREE.js geometry for the hemiellipsoid.
   * @returns THREE.BufferGeometry representing the hemiellipsoid
   */
  getGeometry(): any {
    if (this.geometry !== null) {
      return this.geometry;
    }

    const geometry = new THREE.SphereGeometry(
      1,
      this.segments,
      this.segments,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    // Scale to create ellipsoid shape
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] *= this.xradius; // x
      positions[i + 1] *= this.yradius; // y
      positions[i + 2] *= this.zradius; // z
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    this.geometry = geometry;
    this.normalizeGeometry();

    return this.geometry;
  }

  /**
   * Calculates a point on the hemiellipsoid surface using parametric equations.
   * @param phi Angle from the positive z-axis (0 to π/2 for hemiellipsoid)
   * @param theta Angle in the xy-plane from the positive x-axis (0 to 2π)
   * @returns Point on the hemiellipsoid surface in local coordinates
   */
  point(phi: number, theta: number): Vector3 {
    // Clamp phi to hemiellipsoid range
    phi = Math.max(0, Math.min(Math.PI / 2, phi));

    const x = this.xradius * Math.sin(phi) * Math.cos(theta);
    const y = this.yradius * Math.sin(phi) * Math.sin(theta);
    const z = this.zradius * Math.cos(phi);

    return new Vector3(x, y, z);
  }

  /**
   * Calculates the shortest distance between this hemiellipsoid and another geometry.
   * @param geometry The other geometry
   * @returns Array containing the closest points [point on this, point on other]
   */
  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    let res = [Vector3.Zero(), Vector3.Zero()];
    if (isGeometryType2D(geometry.type)) {
      res = ShortestDistance3D.HemiellipsoidPlane(this, geometry as Plane);
    } else if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Shortest distance not implemented for this geometry type."
      );
    }
    return [res[0], res[1]];
  }

  /**
   * Performs a proximity query between this hemiellipsoid and another geometry.
   * @param geometry The other geometry
   * @param method Optional method parameter
   * @returns Boolean indicating if geometries are in proximity
   */
  ProximityQuery(geometry: IGeometry3D, method?: string): boolean {
    throw new Error("ProximityQuery method not implemented for HemiEllipsoid.");
  }
}
