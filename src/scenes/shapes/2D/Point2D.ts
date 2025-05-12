import { Base2DScene } from '../../Base2DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector2 } from "../../../Calc/Util/Utils";

export class Point2D extends Base2DScene {
  private center: Vector2;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector2,
              color: number) {
    super(canvas);
    this.center = center;
    this.color = color;
  }

  protected buildScene(): void {
    let params = { center: this.center };
    this.geometryManager.createGeometry(GeometryType2D.Point, 'Point2D', params);
    const mesh = this.geometryManager.getGeometryMesh('Point2D', this.color);
    this.scene.add(mesh);
  }
}
