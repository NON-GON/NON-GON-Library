import { Base2DScene } from "../../Base2DScene";
import { ConvexLine2D } from "../../shapes/2D/ConvexLine2D";
import { LineSegment2D } from "../../shapes/2D/LineSegment2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class ConvexLineLineSegmentSD extends Base2DScene {
  private convexLine: ConvexLine2D;
  private lineSegment: LineSegment2D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    convexLine: ConvexLine2D,
    lineSegment: LineSegment2D,
    colorConnection: number
  ) {
    super(canvas);
    this.convexLine = convexLine;
    this.lineSegment = lineSegment;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(
      GeometryType2D.ConvexLine,
      this.convexLine.getId(),
      this.convexLine.getParams()
    );
    const convexLineMesh = this.geometryManager.getGeometryMesh(
      this.convexLine.getId(),
      this.convexLine.getColor(),
      "line",
      2
    );
    this.scene.add(convexLineMesh);

    this.geometryManager.createGeometry(
      GeometryType2D.Line,
      this.lineSegment.getId(),
      this.lineSegment.getParams()
    );
    const lineSegmentMesh = this.geometryManager.getGeometryMesh(
      this.lineSegment.getId(),
      this.lineSegment.getColor(),
      "line",
      3
    );
    this.scene.add(lineSegmentMesh);

    this.makeSlidersInteraction(
      this.convexLine,
      this.lineSegment,
      this.colorConnection,
      this.lineSegment
    );

    let points = this.geometryManager.calculateShortestDistance(
      this.convexLine.getId(),
      this.lineSegment.getId()
    );
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
