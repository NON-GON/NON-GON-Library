import { Base2DScene } from "../../Base2DScene";
import { Superellipse2D } from "../../shapes/2D/Superellipse2D";
import { LineSegment2D } from "../../shapes/2D/LineSegment2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class SuperellipseLineSegment2D extends Base2DScene {
  private superellipse: Superellipse2D;
  private lineSegment: LineSegment2D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    superellipse: Superellipse2D,
    lineSegment: LineSegment2D,
    colorConnection: number
  ) {
    super(canvas);
    this.superellipse = superellipse;
    this.lineSegment = lineSegment;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    const superellipseId = this.superellipse.getId();
    const superellipseColor = this.superellipse.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Supperellipse, superellipseId, this.superellipse.getParams());
    const superellipseMesh = this.geometryManager.getGeometryMesh(superellipseId, superellipseColor, "line");
    this.scene.add(superellipseMesh);

    const lineSegmentId = this.lineSegment.getId();
    const lineSegmentColor = this.lineSegment.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Line, lineSegmentId, this.lineSegment.getParams());
    const lineSegmentMesh = this.geometryManager.getGeometryMesh(lineSegmentId, lineSegmentColor, "line");
    this.scene.add(lineSegmentMesh);

    this.makeSlidersInteraction(superellipseId, superellipseColor, this.superellipse.getSliderParams(),
                                lineSegmentId, lineSegmentColor, this.lineSegment.getSliderParams(),
                              this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(superellipseId, lineSegmentId);
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
