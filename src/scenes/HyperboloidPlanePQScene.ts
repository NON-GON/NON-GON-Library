import { Hyperboloid3D } from "./shapes/3D/Hyperboloid3D";
import { Plane3D } from "./shapes/3D/Plane3D";
import { HyperboloidPlanePQ } from "./proximity_queries/3D/HyperboloidPlanePQ";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Hyperboloid
  const hyperboloidCenter = new Vector3(0, 0, 15);
  const hyperboloidXRadius = 12.5;
  const hyperboloidYRadius = 12.5;
  const hyperboloidZFactor = 12;
  const hyperboloidHeight = 75;
  const hyperboloidRotation = new Vector3(90, 0, 0);
  const hyperboloidSegments = 25;
  const hyperboloidId = "Hyperboloid";
  const hyperboloidColor = Colors.SHAPE1_COLOR_3D;
  const hyperboloid = new Hyperboloid3D(
    canvas,
    hyperboloidCenter,
    hyperboloidXRadius,
    hyperboloidYRadius,
    hyperboloidZFactor,
    hyperboloidHeight,
    hyperboloidRotation,
    "one-sheeted", // or "one-sheeted"
    hyperboloidSegments,
    hyperboloidId,
    hyperboloidColor
  );

  // Plane
  const planeCenter = new Vector3(0, 0, -15);
  const planeRotation = new Vector3(90, 0, 90);
  const planeWidth = 50;
  const planeHeight = 100;
  const planeSegments = 25;
  const planeId = "Plane";
  const planeColor = Colors.SHAPE2_COLOR_3D;
  const plane = new Plane3D(
    canvas,
    planeCenter,
    planeRotation,
    planeWidth,
    planeHeight,
    planeSegments,
    planeId,
    planeColor
  );

  // Interaction
  const hyperboloidPlane = new HyperboloidPlanePQ(canvas, hyperboloid, plane);
  hyperboloidPlane.startAnimation();
});
