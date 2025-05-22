import { Base2DScene } from "../../Base2DScene";
import { ConvexCircle2D } from "../../shapes/2D/ConvexCircle2D";
import { Circle2D } from "../../shapes/2D/Circle2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class ConvexCircleCircle2D extends Base2DScene {
  private convexCircle: ConvexCircle2D;
  private colorConvexCircle: number;
  private circle: Circle2D;
  private colorCircle: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    convexCircle: ConvexCircle2D,
    colorConvexCircle: number,
    circle: Circle2D,
    colorCircle: number,
    colorConnection: number
  ) {
    super(canvas);
    this.convexCircle = convexCircle;
    this.colorConvexCircle = colorConvexCircle;
    this.circle = circle;
    this.colorCircle = colorCircle;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.ConvexCircle, 'ConvexCircle2D', this.convexCircle.getParams());
    const convexCircleMesh = this.geometryManager.getGeometryMesh('ConvexCircle2D', this.colorConvexCircle, "line");
    this.scene.add(convexCircleMesh);

    this.geometryManager.createGeometry(GeometryType2D.Circle, 'Circle2D', this.circle.getParams());
    const circleMesh = this.geometryManager.getGeometryMesh('Circle2D', this.colorCircle, "line");
    this.scene.add(circleMesh);

    let points = this.geometryManager.calculateMinimumDistance('ConvexCircleD', 'Circle2D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
