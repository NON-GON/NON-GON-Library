import { Base2DScene } from "../../Base2DScene";
import { Ellipse2D } from "../../shapes/2D/Ellipse2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class EllipseEllipse2D extends Base2DScene {
  private ellipse1: Ellipse2D;
  private colorEllipse1: number;
  private ellipse2: Ellipse2D;
  private colorEllipse2: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    ellipse1: Ellipse2D,
    colorEllipse1: number,
    ellipse2: Ellipse2D,
    colorEllipse2: number,
    colorConnection: number
  ) {
    super(canvas);
    this.ellipse1 = ellipse1;
    this.colorEllipse1 = colorEllipse1;
    this.ellipse2 = ellipse2;
    this.colorEllipse2 = colorEllipse2;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, 'Ellipse1', this.ellipse1.getParams());
    const ellipse1Mesh = this.geometryManager.getGeometryMesh('Ellipse1', this.colorEllipse1, "line");
    this.scene.add(ellipse1Mesh);

    this.geometryManager.createGeometry(GeometryType2D.Ellipse, 'Ellipse2', this.ellipse2.getParams());
    const ellipse2Mesh = this.geometryManager.getGeometryMesh('Ellipse2', this.colorEllipse2, "line");
    this.scene.add(ellipse2Mesh);

    let points = this.geometryManager.calculateMinimumDistance('Ellipse1', 'Ellipse2');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
