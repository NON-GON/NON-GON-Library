import { StrictlyConvexShape3D } from "./shapes/3D/StrictlyConvexShape3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(0, 0, 0);
    const rotation = new Vector3(0, 0, 0);
    const segments = 100;
    const color = Colors.MUSTARD;
    const scene = new StrictlyConvexShape3D(canvas, center, rotation, segments, color);
    scene.startAnimation();
});
