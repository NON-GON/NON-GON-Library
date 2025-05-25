import { Base2DScene } from "../../Base2DScene";
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Circle2D extends Base2DScene {
  private center: Vector2;
  private radius: number;
  private rotation: Vector2;
  private segments: number;
  private id: string;
  private color: number;

  constructor(
    canvas: HTMLCanvasElement,
    center: Vector2,
    radius: number,
    rotation: Vector2,
    segments: number,
    id: string,
    color: number
  ) {
    super(canvas);
    this.center = center;
    this.radius = radius;
    this.rotation = rotation;
    this.segments = segments;
    this.id = id;
    this.color = color;
  }

  public getParams() {
    return {
      center: this.center,
      radius: this.radius,
      rotation: this.rotation,
      segments: this.segments,
    };
  }

  protected getSliderParams() {
    return {
      center_x: this.center.x,
      center_y: this.center.y,
      rotation: this.rotation,
      radius: this.radius
    }
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(
      GeometryType2D.Circle,
      this.id,
      this.getParams()
    );
    const mesh = this.geometryManager.getGeometryMesh(
      this.id,
      this.color,
      "line"
    );
    this.makeSliders(this.id, this.getSliderParams());
    this.scene.add(mesh);
  }
}
