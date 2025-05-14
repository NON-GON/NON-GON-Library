import { Base2DScene } from "../../Base2DScene";
import { Superellipse2D } from "../../shapes/2D/Superellipse2D";
import { LineSegment2D } from "../../shapes/2D/LineSegment2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class SuperellipseLineSegment2D extends Base2DScene {
  private superellipse: Superellipse2D;
  private colorSuperellipse: number;
  private lineSegment: LineSegment2D;
  private colorLineSegment: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    superellipse: Superellipse2D,
    colorSuperellipse: number,
    lineSegment: LineSegment2D,
    colorLineSegment: number,
    colorConnection: number
  ) {
    super(canvas);
    this.superellipse = superellipse;
    this.colorSuperellipse = colorSuperellipse;
    this.lineSegment = lineSegment;
    this.colorLineSegment = colorLineSegment;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Supperellipse, 'Superellipse2D', this.superellipse.getParams());
    const superellipseMesh = this.geometryManager.getGeometryMesh('Superellipse2D', this.colorSuperellipse, "line");
    this.scene.add(superellipseMesh);

    this.geometryManager.createGeometry(GeometryType2D.Line, 'LineSegment2D', this.lineSegment.getParams());
    const lineSegmentMesh = this.geometryManager.getGeometryMesh('LineSegment2D', this.colorLineSegment, "line");
    this.scene.add(lineSegmentMesh);

    let points = this.geometryManager.calculateMinimumDistance('Superellipse2D', 'LineSegment2D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
