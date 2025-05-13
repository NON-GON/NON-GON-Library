import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class LineSegment2D extends Base2DScene {
  private start: Vector2;
  private end: Vector2;
  private rotation: Vector2;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              start: Vector2,
              end: Vector2,
              rotation: Vector2,
              color: number) {
    super(canvas);
    this.start = start;
    this.end = end;
    this.rotation = rotation;
    this.color = color;
  }

  public getParams() {
    return { 
      start: this.start,
      end: this.end,
      rotation: this.rotation
    };
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Line, 'Line2D', this.getParams());
    const mesh = this.geometryManager.getGeometryMesh('Line2D', this.color, 'line');
    this.scene.add(mesh);
  }
}
