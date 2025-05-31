import { Ellipsoid3D } from "./shapes/3D/Ellipsoid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(0, 0, 0);
    const xradius = 25;
    const yradius = 25;
    const zradius = 50;
    const rotation = new Vector3(0, 0, 0);
    const segments = 100;
    const id = 'Ellipsoid'
    const color = Colors.SHAPE1_COLOR_3D;
    const scene = new Ellipsoid3D(canvas, center, xradius, yradius, zradius, rotation, segments, id, color);
    scene.startAnimation();
});
