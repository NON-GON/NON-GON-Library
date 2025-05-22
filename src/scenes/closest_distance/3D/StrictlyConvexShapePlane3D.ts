import { Base3DScene } from "../../Base3DScene";
import { StrictlyConvexShape3D } from "../../shapes/3D/StrictlyConvexShape3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class StrictlyConvexShapePlane3D extends Base3DScene {
  private strictlyConvexShape: StrictlyConvexShape3D;
  private colorStrictlyConvexShape: number;
  private plane: Plane3D;
  private colorPlane: number;
  private colorConnection: number;

  constructor(
    canvas: HTMLCanvasElement,
    strictlyConvexShape: StrictlyConvexShape3D,
    colorStrictlyConvexShape: number,
    plane: Plane3D,
    colorPlane: number,
    colorConnection: number
  ) {
    super(canvas);
    this.strictlyConvexShape = strictlyConvexShape;
    this.colorStrictlyConvexShape = colorStrictlyConvexShape;
    this.plane = plane;
    this.colorPlane = colorPlane;
    this.colorConnection = colorConnection;
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Convex, 'StrictlyConvexShape3D', this.strictlyConvexShape.getParams());
    const strictlyConvexShapeMesh = this.geometryManager.getGeometryMesh('StrictlyConvexShape3D', this.colorStrictlyConvexShape, "mesh");
    this.scene.add(strictlyConvexShapeMesh);

    this.geometryManager.createGeometry(GeometryType2D.Plane, 'Plane3D', this.plane.getParams());
    const planeMesh = this.geometryManager.getGeometryMesh('Plane3D', this.colorPlane, "mesh");
    this.scene.add(planeMesh);

    let points = this.geometryManager.calculateMinimumDistance('StrictlyConvexShape3D', 'Plane3D');
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
