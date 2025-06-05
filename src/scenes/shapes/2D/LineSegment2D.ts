import { Base2DScene } from "../../Base2DScene";
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2, Vector3 } from "../../../Calc/Util/Utils";

export class LineSegment2D extends Base2DScene {
  private start: Vector2;
  private end: Vector2;
  private rotation: Vector3;
  private id: string;
  private color: number;

  constructor(
    canvas: HTMLCanvasElement,
    start: Vector2,
    end: Vector2,
    rotation: Vector3,
    id: string,
    color: number
  ) {
    super(canvas);
    this.start = start;
    this.end = end;
    this.rotation = rotation;
    this.id = id;
    this.color = color;
  }

  public getParams() {
    return {
      start: this.start,
      end: this.end,
      rotation: this.rotation,
    };
  }

  public getSliderParams() {
    return {
      start_x: this.start.x,
      start_y: this.start.y,
      end_x: this.end.x,
      end_y: this.end.y,
      rotation: this.rotation,
    };
  }

  public getId() {
    return this.id;
  }

  public getColor() {
    return this.color;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(
      GeometryType2D.Line,
      this.id,
      this.getParams()
    );
    const mesh = this.geometryManager.getGeometryMesh(
      this.id,
      this.color,
      "line",
      3
    );
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams(), this);
    this.scene.add(mesh);
  }
}
