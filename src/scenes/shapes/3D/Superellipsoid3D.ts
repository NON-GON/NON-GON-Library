import { Base3DScene } from "../../Base3DScene";
import { GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Superellipsoid3D extends Base3DScene {
  private center: Vector3;
  private xradius: number;
  private yradius: number;
  private zradius: number;
  private e1: number;
  private e2: number;
  private rotation: Vector3;
  private segments: number;
  private id: string;
  private color: number;

  constructor(
    canvas: HTMLCanvasElement,
    center: Vector3,
    xradius: number,
    yradius: number,
    zradius: number,
    e1: number,
    e2: number,
    rotation: Vector3,
    segments: number,
    id: string,
    color: number
  ) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.zradius = zradius;
    this.e1 = e1;
    this.e2 = e2;
    this.rotation = rotation;
    this.segments = segments;
    this.id = id;
    this.color = color;
  }

  public getParams() {
    return {
      center: this.center,
      xradius: this.xradius,
      yradius: this.yradius,
      zradius: this.zradius,
      e1: this.e1,
      e2: this.e2,
      rotation: this.rotation,
      segments: this.segments,
    };
  }

  public getSliderParams() {
    return {
      x_radius: this.xradius,
      y_radius: this.yradius,
      z_radius: this.zradius,
      e1: this.e1,
      e2: this.e2
    }
  }

  public getId() {
    return this.id;
  }
  
  public getColor() {
    return this.color;
  }
  
  protected buildScene(): void {
    this.geometryManager.createGeometry(
      GeometryType3D.Superellipsoid,
      this.id,
      this.getParams()
    );
    const mesh = this.geometryManager.getGeometryMesh(
      this.id,
      this.color,
      "mesh"
    );
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
