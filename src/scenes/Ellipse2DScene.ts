import { Ellipse2D } from "./shapes/2D/Ellipse2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector2(0, 0);
    const xradius = 50;
    const yradius = 25;
    const rotation = new Vector2(0, 0);
    const segments = 100;
    const color = Colors.BRIGHT_BLUE;
    const scene = new Ellipse2D(canvas, center, xradius, yradius, rotation, segments, color);
    scene.startAnimation();
});
