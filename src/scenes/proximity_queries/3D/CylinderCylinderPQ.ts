import { Base3DScene } from "../../Base3DScene";
import { Cylinder3D } from "../../shapes/3D/Cylinder3D";
import { GeometryType3D } from "../../../Geometries/GeoTypes";

export class CylinderCylinderPQ extends Base3DScene {
  private cylinder1: Cylinder3D;
  private cylinder2: Cylinder3D;

  constructor(
    canvas: HTMLCanvasElement,
    cylinder1: Cylinder3D,
    cylinder2: Cylinder3D
  ) {
    super(canvas);
    this.cylinder1 = cylinder1;
    this.cylinder2 = cylinder2;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Cylinder, this.cylinder1.getId(), this.cylinder1.getParams());
    this.geometryManager.createGeometry(GeometryType3D.Cylinder, this.cylinder2.getId(), this.cylinder2.getParams());

    if(this.geometryManager.calculateProximityQuery(this.cylinder1.getId(), this.cylinder2.getId())) {
      this.scene.add(this.geometryManager.getGeometryMesh(this.cylinder1.getId(), this.cylinder1.getColor(), "line"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.cylinder2.getId(), this.cylinder2.getColor(), "line"));
    } else {
      this.scene.add(this.geometryManager.getGeometryMesh(this.cylinder1.getId(), this.cylinder1.getColor(), "mesh"));
      this.scene.add(this.geometryManager.getGeometryMesh(this.cylinder2.getId(), this.cylinder2.getColor(), "mesh"));
    }

    this.makeSlidersInteraction(this.cylinder1, this.cylinder2);
  }
}
