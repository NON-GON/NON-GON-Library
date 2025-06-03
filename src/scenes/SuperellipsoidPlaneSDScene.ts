import { Superellipsoid3D } from "./shapes/3D/Superellipsoid3D";
import { Plane3D } from "./shapes/3D/Plane3D";
import { SuperellipsoidPlaneSD } from "./shortest_distance/3D/SuperellipsoidPlaneSD";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Superellipsoid
  const superellipsoidCenter = new Vector3(0, 25, 0);
  const superellipsoidXRadius = 25;
  const superellipsoidYRadius = 25;
  const superellipsoidZRadius = 50;
  const superellipsoidE1 = 0.5;
  const superellipsoidE2 = 1;
  const superellipsoidRotation = new Vector3(0, 0, 0);
  const superellipsoidSegments = 100;
  const superellipsoidId = "Superellipsoid";
  const superellipsoiColor = Colors.SHAPE1_COLOR_3D;
  const superellipsoid = new Superellipsoid3D(
    canvas,
    superellipsoidCenter,
    superellipsoidXRadius,
    superellipsoidYRadius,
    superellipsoidZRadius,
    superellipsoidE1,
    superellipsoidE2,
    superellipsoidRotation,
    superellipsoidSegments,
    superellipsoidId,
    superellipsoiColor
  );

  // Plane
  const planeCenter = new Vector3(0, -25, 0);
  const planeRotation = new Vector3(0, 0, 0);
  const planeWidth = 50;
  const planeHeight = 75;
  const planeSegments = 1;
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
  const colorConnection = Colors.CONNECTION_COLOR;
  const superellipsoidPlane = new SuperellipsoidPlaneSD(
    canvas,
    superellipsoid,
    plane,
    colorConnection
  );
  superellipsoidPlane.startAnimation();
});
