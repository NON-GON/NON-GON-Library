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
 * NOTE: The generated THREE.SphereGeometry with thetaLength=Math.PI/2 creates the top hemisphere
 * with respect to the Y axis in three.js (Y is up). Therefore this shape is the half with y >= 0.
 * We treat Y as the vertical ("up") axis and the base disk lies on the plane y = 0 in local space.
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
    console.log("Creating HemiEllipsoid Geometry");
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

    // Create the curved surface (upper hemisphere)
    const curvedGeometry = new THREE.SphereGeometry(
      1,
      this.segments,
      this.segments,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    // Scale to create ellipsoid shape
    const curvedPositions = curvedGeometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < curvedPositions.length; i += 3) {
      curvedPositions[i] *= this.xradius; // x
      curvedPositions[i + 1] *= this.yradius; // y
      curvedPositions[i + 2] *= this.zradius; // z
    }

    // Extract rim vertices from the curved geometry (equator) so base orientation matches
    const curvedVertices = curvedGeometry.attributes.position
      .array as Float32Array;
    const curvedVertexCount = curvedGeometry.attributes.position.count;

    type RimVertex = { x: number; y: number; z: number; angle: number };
    const rim: RimVertex[] = [];
    const eps = 1e-5;
    for (let vi = 0; vi < curvedVertexCount; vi++) {
      const vx = curvedVertices[vi * 3];
      const vy = curvedVertices[vi * 3 + 1];
      const vz = curvedVertices[vi * 3 + 2];
      // In SphereGeometry the equator sits where the vertical component ~ 0 (Y axis)
      if (Math.abs(vy) <= eps) {
        const angle = Math.atan2(vz, vx);
        rim.push({ x: vx, y: 0, z: vz, angle });
      }
    }

    // If rim detection failed (different orientation), fallback to parametric ellipse
    const baseVertices: number[] = [];
    const baseIndices: number[] = [];
    if (rim.length >= Math.max(8, this.segments / 2)) {
      // Sort rim by angle to form a proper loop
      rim.sort((a, b) => a.angle - b.angle);
      // center
      baseVertices.push(0, 0, 0);
      for (let r of rim) {
        baseVertices.push(r.x, r.y, r.z);
      }
      // Build base indices locally
      for (let i = 1; i <= rim.length; i++) {
        const next = i < rim.length ? i + 1 : 1;
        baseIndices.push(0, i, next);
      }
    } else {
      // Fallback: parametric ellipse in XZ plane (matching SphereGeometry equator)
      baseVertices.push(0, 0, 0);
      for (let i = 0; i < this.segments; i++) {
        const theta = (i / this.segments) * Math.PI * 2;
        const x = this.xradius * Math.cos(theta);
        const y = 0;
        const z = this.yradius * Math.sin(theta);
        baseVertices.push(x, y, z);
      }
      for (let i = 1; i <= this.segments; i++) {
        const next = i < this.segments ? i + 1 : 1;
        baseIndices.push(0, i, next);
      }
    }

    const totalVertices = new Float32Array(
      curvedVertices.length + baseVertices.length
    );
    totalVertices.set(curvedVertices, 0);
    totalVertices.set(baseVertices, curvedVertices.length);

    // Get indices from curved geometry
    const curvedIndices = Array.from(
      curvedGeometry.index?.array || []
    ) as number[];
    // Offset base indices by the number of curved vertices
    const offsetBaseIndices = baseIndices.map(
      (index) => index + curvedVertexCount
    );
    // Combine indices
    const totalIndices = [...curvedIndices, ...offsetBaseIndices];

    // Create final geometry
    const finalGeometry = new THREE.BufferGeometry();
    finalGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(totalVertices, 3)
    );
    finalGeometry.setIndex(totalIndices);
    finalGeometry.computeVertexNormals();
    if (finalGeometry.boundingSphere === null) {
      finalGeometry.computeBoundingSphere();
    }
    this.geometry = finalGeometry;
    this.normalizeGeometry();
    return this.geometry;
  }

  /**
   * Calculates a point on the hemiellipsoid surface using parametric equations.
   * We use Y as the vertical axis (consistent with the generated geometry). phi=0 at the top (y=max),
   * phi=π/2 at the rim (y=0). theta runs around the vertical axis (x-z plane).
   * @param phi Polar angle from positive Y axis (0 .. π/2)
   * @param theta Azimuthal angle in XZ plane from +X (0 .. 2π)
   */
  point(phi: number, theta: number): Vector3 {
    phi = Math.max(0, Math.min(Math.PI / 2, phi));
    const x = this.xradius * Math.sin(phi) * Math.cos(theta);
    const z = this.zradius * Math.sin(phi) * Math.sin(theta);
    const y = this.yradius * Math.cos(phi);
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
      console.log("ShortestDistance called for HemiEllipsoid and Plane");
      res = ShortestDistance3D.HemiellipsoidPlane(this, geometry as Plane);
    } else if (isGeometryType3D(geometry.type)) {
      throw new Error(
        "Shortest distance not implemented for this geometry type."
      );
    }
    console.log("ShortestDistance result:", res);
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
