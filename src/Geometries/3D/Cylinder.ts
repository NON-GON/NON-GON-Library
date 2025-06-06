import * as THREE from "three";
import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "./IGeometry3D";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";
import { Geometry3DBase } from "./Geometry3DBase";
import { ProximityQuery3D } from "../../Calc/ProximityQuery/ProximityQuery3D";

export class Cylinder extends Geometry3DBase implements IGeometry3D {
  readonly xradius: number;
  readonly yradius: number;
  readonly height: number;
  public type: GeometryType3D = GeometryType3D.Cylinder;

  constructor(
    center: Vector3,
    xradius: number,
    yradius: number,
    height: number,
    rotation: Vector3,
    segments: number
  ) {
    super();
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.height = height;
    this.rotation = rotation;
    this.segments = segments;
  }

  ShortestDistance(_geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3] {
    throw new Error(
      "Shortest distance not implemented for this geometry type."
    );
  }
  ProximityQuery(
    geometry: IGeometry3D | IGeometry2D,
    method?: string
  ): boolean {
    if (method == null || method == undefined) {
      method = "Chittawadigi";
    }
    if (method == "Chittawadigi" && geometry.type == GeometryType3D.Cylinder) {
      return ProximityQuery3D.Cylinder_Cylinder_Chittawadigi(
        this,
        geometry as Cylinder
      );
    } else {
      if (geometry.type != GeometryType3D.Cylinder) {
        throw new Error(
          "Proximity query not implemented for this pair of geometry type."
        );
      }
      throw new Error("Proximity query not implemented for this method.");
    }
  }
  public forward(): Vector3 {
    // Convert degrees to radians
    const rotX = THREE.MathUtils.degToRad(this.rotation.x);
    const rotY = THREE.MathUtils.degToRad(this.rotation.y);
    const rotZ = THREE.MathUtils.degToRad(this.rotation.z);
    // Local forward vector (z-axis)
    const forward = new THREE.Vector3(0, 0, 1);
    // Apply -90 degrees rotation around X axis first
    const euler = new THREE.Euler(rotX, rotY, rotZ, "XYZ");
    forward.applyEuler(euler);
    return new Vector3(forward.x, forward.y, forward.z).normalize();
  }

  public getGeometry(): any {
    if (this.geometry !== null && this.geometry !== undefined) {
      return this.geometry;
    } else {
      console.log("Creating Cylinder Geometry");
      const cylinderGeometry = new THREE.CylinderGeometry(
        this.xradius,
        this.yradius/4,
        this.height,
        this.segments
      );
      // Apply -90 degrees rotation around X axis to align base as requested
      const baseRotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
      cylinderGeometry.applyMatrix4(baseRotation);
      this.geometry = cylinderGeometry;

      this.normalizeGeometry();
      return this.geometry;
    }
  }
}
