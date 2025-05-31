import { Base3DScene } from "../../Base3DScene";
import { Ellipsoid3D } from "../../shapes/3D/Ellipsoid3D";
import { GeometryType3D } from "../../../Geometries/GeoTypes";

export class EllipsoidEllipsoidPQ extends Base3DScene {
  private ellipsoid1: Ellipsoid3D;
  private ellipsoid2: Ellipsoid3D;

  constructor(
    canvas: HTMLCanvasElement,
    ellipsoid1: Ellipsoid3D,
    ellipsoid2: Ellipsoid3D
  ) {
    super(canvas);
    this.ellipsoid1 = ellipsoid1;
    this.ellipsoid2 = ellipsoid2;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, this.ellipsoid1.getId(), this.ellipsoid1.getParams());
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, this.ellipsoid2.getId(), this.ellipsoid2.getParams());

    if(this.geometryManager.calculateProximityQuery(this.ellipsoid1.getId(), this.ellipsoid2.getId())) {
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid1.getId(), this.ellipsoid1.getColor(), "line"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid2.getId(), this.ellipsoid2.getColor(), "line"));
    } else {
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid1.getId(), this.ellipsoid1.getColor(), "mesh"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.ellipsoid2.getId(), this.ellipsoid2.getColor(), "mesh"));
    }

    this.makeSlidersInteraction(this.ellipsoid1, this.ellipsoid2);
  }
}
