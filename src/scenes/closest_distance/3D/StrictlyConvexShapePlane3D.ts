import { Base3DScene } from "../../Base3DScene";
import { StrictlyConvexShape3D } from "../../shapes/3D/StrictlyConvexShape3D";
import { Plane3D } from "../../shapes/3D/Plane3D";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";

export class StrictlyConvexShapePlane3D extends Base3DScene {
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
    const strictlyConvexShapeId = this.strictlyConvexShape.getId();
    const strictlyConvexShapeColor = this.strictlyConvexShape.getColor();
    this.geometryManager.createGeometry(GeometryType3D.Convex, strictlyConvexShapeId, this.strictlyConvexShape.getParams());
    const strictlyConvexShapeMesh = this.geometryManager.getGeometryMesh(strictlyConvexShapeId, strictlyConvexShapeColor, "mesh");
    this.scene.add(strictlyConvexShapeMesh);

    const planeId = this.plane.getId();
    const planeColor = this.plane.getColor();
    this.geometryManager.createGeometry(GeometryType2D.Plane, planeId, this.plane.getParams());
    const planeMesh = this.geometryManager.getGeometryMesh(planeId, planeColor, "mesh");
    this.scene.add(planeMesh);

    this.makeSlidersInteraction(strictlyConvexShapeId, strictlyConvexShapeColor, this.strictlyConvexShape.getSliderParams(),
                                planeId, planeColor, this.plane.getSliderParams(),
                              this.colorConnection);

    let points = this.geometryManager.calculateMinimumDistance(strictlyConvexShapeId, planeId);
    this.drawMinimumDistance(points[0], points[1], this.colorConnection);
  }
}
