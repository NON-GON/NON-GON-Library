import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class GeneralSmoothConvexShape2D extends Base2DScene {
  private center: Vector2;
  private xradius: number;
  private yradius: number;
  private rotation: Vector2;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              xradius: number,
              yradius: number,
              rotation: Vector2,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.rotation = rotation;
    this.color = color;
  }

  protected buildScene(): void {
    let params = { 
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      rotation: this.rotation
    };
    this.geometryManager.createGeometry(GeometryType2D.Circle, 'Ellipse2D', params);
    const mesh = this.geometryManager.getGeometryMesh('Ellipse2D', this.color);
    this.scene.add(mesh);
  }
}
