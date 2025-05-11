import { Base3DScene } from '../../Base3DScene';
import { GeometryManager } from '../../../Geometries/GeometryManager';
import { GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Ellipsoid3D extends Base3DScene {
  private geometryManager = new GeometryManager();
  private center: Vector3;
  private xradius: number;
  private yradius: number;
  private zradius: number;
  private rotation: Vector3;
  private segments: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              xradius: number, yradius: number, zradius: number,
              rotation: Vector3,
              segments: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.rotation = rotation;
    this.segments = segments;
  }

  protected buildScene(): void {
    let params = {
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      zradius: this.zradius,
      rotation: this.rotation,
      segments: this.segments
    }
    this.geometryManager.createGeometry(GeometryType3D.Ellipsoid, 'Ellipsoid3D', params);
    const mesh = this.geometryManager.getGeometryMesh('Ellipsoid3D', 0xFFFFFF);
    this.scene.add(mesh);
  }
}
