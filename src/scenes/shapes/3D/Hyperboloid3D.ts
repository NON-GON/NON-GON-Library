import { Base3DScene } from '../../Base3DScene';
import { GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Hyperboloid3D extends Base3DScene {
  private center: Vector3;
  private xradius: number;
  private yradius: number;
  private zfactor: number;
  private height: number;
  private rotation: Vector3;
  private segments: number;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              xradius: number,
              yradius: number,
              zfactor: number,
              height: number,
              rotation: Vector3,
              segments: number,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zfactor = zfactor;
    this.height = height;
    this.rotation = rotation;
    this.segments = segments;
    this.color = color;
  }

  protected buildScene(): void {
    let params = {
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      zfactor: this.zfactor,
      height: this.height,
      rotation: this.rotation,
      segments: this.segments
    }
    this.geometryManager.createGeometry(GeometryType3D.Hyperboloid, 'Hyperboloid3D', params);
    const mesh = this.geometryManager.getGeometryMesh('Hyperboloid3D', this.color, 'mesh');
    this.scene.add(mesh);
  }
}
