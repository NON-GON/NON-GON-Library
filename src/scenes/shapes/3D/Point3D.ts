import { Base3DScene } from '../../Base3DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Point3D extends Base3DScene {
  private center: Vector3;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              id: string,
              color: number) {
    super(canvas);
    this.center = center;
    this.id = id;
    this.color = color;
  }

  public getParams() {
    return { center: this.center };
  }

  public getSliderParams() {
    return {}
  }

  public getId() {
    return this.id;
  }
  
  public getColor() {
    return this.color;
  }
  
  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Point, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'mesh');
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
