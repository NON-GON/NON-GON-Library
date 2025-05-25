import { Hyperboloid3D } from "./shapes/3D/Hyperboloid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(0, 0, 0);
    const xradius = 12.5;
    const yradius = 12.5;
    const zfactor = 12;
    const height = 75;
    const rotation = new Vector3(0, 0, 0);
    const segments = 100;
    const id = 'Hyperboloid';
    const color = Colors.BRIGHT_BLUE;
    const scene = new Hyperboloid3D(canvas, center, xradius, yradius, zfactor, height, rotation, segments, id, color);
    scene.startAnimation();
});
