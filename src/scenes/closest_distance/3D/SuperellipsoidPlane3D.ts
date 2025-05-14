import { Base3DScene } from "../../Base3DScene";
import { Superellipsoid3D } from "../../shapes/3D/Superellipsoid3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class SuperellipsoidPlane3D extends Base3DScene {
  private superellipsoid: Superellipsoid3D;
  private colorSuperellipsoid: number;
  private plane: Plane3D;
  private colorPlane: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    superellipsoid: Superellipsoid3D,
    colorSuperellipsoid: number,
    plane: Plane3D,
    colorPlane: number,
    colorConnection: number
  ) {
    super(canvas);
    this.superellipsoid = superellipsoid;
    this.colorSuperellipsoid = colorSuperellipsoid;
    this.plane = plane;
    this.colorPlane = colorPlane;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Superellipsoid, 'Superellipsoid3D', this.superellipsoid.getParams());
    const superellipsoidMesh = this.geometryManager.getGeometryMesh('Superellipsoid3D', this.colorSuperellipsoid, "mesh");
    this.scene.add(superellipsoidMesh);

    this.geometryManager.createGeometry(GeometryType2D.Plane, 'Plane3D', this.plane.getParams());
    const planeMesh = this.geometryManager.getGeometryMesh('Plane3D', this.colorPlane, "mesh");
    this.scene.add(planeMesh);

    let points = this.geometryManager.calculateMinimumDistance('Superellipsoid3D', 'Plane3D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
