import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Point2D extends Base2DScene {
  private center: Vector2;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
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
