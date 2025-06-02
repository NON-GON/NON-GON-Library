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

  ShortestDistance(_geometry: IGeometry2D | IGeometry3D): [Vector3, Vector3] {
    throw new Error("Method not implemented.");
  }

  ProximityQuery(
    _geometry: IGeometry2D | IGeometry3D,
    _method?: string
  ): boolean {
    throw new Error("Method not implemented for this geometry.");
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

    // Step 1: Rotate point by ellipsoid rotation using Euler/Matrix4
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
    // Step 1: Translate point to ellipsoid's center
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

    // Step 2: Rotate point by negative ellipsoid rotation using Euler/Matrix4
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

    // Step 1: Rotate point by ellipsoid rotation using Euler/Matrix4
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

    // Step 2: Rotate point by negative ellipsoid rotation using Euler/Matrix4
    const euler = new THREE.Euler(-rotX, -rotY, -rotZ, "XYZ");
    const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
    translated.applyMatrix4(matrix);
    return new Vector3(translated.x, translated.y, translated.z);
  }
}
