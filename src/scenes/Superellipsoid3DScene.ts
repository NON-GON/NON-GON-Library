import { Superellipsoid3D } from "./shapes/3D/Superellipsoid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;
  const center = new Vector3(0, 0, 0);
  const xradius = 25;
  const yradius = 25;
  const zradius = 50;
  const e1 = 0.5;
  const e2 = 0.5;
  const rotation = new Vector3(0, 0, 0);
  const segments = 100;
  const color = Colors.BRIGHT_BLUE;
  const scene = new Superellipsoid3D(
    canvas,
    center,
    xradius,
    yradius,
    zradius,
    e1,
    e2,
    rotation,
    segments,
    color
  );
  scene.startAnimation();
});
