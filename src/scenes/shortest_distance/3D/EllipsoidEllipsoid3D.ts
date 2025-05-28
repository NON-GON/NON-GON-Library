import { Base3DScene } from "../../Base3DScene";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType3D } from "../../../Geometries/GeoTypes";

export class EllipsoidEllipsoid3D extends Base3DScene {
  private ellipsoid1: Ellipsoid3D;
  private ellipsoid2: Ellipsoid3D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    ellipsoid1: Ellipsoid3D,
    ellipsoid2: Ellipsoid3D,
    colorConnection: number
  ) {
    super(canvas);
    this.ellipsoid1 = ellipsoid1;
    this.ellipsoid2 = ellipsoid2;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    const ellipsoid1Id = this.ellipsoid1.getId();
    const ellipsoid1Color = this.ellipsoid1.getColor();
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, ellipsoid1Id, this.ellipsoid1.getParams());
    const ellipsoid1Mesh = this.geometryManager.getGeometryMesh(ellipsoid1Id, ellipsoid1Color, "mesh");
    this.scene.add(ellipsoid1Mesh);

    const ellipsoid2Id = this.ellipsoid2.getId();
    const ellipsoid2Color = this.ellipsoid2.getColor();
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, ellipsoid2Id, this.ellipsoid2.getParams());
    const ellipsoid2Mesh = this.geometryManager.getGeometryMesh(ellipsoid2Id, ellipsoid2Color, "mesh");
    this.scene.add(ellipsoid2Mesh);

    this.makeSlidersInteraction(ellipsoid1Id, ellipsoid1Color, this.ellipsoid1.getSliderParams(),
                                ellipsoid2Id, ellipsoid2Color, this.ellipsoid2.getSliderParams(),
                                this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(ellipsoid1Id, ellipsoid2Id);
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
