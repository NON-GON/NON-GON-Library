import { Base2DScene } from "../../Base2DScene";
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2, Vector3 } from "../../../Calc/Util/Utils";

export class Circle2D extends Base2DScene {
  private center: Vector2;
  private radius: number;
  private rotation: Vector2;
  private segments: number;
  private color: number;

  constructor(
    canvas: HTMLCanvasElement,
    center: Vector2,
    radius: number,
    rotation: Vector2,
    segments: number,
    color: number
  ) {
    super(canvas);
    this.center = center;
    this.radius = radius;
    this.rotation = rotation;
    this.segments = segments;
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

  protected buildScene(): void {
    this.geometryManager.createGeometry(
      GeometryType2D.Circle,
      "Circle2D",
      this.getParams()
    );
    this.geometryManager.changePosition(
      "Circle2D",
      new Vector3(this.center.x, this.center.y, 0)
    );
    const mesh = this.geometryManager.getGeometryMesh(
      "Circle2D",
      this.color,
      "line"
    );
    this.scene.add(mesh);
  }
}
