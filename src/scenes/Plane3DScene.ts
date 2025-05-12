import { Plane3D } from "./shapes/3D/Plane3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector3(-10, 15, 5);
    const rotation = new Vector3(0, 0, 0);
    const width = 5;
    const height = 20;
    const segments = 15;
    const color = Colors.MUSTARD;
    const scene = new Plane3D(canvas, center, rotation, width, height, segments, color);
    scene.start();
});
