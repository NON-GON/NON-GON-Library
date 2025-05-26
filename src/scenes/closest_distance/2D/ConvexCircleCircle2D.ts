import { Base2DScene } from "../../Base2DScene";
import { ConvexCircle2D } from "../../shapes/2D/ConvexCircle2D";
import { Circle2D } from "../../shapes/2D/Circle2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class ConvexCircleCircle2D extends Base2DScene {
  private convexCircle: ConvexCircle2D;
  private circle: Circle2D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    convexCircle: ConvexCircle2D,
    circle: Circle2D,
    colorConnection: number
  ) {
    super(canvas);
    this.convexCircle = convexCircle;
    this.circle = circle;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    const convexCircleId = this.convexCircle.getId();
    const convexCircleColor = this.convexCircle.getColor();
    this.geometryManager.createGeometry(
      GeometryType2D.ConvexCircle,
      convexCircleId,
      this.convexCircle.getParams()
    );
    const convexCircleMesh = this.geometryManager.getGeometryMesh(
      convexCircleId,
      convexCircleColor,
      "line"
    );
    this.scene.add(convexCircleMesh);

    const circleId = this.circle.getId();
    const circleColor = this.circle.getColor();
    this.geometryManager.createGeometry(
      GeometryType2D.Circle,
      circleId,
      this.circle.getParams()
    );
    const circleMesh = this.geometryManager.getGeometryMesh(
      circleId,
      circleColor,
      "line"
    );
    this.scene.add(circleMesh);

    this.makeSlidersInteraction(convexCircleId, convexCircleColor, this.convexCircle.getSliderParams(),
                                circleId, circleColor, this.circle.getSliderParams(),
                                this.colorConnection);

    let points = this.geometryManager.calculateMinimumDistance(
      convexCircleId,
      circleId
    );
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
