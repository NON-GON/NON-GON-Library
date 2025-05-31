import { Base2DScene } from "../../Base2DScene";
import { Ellipse2D } from "../../shapes/2D/Ellipse2D";
import { GeometryType2D } from "../../../Geometries/GeoTypes";

export class EllipseEllipsePQ extends Base2DScene {
  private ellipse1: Ellipse2D;
  private ellipse2: Ellipse2D;

  constructor(
    canvas: HTMLCanvasElement,
    ellipse1: Ellipse2D,
    ellipse2: Ellipse2D
  ) {
    super(canvas);
    this.ellipse1 = ellipse1;
    this.ellipse2 = ellipse2;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, this.ellipse1.getId(), this.ellipse1.getParams());
    this.geometryManager.createGeometry(GeometryType2D.Ellipse, this.ellipse2.getId(), this.ellipse2.getParams());
    
    if(this.geometryManager.calculateProximityQuery(this.ellipse1.getId(), this.ellipse2.getId())) {
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipse1.getId(), this.ellipse1.getColor(), "line"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipse2.getId(), this.ellipse2.getColor(), "line"));
    } else {
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipse1.getId(), this.ellipse1.getColor(), "mesh"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipse2.getId(), this.ellipse2.getColor(), "mesh"));
    }

    this.makeSlidersInteraction(this.ellipse1, this.ellipse2);
  }
}
