import { Hyperboloid3D } from "./shapes/3D/Hyperboloid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(-10, 15, 5);
    const xradius = 6;
    const yradius = 6;
    const zradius = 5;
    const height = 50;
    const rotation = new Vector3(0, 0, 0);
    const segments = 100;
    const color = Colors.MUSTARD;
    const scene = new Hyperboloid3D(canvas, center, xradius, yradius, zradius, height, rotation, segments, color);
    scene.startAnimation();
});
