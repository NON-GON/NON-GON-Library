import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "../3D/IGeometry3D";
import { GeometryType2D } from "../GeoTypes";
import { IGeometry2D } from "./IGeometry2D";
import * as THREE from "three";

export abstract class Geometry2DBase implements IGeometry2D {
  center: Vector3 = new Vector3(0, 0, 0);
  segments: number = 100;
  abstract type: GeometryType2D;
  geometry: any = null;
  rotation: Vector3 = new Vector3(0, 0, 0);

  abstract getGeometry(): any;
  public getCenter(): Vector3 {
    return this.center;
  }

  public getSegments(): number {
    return this.segments;
  }

  public getRotation(): Vector3 {
    return this.rotation;
  }

  public getType(): GeometryType2D {
    return this.type;
  }

  protected normalizeGeometry() {
    if (this.geometry) {

      const geometryCenter = this.getCenter();

      this.geometry.translate(
        -geometryCenter.x,
        -geometryCenter.y,
        -geometryCenter.z
      );

      const radRotationX = degToRad(this.rotation.x);
      const radRotationY = degToRad(this.rotation.y);
      const radRotationZ = degToRad(this.rotation.z);
      const rotationEuler = new THREE.Euler(
        radRotationX,
        radRotationY,
        radRotationZ,
        "XYZ"
      );
      const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
        rotationEuler
      );

      this.geometry.applyMatrix4(rotationMatrix);

      this.geometry.translate(
        geometryCenter.x,
        geometryCenter.y,
        geometryCenter.z
      );
    }
  }

  MinimumDistance(_geometry: IGeometry2D | IGeometry3D): [Vector3, Vector3] {
    throw new Error("Method not implemented.");
  }

  ProximityQuery(
    _geometry: IGeometry2D | IGeometry3D,
    _method?: string
  ): boolean {
    throw new Error("Method not implemented for this geometry.");
  }
  public LocalSpaceToWorldSpace(point: Vector3): Vector3 {
    // Ensure rotation values are valid numbers
    const rotX =
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x;
    const rotY =
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y;
    const rotZ =
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z;

    // Step 1: Rotate point by ellipsoid rotation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosZ = Math.cos(rotZ);
    const sinZ = Math.sin(rotZ);

    // Apply rotation around X-axis
    const rotatedX1 = point.x;
    const rotatedY1 = point.y * cosX - point.z * sinX;
    const rotatedZ1 = point.y * sinX + point.z * cosX;

    // Apply rotation around Y-axis
    const rotatedX2 = rotatedX1 * cosY - rotatedZ1 * sinY;
    const rotatedY2 = rotatedY1;
    const rotatedZ2 = rotatedX1 * sinY + rotatedZ1 * cosY;

    // Apply rotation around Z-axis
    const worldX = rotatedX2 * cosZ - rotatedY2 * sinZ;
    const worldY = rotatedX2 * sinZ + rotatedY2 * cosZ;
    const worldZ = rotatedZ2;

    // Step 2: Translate back to world space
    return new Vector3(
      worldX + this.center.x,
      worldY + this.center.y,
      worldZ + this.center.z
    );
  }
  public WorldSpaceToLocalSpace(point: Vector3): Vector3 {
    // Step 1: Translate point to ellipsoid's center
    const translatedX = point.x - this.center.x;
    const translatedY = point.y - this.center.y;
    const translatedZ = point.z - this.center.z;

    // Step 2: Rotate point by negative ellipsoid rotation
    const cosX = Math.cos(-this.rotation.x);
    const sinX = Math.sin(-this.rotation.x);
    const cosY = Math.cos(-this.rotation.y);
    const sinY = Math.sin(-this.rotation.y);
    const cosZ = Math.cos(-this.rotation.z);
    const sinZ = Math.sin(-this.rotation.z);

    // Apply rotation around Z-axis
    const rotatedX1 = translatedX * cosZ - translatedY * sinZ;
    const rotatedY1 = translatedX * sinZ + translatedY * cosZ;
    const rotatedZ1 = translatedZ;

    // Apply rotation around Y-axis
    const rotatedX2 = rotatedX1 * cosY + rotatedZ1 * sinY;
    const rotatedY2 = rotatedY1;
    const rotatedZ2 = -rotatedX1 * sinY + rotatedZ1 * cosY;

    // Apply rotation around X-axis
    const localX = rotatedX2;
    const localY = rotatedY2 * cosX - rotatedZ2 * sinX;
    const localZ = rotatedY2 * sinX + rotatedZ2 * cosX;

    return new Vector3(localX, localY, localZ);
  }

  public TransformDirection(direction: Vector3): Vector3 {
    // Ensure rotation values are valid numbers
    const rotX =
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x;
    const rotY =
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y;
    const rotZ =
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z;

    // Step 1: Rotate point by ellipsoid rotation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosZ = Math.cos(rotZ);
    const sinZ = Math.sin(rotZ);

    // Apply rotation around X-axis
    const rotatedX1 = direction.x;
    const rotatedY1 = direction.y * cosX - direction.z * sinX;
    const rotatedZ1 = direction.y * sinX + direction.z * cosX;

    // Apply rotation around Y-axis
    const rotatedX2 = rotatedX1 * cosY - rotatedZ1 * sinY;
    const rotatedY2 = rotatedY1;
    const rotatedZ2 = rotatedX1 * sinY + rotatedZ1 * cosY;

    // Apply rotation around Z-axis
    const transformedX = rotatedX2 * cosZ - rotatedY2 * sinZ;
    const transformedY = rotatedX2 * sinZ + rotatedY2 * cosZ;
    const transformedZ = rotatedZ2;

    return new Vector3(transformedX, transformedY, transformedZ);
  }

  public InverseTransformDirection(direction: Vector3): Vector3 {
    // Ensure rotation values are valid numbers
    const rotX =
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x;
    const rotY =
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y;
    const rotZ =
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z;

    // Step 1: Rotate point by ellipsoid rotation
    const cosX = Math.cos(-rotX);
    const sinX = Math.sin(-rotX);
    const cosY = Math.cos(-rotY);
    const sinY = Math.sin(-rotY);
    const cosZ = Math.cos(-rotZ);
    const sinZ = Math.sin(-rotZ);

    // Apply rotation around Z-axis
    const rotatedX1 = direction.x * cosZ - direction.y * sinZ;
    const rotatedY1 = direction.x * sinZ + direction.y * cosZ;
    const rotatedZ1 = direction.z;

    // Apply rotation around Y-axis
    const rotatedX2 = rotatedX1 * cosY + rotatedZ1 * sinY;
    const rotatedY2 = rotatedY1;
    const rotatedZ2 = -rotatedX1 * sinY + rotatedZ1 * cosY;

    // Apply rotation around X-axis
    const transformedX = rotatedX2;
    const transformedY = rotatedY2 * cosX - rotatedZ2 * sinX;
    const transformedZ = rotatedY2 * sinX + rotatedZ2 * cosX;

    return new Vector3(transformedX, transformedY, transformedZ);
  }

  public TransformPoint(point: Vector3): Vector3 {
    // Step 1: Rotate point by ellipsoid rotation
    const rotatedPoint = this.TransformDirection(point);

    // Step 2: Translate to world space
    return new Vector3(
      rotatedPoint.x + this.center.x,
      rotatedPoint.y + this.center.y,
      rotatedPoint.z + this.center.z
    );
  }

  public InverseTransformPoint(point: Vector3): Vector3 {
    // Step 1: Translate point to local space
    const translatedX = point.x - this.center.x;
    const translatedY = point.y - this.center.y;
    const translatedZ = point.z - this.center.z;

    // Step 2: Rotate point by negative ellipsoid rotation
    return this.InverseTransformDirection(
      new Vector3(translatedX, translatedY, translatedZ)
    );
  }
}
