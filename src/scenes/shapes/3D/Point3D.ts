import { Base3DScene } from '../../Base3DScene';
import { GeometryType2D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Point3D extends Base3DScene {
  private center: Vector3;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              color: number) {
    super(canvas);
    this.center = center;
    this.color = color;
  }

  public getParams() {
    return { center: this.center };
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType2D.Point, 'Point3D', this.getParams());
    const mesh = this.geometryManager.getGeometryMesh('Point3D', this.color, 'mesh');
    this.scene.add(mesh);
  }
}
