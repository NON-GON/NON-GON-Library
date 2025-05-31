import { Base3DScene } from "../../Base3DScene";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType3D } from "../../../Geometries/GeoTypes";

export class EllipsoidEllipsoidSD extends Base3DScene {
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
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, this.ellipsoid1.getId(), this.ellipsoid1.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid1.getId(), this.ellipsoid1.getColor(), "mesh"));

    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, this.ellipsoid2.getId(), this.ellipsoid2.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid2.getId(), this.ellipsoid2.getColor(), "mesh"));

    this.makeSlidersInteraction(this.ellipsoid1, this.ellipsoid2, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(this.ellipsoid1.getId(), this.ellipsoid2.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
