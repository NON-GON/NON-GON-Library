import { Base3DScene } from "../../Base3DScene";
import { Point3D } from "../../shapes/3D/Point3D";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class PointEllipsoid3D extends Base3DScene {
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
    const pointId = this.point.getId();
    const pointColor = this.point.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Point, pointId, this.point.getParams());
    const pointMesh = this.geometryManager.getGeometryMesh(pointId, pointColor, "mesh");
    this.scene.add(pointMesh);

    const ellipsoidId = this.ellipsoid.getId();
    const ellipsoidColor = this.ellipsoid.getColor();
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, ellipsoidId, this.ellipsoid.getParams());
    const ellipsoidMesh = this.geometryManager.getGeometryMesh(ellipsoidId, ellipsoidColor, "mesh");
    this.scene.add(ellipsoidMesh);

    this.makeSlidersInteraction(pointId, pointColor, this.point.getSliderParams(),
                                ellipsoidId, ellipsoidColor, this.ellipsoid.getSliderParams(),
                                this.colorConnection);
    
    let points = this.geometryManager.calculateMinimumDistance(pointId, ellipsoidId);
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
