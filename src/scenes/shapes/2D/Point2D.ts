import { Base2DScene } from "../../Base2DScene";
import { GeometryManager } from "../../../Geometries/GeometryManager";
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Point2D extends Base2DScene {
  private geometryManager = new GeometryManager();
  private location: Vector2;

  constructor(canvas: HTMLCanvasElement, x: number, y: number) {
    super(canvas);
    this.location = new Vector2(x, y);
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Point, 'Point2D', this.location);
    const mesh = this.geometryManager.getGeometryMesh('Point2D', 0xFFFFFF);
    this.scene.add(mesh);
  }
}
