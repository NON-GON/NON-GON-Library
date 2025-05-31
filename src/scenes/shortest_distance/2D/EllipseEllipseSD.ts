import { Base2DScene } from "../../Base2DScene";
import { Ellipse2D } from "../../shapes/2D/Ellipse2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class EllipseEllipseSD extends Base2DScene {
  private ellipse1: Ellipse2D;
  private ellipse2: Ellipse2D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    ellipse1: Ellipse2D,
    ellipse2: Ellipse2D,
    colorConnection: number
  ) {
    super(canvas);
    this.ellipse1 = ellipse1;
    this.ellipse2 = ellipse2;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    const ellipse1Id = this.ellipse1.getId();
    const ellipse1Color = this.ellipse1.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, ellipse1Id, this.ellipse1.getParams());
    const ellipse1Mesh = this.geometryManager.getGeometryMesh(ellipse1Id, ellipse1Color, "line");
    this.scene.add(ellipse1Mesh);

    const ellipse2Id = this.ellipse2.getId();
    const ellipse2Color = this.ellipse2.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, ellipse2Id, this.ellipse2.getParams());
    const ellipse2Mesh = this.geometryManager.getGeometryMesh(ellipse2Id, ellipse2Color, "line");
    this.scene.add(ellipse2Mesh);

    this.makeSlidersInteraction(ellipse1Id, ellipse1Color, this.ellipse1.getSliderParams(),
                                ellipse2Id, ellipse2Color, this.ellipse2.getSliderParams(),
                                this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(ellipse1Id, ellipse2Id);
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
