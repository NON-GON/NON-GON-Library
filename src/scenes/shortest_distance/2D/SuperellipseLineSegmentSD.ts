import { Base2DScene } from "../../Base2DScene";
import { Superellipse2D } from "../../shapes/2D/Superellipse2D";
import { LineSegment2D } from "../../shapes/2D/LineSegment2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class SuperellipseLineSegmentSD extends Base2DScene {
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
    this.geometryManager.createGeometry(GeometryType2D.Supperellipse, this.superellipse.getId(), this.superellipse.getParams());
    const superellipseMesh = this.geometryManager.getGeometryMesh(this.superellipse.getId(), this.superellipse.getColor(), "mesh");
    this.scene.add(superellipseMesh);

    this.geometryManager.createGeometry(GeometryType2D.Line, this.lineSegment.getId(), this.lineSegment.getParams());
    const lineSegmentMesh = this.geometryManager.getGeometryMesh(this.lineSegment.getId(), this.lineSegment.getColor(), "line", 4);
    this.scene.add(lineSegmentMesh);

    this.makeSlidersInteraction(this.superellipse, this.lineSegment, this.colorConnection, this.lineSegment);

    let points = this.geometryManager.calculateShortestDistance(this.superellipse.getId(), this.lineSegment.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
