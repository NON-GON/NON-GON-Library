import { Base3DScene } from '../../Base3DScene';
import { GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3 } from "../../../Calc/Util/Utils";

export class Cylinder3D extends Base3DScene {
  private center: Vector3;
  private xradius: number;
  private yradius: number;
  private height: number;
  private rotation: Vector3;
  private segments: number;
  private id: string;
  private color: number;

  constructor(canvas: HTMLCanvasElement,
              center: Vector3,
              xradius: number,
              yradius: number,
              height: number,
              rotation: Vector3,
              segments: number,
              id: string,
              color: number) {
    super(canvas);
    this.center = center;
    this.xradius = xradius;
    this.yradius = yradius;
    this.height = height;
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
      height: this.height,
      rotation: this.rotation,
      segments: this.segments
    };
  }

  public getSliderParams() {
    return {
      x_radius: this.xradius,
      y_radius: this.yradius,
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
    this.geometryManager.createGeometry(GeometryType3D.Cylinder, this.id, this.getParams());
    const mesh = this.geometryManager.getGeometryMesh(this.id, this.color, 'mesh');
    this.makeSlidersSolo(this.id, this.color, this.getSliderParams());
    this.scene.add(mesh);
  }
}
