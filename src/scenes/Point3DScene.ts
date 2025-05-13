import { Point3D } from "./shapes/3D/Point3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(0, 0, 0);
    const color = Colors.MUSTARD;
    const scene = new Point3D(canvas, center, color);
    scene.startAnimation();
});
