import { Base2DScene } from "../../Base2DScene";
import { Point2D } from "../../shapes/2D/Point2D";
import { Ellipse2D } from "../../shapes/2D/Ellipse2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class PointEllipse2D extends Base2DScene {
  private point: Point2D;
  private ellipse: Ellipse2D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    point: Point2D,
    ellipse: Ellipse2D,
    colorConnection: number
  ) {
    super(canvas);
    this.point = point;
    this.ellipse = ellipse;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    const pointId = this.point.getId()
    const pointColor = this.point.getColor()
    this.geometryManager.createGeometry(GeometryType2D.Point, pointId, this.point.getParams());
    const pointMesh = this.geometryManager.getGeometryMesh(pointId, pointColor, "line");
    this.scene.add(pointMesh);

    const ellipseId = this.ellipse.getId();
    const ellipseColor = this.ellipse.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, ellipseId, this.ellipse.getParams());
    const ellipseMesh = this.geometryManager.getGeometryMesh(ellipseId, ellipseColor, "line");
    this.scene.add(ellipseMesh);

    this.makeSlidersInteraction(pointId, pointColor, this.point.getSliderParams(),
                                ellipseId, ellipseColor, this.ellipse.getSliderParams(),
                                this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(pointId, ellipseId);
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
