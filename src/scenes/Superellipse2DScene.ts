import { Superellipse2D } from "./shapes/2D/Superellipse2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const center = new Vector2(-10, 15);
    const xradius = 40;
    const yradius = 20;
    const exponent = 3;
    const rotation = new Vector2(0, 0);
    const segments = 100;
    const color = Colors.MUSTARD;
    const scene = new Superellipse2D(canvas, center, xradius, yradius, exponent, rotation, segments, color);
    scene.startAnimation();
});
