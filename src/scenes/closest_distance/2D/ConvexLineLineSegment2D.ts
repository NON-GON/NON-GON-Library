import { Base2DScene } from "../../Base2DScene";
import { ConvexLine2D } from "../../shapes/2D/ConvexLine2D";
import { LineSegment2D } from "../../shapes/2D/LineSegment2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class ConvexLineLineSegment2D extends Base2DScene {
  private convexLine: ConvexLine2D;
  private colorConvexLine: number;
  private lineSegment: LineSegment2D;
  private colorLineSegment: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    convexLine: ConvexLine2D,
    colorConvexLine: number,
    lineSegment: LineSegment2D,
    colorLineSegment: number,
    colorConnection: number
  ) {
    super(canvas);
    this.convexLine = convexLine;
    this.colorConvexLine = colorConvexLine;
    this.lineSegment = lineSegment;
    this.colorLineSegment = colorLineSegment;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.ConvexLine, 'ConvexLine2D', this.convexLine.getParams());
    const convexLineMesh = this.geometryManager.getGeometryMesh('ConvexLine2D', this.colorConvexLine, "line");
    this.scene.add(convexLineMesh);

    this.geometryManager.createGeometry(GeometryType2D.Line, 'LineSegment2D', this.lineSegment.getParams());
    const lineSegmentMesh = this.geometryManager.getGeometryMesh('LineSegment2D', this.colorLineSegment, "line");
    this.scene.add(lineSegmentMesh);

    let points = this.geometryManager.calculateMinimumDistance('ConvexLine2D', 'LineSegment2D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
