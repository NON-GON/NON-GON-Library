import { Base2DScene } from "../../Base2DScene";
import { Point2D } from "../../shapes/2D/Point2D";
import { Ellipse2D } from "../../shapes/2D/Ellipse2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class PointEllipse2D extends Base2DScene {
  private point: Point2D;
  private colorPoint: number;
  private ellipse: Ellipse2D;
  private colorEllipse: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    point: Point2D,
    colorPoint: number,
    ellipse: Ellipse2D,
    colorEllipse: number,
    colorConnection: number
  ) {
    super(canvas);
    this.point = point;
    this.colorPoint = colorPoint;
    this.ellipse = ellipse;
    this.colorEllipse = colorEllipse;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Point, 'Point2D', this.point.getParams());
    const pointMesh = this.geometryManager.getGeometryMesh('Point2D', this.colorPoint, "line");
    this.scene.add(pointMesh);

    this.geometryManager.createGeometry(GeometryType2D.Ellipse, 'Ellipse2D', this.ellipse.getParams());
    const ellipseMesh = this.geometryManager.getGeometryMesh('Ellipse2D', this.colorEllipse, "line");
    this.scene.add(ellipseMesh);

    let points = this.geometryManager.calculateMinimumDistance('Point2D', 'Ellipse2D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
