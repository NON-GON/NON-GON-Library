import { Base3DScene } from "../../Base3DScene";
import { Point3D } from "../../shapes/3D/Point3D";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class PointEllipsoid3D extends Base3DScene {
  private point: Point3D;
  private colorPoint: number;
  private ellipsoid: Ellipsoid3D;
  private colorEllipsoid: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    point: Point3D,
    colorPoint: number,
    ellipsoid: Ellipsoid3D,
    colorEllipsoid: number,
    colorConnection: number
  ) {
    super(canvas);
    this.point = point;
    this.colorPoint = colorPoint;
    this.ellipsoid = ellipsoid;
    this.colorEllipsoid = colorEllipsoid;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Point, 'Point3D', this.point.getParams());
    const pointMesh = this.geometryManager.getGeometryMesh('Point3D', this.colorPoint, "mesh");
    this.scene.add(pointMesh);

    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, 'Ellipsoid3D', this.ellipsoid.getParams());
    const ellipsoidMesh = this.geometryManager.getGeometryMesh('Ellipsoid3D', this.colorEllipsoid, "mesh");
    this.scene.add(ellipsoidMesh);

    let points = this.geometryManager.calculateMinimumDistance('Point3D', 'Ellipsoid3D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
