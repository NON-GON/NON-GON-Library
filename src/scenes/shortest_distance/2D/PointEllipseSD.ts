import { Base2DScene } from "../../Base2DScene";
import { Point2D } from "../../shapes/2D/Point2D";
import { Ellipse2D } from "../../shapes/2D/Ellipse2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class PointEllipseSD extends Base2DScene {
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
    this.geometryManager.createGeometry(GeometryType2D.Point, this.point.getId(), this.point.getParams());
    const pointMesh = this.geometryManager.getGeometryMesh(this.point.getId(), this.point.getColor(), "mesh");
    this.scene.add(pointMesh);

    this.geometryManager.createGeometry(GeometryType2D.Ellipse, this.ellipse.getId(), this.ellipse.getParams());
    const ellipseMesh = this.geometryManager.getGeometryMesh(this.ellipse.getId(), this.ellipse.getColor(), "mesh");
    this.scene.add(ellipseMesh);

    this.makeSlidersInteraction(this.point, this.ellipse, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(this.point.getId(), this.ellipse.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
