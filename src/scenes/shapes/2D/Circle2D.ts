import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Circle2D extends Base2DScene {
  private center: Vector2;
  private radius: number;
  private rotation: Vector2;
  private segments: number;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              radius: number,
              rotation: Vector2,
              segments: number,
              color: number) {
    super(canvas);
    this.center = center;
    this.radius = radius;
    this.rotation = rotation;
    this.segments = segments;
    this.color = color;
  }

  protected buildScene(): void {
    let params = { 
      center: this.center,
      radius: this.radius,
      rotation: this.rotation,
      segments: this.segments
    };
    this.geometryManager.createGeometry(GeometryType2D.Circle, 'Circle2D', params);
    const mesh = this.geometryManager.getGeometryMesh('Circle2D', this.color);
    this.scene.add(mesh);
  }
}
