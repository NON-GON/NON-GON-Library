import { Base3DScene } from "../../Base3DScene";
import { GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class StrictlyConvexShape3D extends Base3DScene {
  private center: Vector3;
  private rotation: Vector3;
  private segments: number;
  private id: string;
  private color: number;

  constructor(
    canvas: HTMLCanvasElement,
    center: Vector3,
    rotation: Vector3,
    segments: number,
    id: string,
    color: number
  ) {
    super(canvas);
    this.center = center;
    this.rotation = rotation;
    this.segments = segments;
    this.id = id;
    this.color = color;
  }

  public getParams() {
    return {
      center: this.center,
      rotation: this.rotation,
      segments: this.segments,
    };
  }

  protected getSliderParams() {
    return {
      center_x: this.center.x,
      center_y: this.center.y,
      center_z: this.center.z,
      rotation_x: this.rotation.x,
      rotation_y: this.rotation.y,
      rotation_z: this.rotation.z
    }
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(
      GeometryType3D.Convex,
      this.id,
      this.getParams()
    );
    const mesh = this.geometryManager.getGeometryMesh(
      this.id,
      this.color,
      "mesh"
    );
    this.makeSliders(this.id, this.getSliderParams());
    this.scene.add(mesh);
  }
}
