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
  private hyperboloidType: "one-sheeted" | "two-sheeted";
  private segments: number;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              xradius: number,
              yradius: number,
              zfactor: number,
              height: number,
              rotation: Vector3,
              hyperboloidType: "one-sheeted" | "two-sheeted" = "one-sheeted",
              segments: number,
              id: string,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zfactor = zfactor;
    this.height = height;
    this.rotation = rotation;
    this.hyperboloidType = hyperboloidType;
    this.segments = segments;
    this.id = id;
    this.color = color;
  }

  public getParams() {
    return {
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      zfactor: this.zfactor,
      height: this.height,
      hyperboloidType: this.hyperboloidType,
      rotation: this.rotation,
      segments: this.segments
    };
  }

  public getSliderParams() {
    return {
      x_radius: this.xradius,
      y_radius: this.yradius,
      z_factor: this.zfactor,
      height: this.height
    }
  }

  public getId() {
    return this.id;
  }
  
  public getColor() {
    return this.color;
  }
  
  protected buildScene(): void {
    this.geometryManager.createGeometry(GeometryType3D.Hyperboloid, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'mesh');
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
