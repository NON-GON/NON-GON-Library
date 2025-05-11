import * as THREE from "three";
import { GeometryManager } from "./Geometries/GeometryManager";
import { GeometryType2D, GeometryType3D } from "./Geometries/GeoTypes";
import { Vector3, Vector2 } from "./Calc/Util/Utils";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Point2DScene, LineSegment2DScene, Circle2DScene,
         Ellipse2DScene, Superellipse2DScene, GeneralSmoothConvexShape2DScene,
         Point3DScene, Plane3DScene, Ellipsoid3DScene,
         Superellipsoid3DScene, Cylinder3DScene, Hyperboloid3DScene,
         EllipticParaboloid3DScene, StrictlyConvexShape3DScene } from "./scenes";

// Color Palette
const RED = 0xA32545;
const GREEN = 0x5D803D;
const BLUE = 0x6BA7C7;
const BURNT_YELLOW = 0xCE7E0C;
const PURPLE = 0xCC7ECC;
const DARK_BACKGROUND = 0x2F3336;

const scenes: Record<string, new (canvas: HTMLCanvasElement) => any> = {
  'Point2D': Point2DScene,
  'LineSegment2D': LineSegment2DScene,
  'Circle2D': Circle2DScene,
  'Ellipse2D': Ellipse2DScene,
  'Superellipse2D': Superellipse2DScene,
  'GeneralSmoothConvexShape2D': GeneralSmoothConvexShape2DScene,
  'Point3D': Point3DScene,
  'Plane3D': Plane3DScene,
  'Ellipsoid3D': Ellipsoid3DScene,
  'Superellipsoid3D': Superellipsoid3DScene,
  'Cylinder3D': Cylinder3DScene,
  'Hyperboloid3D': Hyperboloid3DScene,
  'EllipticParaboloid3D': EllipticParaboloid3DScene,
  'StrictlyConvexShape3D': StrictlyConvexShape3DScene
};

const canvas = document.getElementById('c') as HTMLCanvasElement;

document.querySelectorAll<HTMLAnchorElement>('.gallery-time').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

    const key = item.dataset.type;
    const SceneType = scenes[key];

    if (!SceneType) {
      console.warn('No Scene registered for "${key}"');
      return;
    } else {
      const scene = new SceneType(canvas);
      scene.start()
    }
  });
});
