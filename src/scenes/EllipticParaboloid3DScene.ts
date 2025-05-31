import { EllipticParaboloid3D } from "./shapes/3D/EllipticParaboloid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(0, 0, -50);
    const xradius = 25;
    const yradius = 25;
    const height = 100;
    const rotation = new Vector3(0, 0, 0);
    const segments = 100;
    const id = 'Elliptic Paraboloid';
    const color = Colors.SHAPE1_COLOR_3D;
    const scene = new EllipticParaboloid3D(canvas, center, xradius, yradius, height, rotation, segments, id, color);
    scene.startAnimation();
});
