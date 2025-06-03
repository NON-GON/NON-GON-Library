import { Circle2D } from "./shapes/2D/Circle2D";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector2(0, 0);
    const radius = 50;
    const rotation = new Vector3(0, 0, 0);
    const segments = 100;
    const id = 'Circle';
    const color = Colors.SHAPE1_COLOR_2D;
    const scene = new Circle2D(canvas, center, radius, rotation, segments, id, color);
    scene.startAnimation();
});
