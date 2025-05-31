import { Base3DScene } from "../../Base3DScene";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { EllipticParaboloid3D } from "../../shapes/3D/EllipticParaboloid3D";
import { GeometryType3D } from "../../../Geometries/GeoTypes";

export class EllipsoidEllipticParaboloidPQ extends Base3DScene {
  private ellipsoid: Ellipsoid3D;
  private ellipticParaboloid: EllipticParaboloid3D;

  constructor(
    canvas: HTMLCanvasElement,
    ellipsoid: Ellipsoid3D,
    ellipticParaboloid: EllipticParaboloid3D
  ) {
    super(canvas);
    this.ellipsoid = ellipsoid;
    this.ellipticParaboloid = ellipticParaboloid;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, this.ellipsoid.getId(), this.ellipsoid.getParams());
    this.geometryManager.createGeometry(GeometryType3D.EllipticParaboloid, this.ellipticParaboloid.getId(), this.ellipticParaboloid.getParams());

    if(this.geometryManager.calculateProximityQuery(this.ellipsoid.getId(), this.ellipticParaboloid.getId())) {
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid.getId(), this.ellipsoid.getColor(), "line"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipticParaboloid.getId(), this.ellipticParaboloid.getColor(), "line"));
    } else {
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid.getId(), this.ellipsoid.getColor(), "mesh"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipticParaboloid.getId(), this.ellipticParaboloid.getColor(), "mesh"));
    }

    this.makeSlidersInteraction(this.ellipsoid, this.ellipticParaboloid);
  }
}
