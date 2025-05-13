import { ConvexLine2D } from "./shapes/2D/ConvexLine2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector2(0, 0);
    const rotation = new Vector2(0, 0);
    const segments = 100;
    const color = Colors.MUSTARD;
    const scene = new ConvexLine2D(canvas, center, rotation, segments, color);
    scene.startAnimation();
});
