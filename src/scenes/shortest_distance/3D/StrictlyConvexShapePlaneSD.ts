import { Base3DScene } from "../../Base3DScene";
import { StrictlyConvexShape3D } from "../../shapes/3D/StrictlyConvexShape3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class StrictlyConvexShapePlaneSD extends Base3DScene {
  private strictlyConvexShape: StrictlyConvexShape3D;
  private plane: Plane3D;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    strictlyConvexShape: StrictlyConvexShape3D,
    plane: Plane3D,
    colorConnection: number
  ) {
    super(canvas);
    this.strictlyConvexShape = strictlyConvexShape;
    this.plane = plane;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Convex, this.strictlyConvexShape.getId(), this.strictlyConvexShape.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.strictlyConvexShape.getId(), this.strictlyConvexShape.getColor(), "mesh"));

    this.geometryManager.createGeometry(GeometryType2D.Plane, this.plane.getId(), this.plane.getParams());
    this.scene.add(this.geometryManager.getGeometryMesh(this.plane.getId(), this.plane.getColor(), "mesh"));

    this.makeSlidersInteraction(this.strictlyConvexShape, this.plane, this.colorConnection);

    let points = this.geometryManager.calculateShortestDistance(this.strictlyConvexShape.getId(), this.plane.getId());
    this.drawShortestDistance(points[0], points[1], this.colorConnection);
  }
}
