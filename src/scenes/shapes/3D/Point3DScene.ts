import * as THREE from 'three';
import { BaseScene } from '../../BaseScene';
import { GeometryManager } from "../../../Geometries/GeometryManager";
import { GeometryType2D, GeometryType3D } from "../../../Geometries/GeoTypes";
import { Vector3, Vector2 } from "../../../Calc/Util/Utils";

const RED = 0xA32545;
const GREEN = 0x5D803D;
const BLUE = 0x6BA7C7;

export class Point3DScene extends BaseScene {

    protected buildScene(): void {
      const geometryManager = new GeometryManager();

      let params0 = {
        center: new Vector3(0, 0, 0),
        xradius: 20,
        yradius: 60,
        zradius: 40,
        rotation: new Vector3(0, 0, 0),
        segments: 15,
      };
      geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo0", params0);
      let params1 = {
        center: new Vector3(50, 50, 50),
        xradius: 35,
        yradius: 25,
        zradius: 15,
        rotation: new Vector3(0, 0, 0),
        segments: 15,
      };
      geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo1", params1);
      this.scene.add(geometryManager.getGeometryMesh("geo1", RED));
      this.scene.add(geometryManager.getGeometryMesh("geo0", BLUE));
    }

    public start(): void {
      this.buildScene();
      this.renderLoop();
    }

    private renderLoop = (): void => {
      this.controls.update();
      this.render();
      requestAnimationFrame(this.renderLoop);
    }
}
