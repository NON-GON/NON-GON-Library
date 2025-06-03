import { Superellipse2D } from "./shapes/2D/Superellipse2D";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;
  const center = new Vector2(0, 0);
  const xradius = 50;
  const yradius = 25;
  const exponent = 0.5;
  const rotation = new Vector3(0, 0, 0);
  const segments = 100;
  const id = 'Superellipse';
  const color = Colors.SHAPE1_COLOR_2D;
  const scene = new Superellipse2D(
    canvas,
    center,
    xradius,
    yradius,
    exponent,
    rotation,
    segments,
    id,
    color
  );
  scene.startAnimation();
});
