import { Cylinder3D } from "./shapes/3D/Cylinder3D";
import { CylinderCylinderPQ } from "./proximity_queries/3D/CylinderCylinderPQ";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Cylinder1
  const cylinder1Center = new Vector3(0, -1.4, 43.98);
  const cylinder1XRadius = 25;
  const cylinder1YRadius = 100;
  const cylinder1Height = 100;
  const cylinder1Rotation = new Vector3(50, 0, 0);
  const cylinder1Segments = 25;
  const cylinder1Id = "Blue Cylinder";
  const cylinder1Color = Colors.SHAPE1_COLOR_3D;
  const cylinder1 = new Cylinder3D(
    canvas,
    cylinder1Center,
    cylinder1XRadius,
    cylinder1YRadius,
    cylinder1Height,
    cylinder1Rotation,
    cylinder1Segments,
    cylinder1Id,
    cylinder1Color
  );

  // Cylinder2
  const cylinder2Center = new Vector3(0, 0, -12);
  const cylinder2XRadius = 25;
  const cylinder2YRadius = 100;
  const cylinder2Height = 100;
  const cylinder2Rotation = new Vector3(0, 0, 0);
  const cylinder2Segments = 25;
  const cylinder2Id = "Red Cylinder";
  const cylinder2Color = Colors.SHAPE2_COLOR_3D;
  const cylinder2 = new Cylinder3D(
    canvas,
    cylinder2Center,
    cylinder2XRadius,
    cylinder2YRadius,
    cylinder2Height,
    cylinder2Rotation,
    cylinder2Segments,
    cylinder2Id,
    cylinder2Color
  );

  // Interaction
  const cylinderCylinder = new CylinderCylinderPQ(canvas, cylinder1, cylinder2);
  cylinderCylinder.startAnimation();
});
