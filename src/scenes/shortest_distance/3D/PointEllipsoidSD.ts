import { Base3DScene } from "../../Base3DScene";
import { Point3D } from "../../shapes/3D/Point3D";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class PointEllipsoidSD extends Base3DScene {
  private point: Point3D;
  private ellipsoid: Ellipsoid3D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    point: Point3D,
    ellipsoid: Ellipsoid3D,
    colorConnection: number
  ) {
    super(canvas);
    this.point = point;
    this.ellipsoid = ellipsoid;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Point, this.point.getId(), this.point.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.point.getId(), this.point.getColor(), "mesh"));

    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, this.ellipsoid.getId(), this.ellipsoid.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid.getId(), this.ellipsoid.getColor(), "mesh"));

    this.makeSlidersInteraction(this.point, this.ellipsoid, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(this.point.getId(), this.ellipsoid.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
