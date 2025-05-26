import { Base3DScene } from '../../Base3DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Plane3D extends Base3DScene {
  private center: Vector3;
  private rotation: Vector3;
  private width: number;
  private height: number;
  private segments: number;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              rotation: Vector3,
              width: number,
              height: number,
              segments: number,
              id: string,
              color: number) {
    super(canvas);
    this.center = center;
    this.rotation = rotation;
    this.width = width;
    this.height = height;
    this.segments = segments;
    this.id = id;
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

  public getSliderParams() {
    return {
      width: this.width,
      height: this.height
    }
  }

  public getId() {
    return this.id;
  }
  
  public getColor() {
    return this.color;
  }
  
  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Plane, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'mesh');
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
