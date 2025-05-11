import { Point2D } from "./shapes/2D/Point2D";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const scene = new Point2D(canvas, 50, 75);
    scene.start();
});
