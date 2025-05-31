import { Base3DScene } from "../../Base3DScene";
import { Superellipsoid3D } from "../../shapes/3D/Superellipsoid3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class SuperellipsoidPlaneSD extends Base3DScene {
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
    this.geometryManager.createGeometry(GeometryType3D.Superellipsoid, this.superellipsoid.getId(), this.superellipsoid.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.superellipsoid.getId(), this.superellipsoid.getColor(), "mesh"));

    this.geometryManager.createGeometry(GeometryType2D.Plane, this.plane.getId(), this.plane.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.plane.getId(), this.plane.getColor(), "mesh"));

    this.makeSlidersInteraction(this.superellipsoid, this.plane, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(this.superellipsoid.getId(), this.plane.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
