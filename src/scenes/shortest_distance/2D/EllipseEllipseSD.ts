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
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, this.ellipse1.getId(), this.ellipse1.getParams());
    const ellipse1Mesh = this.geometryManager.getGeometryMesh(this.ellipse1.getId(), this.ellipse1.getColor(), "mesh");
    this.scene.add(ellipse1Mesh);

    this.geometryManager.createGeometry(GeometryType2D.Ellipse, this.ellipse2.getId(), this.ellipse2.getParams());
    const ellipse2Mesh = this.geometryManager.getGeometryMesh(this.ellipse2.getId(), this.ellipse2.getColor(), "mesh");
    this.scene.add(ellipse2Mesh);

    this.makeSlidersInteraction(this.ellipse1, this.ellipse2, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(this.ellipse1.getId(), this.ellipse2.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
