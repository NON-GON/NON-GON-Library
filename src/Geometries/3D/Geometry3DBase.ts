import { degToRad } from "three/src/math/MathUtils";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";
import { IGeometry3D } from "./IGeometry3D";
import * as THREE from "three";

export abstract class Geometry3DBase implements IGeometry3D {
  center: Vector3 = new Vector3(0, 0, 0);
  segments: number = 100;
  abstract type: GeometryType3D;
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

  public getType(): GeometryType3D {
    return this.type;
  }

  protected normalizeGeometry() {
    if (this.geometry !== null && this.geometry !== undefined) {
      // Remove translation to origin: keep geometry at world center
      // Only apply rotation around the current center
      const geometryCenter = this.getCenter();

      // Apply rotation around the geometry's center
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

      // Ensure geometry is positioned at the world center
      this.geometry.translate(
        geometryCenter.x,
        geometryCenter.y,
        geometryCenter.z
      );
    }
  }

  ProximityQuery(
    _geometry: IGeometry3D | IGeometry2D,
    _method?: string
  ): boolean {
    throw new Error("Proximity query not implemented for this geometry type.");
  }

  ShortestDistance(_geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error("Method not implemented.");
  }

  public LocalSpaceToWorldSpace(point: Vector3): Vector3 {
    // Convert rotation from degrees to radians
    const rotX = degToRad(
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x
    );
    const rotY = degToRad(
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y
    );
    const rotZ = degToRad(
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z
    );
    // Step 1: Rotate point by geometry rotation using Euler/Matrix4
    const euler = new THREE.Euler(rotX, rotY, rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    const v = new THREE.Vector3(point.x, point.y, point.z);
    v.applyMatrix4(matrix);
    // Step 2: Translate back to world space
    return new Vector3(
      v.x + this.center.x,
      v.y + this.center.y,
      v.z + this.center.z
    );
  }

  public WorldSpaceToLocalSpace(point: Vector3): Vector3 {
    // Step 1: Translate point to geometry center
    const translated = new THREE.Vector3(
      point.x - this.center.x,
      point.y - this.center.y,
      point.z - this.center.z
    );
    // Convert rotation from degrees to radians
    const rotX = degToRad(
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x
    );
    const rotY = degToRad(
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y
    );
    const rotZ = degToRad(
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z
    );
    // Step 2: Rotate point by negative geometry rotation using Euler/Matrix4
    const euler = new THREE.Euler(-rotX, -rotY, -rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    translated.applyMatrix4(matrix);
    return new Vector3(translated.x, translated.y, translated.z);
  }

  public TransformDirection(direction: Vector3): Vector3 {
    // Convert rotation from degrees to radians
    const rotX = degToRad(
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x
    );
    const rotY = degToRad(
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y
    );
    const rotZ = degToRad(
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z
    );
    // Only rotate, do not translate
    const euler = new THREE.Euler(rotX, rotY, rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    const v = new THREE.Vector3(direction.x, direction.y, direction.z);
    v.applyMatrix4(matrix);
    return new Vector3(v.x, v.y, v.z);
  }

  public InverseTransformDirection(direction: Vector3): Vector3 {
    // Convert rotation from degrees to radians
    const rotX = degToRad(
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x
    );
    const rotY = degToRad(
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y
    );
    const rotZ = degToRad(
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z
    );
    // Only rotate, do not translate
    const euler = new THREE.Euler(-rotX, -rotY, -rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    const v = new THREE.Vector3(direction.x, direction.y, direction.z);
    v.applyMatrix4(matrix);
    return new Vector3(v.x, v.y, v.z);
  }

  public TransformPoint(point: Vector3): Vector3 {
    // Convert rotation from degrees to radians
    const rotX = degToRad(
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x
    );
    const rotY = degToRad(
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y
    );
    const rotZ = degToRad(
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z
    );
    // Step 1: Rotate point by geometry rotation using Euler/Matrix4
    const euler = new THREE.Euler(rotX, rotY, rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    const v = new THREE.Vector3(point.x, point.y, point.z);
    v.applyMatrix4(matrix);
    // Step 2: Translate to world space
    return new Vector3(
      v.x + this.center.x,
      v.y + this.center.y,
      v.z + this.center.z
    );
  }

  public InverseTransformPoint(point: Vector3): Vector3 {
    // Step 1: Translate point to local space
    const translated = new THREE.Vector3(
      point.x - this.center.x,
      point.y - this.center.y,
      point.z - this.center.z
    );
    // Convert rotation from degrees to radians
    const rotX = degToRad(
      isNaN(this.rotation.x) || this.rotation.x === undefined
        ? 0
        : this.rotation.x
    );
    const rotY = degToRad(
      isNaN(this.rotation.y) || this.rotation.y === undefined
        ? 0
        : this.rotation.y
    );
    const rotZ = degToRad(
      isNaN(this.rotation.z) || this.rotation.z === undefined
        ? 0
        : this.rotation.z
    );
    // Step 2: Rotate point by negative geometry rotation using Euler/Matrix4
    const euler = new THREE.Euler(-rotX, -rotY, -rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    translated.applyMatrix4(matrix);
    return new Vector3(translated.x, translated.y, translated.z);
  }
}
