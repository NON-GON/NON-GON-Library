import { LineSegment2D } from "./shapes/2D/LineSegment2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const start = new Vector2(15, 0);
    const end = new Vector2(-15, 0);
    const rotation = new Vector2(0, 0);
    const id = 'Line Segment';
    const color = Colors.SHAPE1_COLOR_2D;
    const scene = new LineSegment2D(canvas, start, end, rotation, id, color);
    scene.startAnimation();
});
