import { Point2D } from "./shapes/2D/Point2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector2(-10, 15);
    const color = Colors.MUSTARD;
    const scene = new Point2D(canvas, center, color);
    scene.startAnimation();
});
