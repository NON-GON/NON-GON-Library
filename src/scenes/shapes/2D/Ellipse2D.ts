import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Ellipse2D extends Base2DScene {
  private center: Vector2;
  private xradius: number;
  private yradius: number;
  private rotation: Vector2;
  private segments: number;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              xradius: number,
              yradius: number,
              rotation: Vector2,
              segments: number,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.rotation = rotation;
    this.segments = segments;
    this.color = color;
  }

  public getParams() {
    return { 
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      rotation: this.rotation,
      segments: this.segments
    };
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, 'Ellipse2D', this.getParams());
    const mesh = this.geometryManager.getGeometryMesh('Ellipse2D', this.color, 'line');
    this.scene.add(mesh);
  }
}
