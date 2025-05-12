import { Superellipsoid3D } from "./shapes/3D/Superellipsoid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(-10, 15, 5);
    const xradius = 20;
    const yradius = 12;
    const zradius = 30;
    const e1 = 2;
    const e2 = 5;
    const rotation = new Vector3(0, 0, 0);
    const segments = 80;
    const color = Colors.MUSTARD;
    const scene = new Superellipsoid3D(canvas, center, xradius, yradius, zradius, e1, e2, rotation, segments, color);
    scene.start();
});
