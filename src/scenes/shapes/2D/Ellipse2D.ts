import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2, Vector3 } from "../../../Calc/Util/Utils";

export class Ellipse2D extends Base2DScene {
  private center: Vector2;
  private xradius: number;
  private yradius: number;
  private rotation: Vector3;
  private segments: number;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              xradius: number,
              yradius: number,
              rotation: Vector3,
              segments: number,
              id: string,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
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
      rotation: this.rotation,
      segments: this.segments
    };
  }

  public getSliderParams() {
    return {
      x_radius: this.xradius,
      y_radius: this.yradius
    }
  }

  public getId() {
    return this.id;
  }
  
  public getColor() {
    return this.color;
  }
  
  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'mesh');
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
