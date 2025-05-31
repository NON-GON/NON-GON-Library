import { Base2DScene } from "../../Base2DScene";
import { ConvexCircle2D } from "../../shapes/2D/ConvexCircle2D";
import { Circle2D } from "../../shapes/2D/Circle2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class ConvexCircleCircleSD extends Base2DScene {
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
    this.geometryManager.createGeometry(
      GeometryType2D.ConvexCircle,
      this.convexCircle.getId(),
      this.convexCircle.getParams()
    );
    const convexCircleMesh = this.geometryManager.getGeometryMesh(
      this.convexCircle.getId(),
      this.convexCircle.getColor(),
      "mesh"
    );
    this.scene.add(convexCircleMesh);

    this.geometryManager.createGeometry(
      GeometryType2D.Circle,
      this.circle.getId(),
      this.circle.getParams()
    );
    const circleMesh = this.geometryManager.getGeometryMesh(
      this.circle.getId(),
      this.circle.getColor(),
      "mesh"
    );
    this.scene.add(circleMesh);

    this.makeSlidersInteraction(this.convexCircle, this.circle, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(
      this.convexCircle.getId(),
      this.circle.getId()
    );
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
