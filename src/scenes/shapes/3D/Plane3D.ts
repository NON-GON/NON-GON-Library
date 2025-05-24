import { Base3DScene } from '../../Base3DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Plane3D extends Base3DScene {
  private center: Vector3;
  private rotation: Vector3;
  private width: number;
  private height: number;
  private segments: number;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              rotation: Vector3,
              width: number,
              height: number,
              segments: number,
              color: number) {
    super(canvas);
    this.center = center;
    this.rotation = rotation;
    this.width = width;
    this.height = height;
    this.segments = segments;
    this.color = color;
  }

  public getParams() {
    return {
      center: this.center,
      rotation: this.rotation,
      width: this.width,
      height: this.height,
      segments: this.segments
    };
  }

  protected getSliderParams() {
    return {
      center_x: this.center.x,
      center_y: this.center.y,
      center_z: this.center.z,
      rotation_x: this.rotation.x,
      rotation_y: this.rotation.y,
      rotation_z: this.rotation.z,
      width: this.width,
      height: this.height
    }
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Plane, 'Plane3D', this.getParams());
    const mesh = this.geometryManager.getGeometryMesh('Plane3D', this.color, 'mesh');
    this.makeSliders("Plane", this.getSliderParams());
    this.scene.add(mesh);
  }
}
