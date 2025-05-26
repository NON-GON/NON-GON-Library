import { Base3DScene } from "../../Base3DScene";
import { Superellipsoid3D } from "../../shapes/3D/Superellipsoid3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class SuperellipsoidPlane3D extends Base3DScene {
  private superellipsoid: Superellipsoid3D;
  private plane: Plane3D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    superellipsoid: Superellipsoid3D,
    plane: Plane3D,
    colorConnection: number
  ) {
    super(canvas);
    this.superellipsoid = superellipsoid;
    this.plane = plane;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    const superellipsoidId = this.superellipsoid.getId();
    const superellipsoidColor = this.superellipsoid.getColor();
    this.geometryManager.createGeometry(GeometryType3D.Superellipsoid, superellipsoidId, this.superellipsoid.getParams());
    const superellipsoidMesh = this.geometryManager.getGeometryMesh(superellipsoidId, superellipsoidColor, "mesh");
    this.scene.add(superellipsoidMesh);

    const planeId = this.plane.getId();
    const planeColor = this.plane.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Plane, planeId, this.plane.getParams());
    const planeMesh = this.geometryManager.getGeometryMesh(planeId, planeColor, "mesh");
    this.scene.add(planeMesh);

    this.makeSlidersInteraction(superellipsoidId, superellipsoidColor, this.superellipsoid.getSliderParams(),
                                planeId, planeColor, this.plane.getSliderParams(),
                              this.colorConnection);

    let points = this.geometryManager.calculateMinimumDistance(superellipsoidId, planeId);
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
