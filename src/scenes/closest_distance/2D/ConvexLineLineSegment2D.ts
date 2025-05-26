import { Base2DScene } from "../../Base2DScene";
import { ConvexLine2D } from "../../shapes/2D/ConvexLine2D";
import { LineSegment2D } from "../../shapes/2D/LineSegment2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class ConvexLineLineSegment2D extends Base2DScene {
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
    const convexLineId = this.convexLine.getId();
    const convexLineColor = this.convexLine.getColor();
    this.geometryManager.createGeometry(GeometryType2D.ConvexLine, convexLineId, this.convexLine.getParams());
    const convexLineMesh = this.geometryManager.getGeometryMesh(convexLineId, convexLineColor, "line");
    this.scene.add(convexLineMesh);

    const lineSegmentId = this.lineSegment.getId();
    const lineSegmentColor = this.lineSegment.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Line, lineSegmentId, this.lineSegment.getParams());
    const lineSegmentMesh = this.geometryManager.getGeometryMesh(lineSegmentId, lineSegmentColor, "line");
    this.scene.add(lineSegmentMesh);

    this.makeSlidersInteraction(convexLineId, convexLineColor, this.convexLine.getSliderParams(),
                                lineSegmentId, lineSegmentColor, this.lineSegment.getSliderParams(),
                                this.colorConnection);

    let points = this.geometryManager.calculateMinimumDistance(convexLineId, lineSegmentId);
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
