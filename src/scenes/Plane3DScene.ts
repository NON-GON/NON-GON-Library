import { Plane3D } from "./shapes/3D/Plane3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(0, 0, 0);
    const rotation = new Vector3(0, 0, 90);
    const width = 50;
    const height = 100;
    const segments = 50;
    const id = 'Plane';
    const color = Colors.SHAPE1_COLOR_3D;
    const scene = new Plane3D(canvas, center, rotation, width, height, segments, id, color);
    scene.startAnimation();
});
