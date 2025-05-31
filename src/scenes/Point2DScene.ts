import { Point2D } from "./shapes/2D/Point2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector2(0, 0);
    const id = 'Point';
    const color = Colors.SHAPE1_COLOR_2D;
    const scene = new Point2D(canvas, center, id, color);
    scene.startAnimation();
});
