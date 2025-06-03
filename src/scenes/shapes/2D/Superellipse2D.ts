import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2, Vector3 } from "../../../Calc/Util/Utils";

export class Superellipse2D extends Base2DScene {
  private center: Vector2;
  private xradius: number;
  private yradius: number;
  private exponent: number;
  private rotation: Vector3;
  private segments: number;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              xradius: number,
              yradius: number,
              exponent: number,
              rotation: Vector3,
              segments: number,
              id: string,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.exponent = exponent;
    this.rotation = rotation;
    this.segments = segments;
    this.id = id;
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

  public getSliderParams() {
    return {
      x_radius: this.xradius,
      y_radius: this.yradius,
      exponent: this.exponent
    }
  }

  public getId() {
    return this.id;
  }
  
  public getColor() {
    return this.color;
  }
  
  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Supperellipse, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'mesh');
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
