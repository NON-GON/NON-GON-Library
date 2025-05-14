import { Base3DScene } from "../../Base3DScene";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType3D } from "../../../Geometries/GeoTypes";

export class EllipsoidEllipsoid3D extends Base3DScene {
  private ellipsoid1: Ellipsoid3D;
  private colorEllipsoid1: number;
  private ellipsoid2: Ellipsoid3D;
  private colorEllipsoid2: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    ellipsoid1: Ellipsoid3D,
    colorEllipsoid1: number,
    ellipsoid2: Ellipsoid3D,
    colorEllipsoid2: number,
    colorConnection: number
  ) {
    super(canvas);
    this.ellipsoid1 = ellipsoid1;
    this.colorEllipsoid1 = colorEllipsoid1;
    this.ellipsoid2 = ellipsoid2;
    this.colorEllipsoid2 = colorEllipsoid2;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, 'Ellipsoid1', this.ellipsoid1.getParams());
    const ellipsoid1Mesh = this.geometryManager.getGeometryMesh('Ellipsoid1', this.colorEllipsoid1, "mesh");
    this.scene.add(ellipsoid1Mesh);

    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, 'Ellipsoid2', this.ellipsoid2.getParams());
    const ellipsoid2Mesh = this.geometryManager.getGeometryMesh('Ellipsoid2', this.colorEllipsoid2, "mesh");
    this.scene.add(ellipsoid2Mesh);

    let points = this.geometryManager.calculateMinimumDistance('Ellipsoid1', 'Ellipsoid2');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
