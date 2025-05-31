import { Base3DScene } from "../../Base3DScene";
import { Hyperboloid3D } from "../../shapes/3D/Hyperboloid3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class HyperboloidPlanePQ extends Base3DScene {
  private hyperboloid: Hyperboloid3D;
  private plane: Plane3D;

  constructor(
    canvas: HTMLCanvasElement,
    hyperboloid: Hyperboloid3D,
    plane: Plane3D
  ) {
    super(canvas);
    this.hyperboloid = hyperboloid;
    this.plane = plane;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Hyperboloid, this.hyperboloid.getId(), this.hyperboloid.getParams());
    this.geometryManager.createGeometry(GeometryType2D.Plane, this.plane.getId(), this.plane.getParams());

    if(this.geometryManager.calculateProximityQuery(this.hyperboloid.getId(), this.plane.getId())) {
      this.scene.add(this.geometryManager.getGeometryMesh(this.hyperboloid.getId(), this.hyperboloid.getColor(), "line"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.plane.getId(), this.plane.getColor(), "line"));
    } else {
      this.scene.add(this.geometryManager.getGeometryMesh(this.hyperboloid.getId(), this.hyperboloid.getColor(), "mesh"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.plane.getId(), this.plane.getColor(), "mesh"));
    }

    this.makeSlidersInteraction(this.hyperboloid, this.plane);
  }
}
