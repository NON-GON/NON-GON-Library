import { Ellipsoid3D } from "./shapes/3D/Ellipsoid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(-10, 15, 5);
    const xradius = 4;
    const yradius = 12;
    const zradius = 8;
    const rotation = new Vector3(0, 0, 0);
    const segments = 15;
    const color = Colors.MUSTARD;
    const scene = new Ellipsoid3D(canvas, center, xradius, yradius, zradius, rotation, segments, color);
    scene.startAnimation();
});
