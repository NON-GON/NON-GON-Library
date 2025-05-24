import { Base3DScene } from '../../Base3DScene';
import { GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class EllipticParaboloid3D extends Base3DScene {
  private center: Vector3;
  private xradius: number;
  private yradius: number;
  private height: number;
  private rotation: Vector3;
  private segments: number;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              xradius: number,
              yradius: number,
              height: number,
              rotation: Vector3,
              segments: number,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.height = height;
    this.rotation = rotation;
    this.segments = segments;
    this.color = color;
  }

  public getParams() {
    return {
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      height: this.height,
      rotation: this.rotation,
      segments: this.segments
    };
  }

  protected getSliderParams() {
    return {
      center_x: this.center.x,
      center_y: this.center.y,
      center_z: this.center.z,
      rotation_x: this.rotation.x,
      rotation_y: this.rotation.y,
      rotation_z: this.rotation.z,
      x_radius: this.xradius,
      y_radius: this.xradius,
      height: this.height,
    }
  }

  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.EllipticParaboloid, 'EllipticParaboloid3D', this.getParams());
    const mesh = this.geometryManager.getGeometryMesh('EllipticParaboloid3D', this.color, 'mesh');
    this.makeSliders("Elliptic Paraboloid", this.getSliderParams());
    this.scene.add(mesh);
  }
}
