import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Superellipse2D extends Base2DScene {
  private center: Vector2;
  private xradius: number;
  private yradius: number;
  private exponent: number;
  private rotation: Vector2;
  private segments: number;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              xradius: number,
              yradius: number,
              exponent: number,
              rotation: Vector2,
              segments: number,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.exponent = exponent;
    this.rotation = rotation;
    this.segments = segments;
    this.color = color;
  }

  public getParams() {
    return { 
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      exponent: this.exponent,
      rotation: this.rotation,
      segments: this.segments
    };
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Supperellipse, 'Superellipse2D', this.getParams());
    const mesh = this.geometryManager.getGeometryMesh('Superellipse2D', this.color, 'line');
    this.scene.add(mesh);
  }
}
