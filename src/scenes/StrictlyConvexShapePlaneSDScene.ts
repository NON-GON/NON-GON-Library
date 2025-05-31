import { StrictlyConvexShape3D } from "./shapes/3D/StrictlyConvexShape3D";
import { Plane3D } from "./shapes/3D/Plane3D";
import { StrictlyConvexShapePlaneSD } from "./shortest_distance/3D/StrictlyConvexShapePlaneSD";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Strictly Convex Shape
  const strictlyConvexShapeCenter = new Vector3(-50, 0, 0);
  const strictlyConvexShapeRotation = new Vector3(0, 0, 0);
  const strictlyConvexShapeSegments = 100;
  const strictlyConvexShapeId = "Strictly Convex Shape";
  const strictlyConvexShapeColor = Colors.SHAPE1_COLOR_3D;
  const strictlyConvexShape = new StrictlyConvexShape3D(
    canvas,
    strictlyConvexShapeCenter,
    strictlyConvexShapeRotation,
    strictlyConvexShapeSegments,
    strictlyConvexShapeId,
    strictlyConvexShapeColor
  );

  // Plane
  const planeCenter = new Vector3(-50, -50, -50);
  const planeRotation = new Vector3(0, 0, 0);
  const planeWidth = 50;
  const planeHeight = 75;
  const planeSegments = 100;
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
  const strictlyConvexShapePlane = new StrictlyConvexShapePlaneSD(
    canvas,
    strictlyConvexShape,
    plane,
    colorConnection
  );
  strictlyConvexShapePlane.startAnimation();
});
