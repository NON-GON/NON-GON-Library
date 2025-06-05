import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2, Vector3 } from "../../../Calc/Util/Utils";

export class ConvexLine2D extends Base2DScene {
  private center: Vector2;
  private rotation: Vector3;
  private segments: number;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              rotation: Vector3,
              segments: number,
              id: string,
              color: number) {
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
      segments: this.segments
    };
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
    this.geometryManager.createGeometry(GeometryType2D.ConvexLine, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'line', 2)
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
