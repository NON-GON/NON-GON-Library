import { Ellipse2D } from "./shapes/2D/Ellipse2D";
import { EllipseEllipseSD } from "./shortest_distance/2D/EllipseEllipseSD";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Ellipse1
  const ellipse1Center = new Vector2(35, 35);
  const ellipse1XRadius = 50;
  const ellipse1YRadius = 25;
  const ellipse1Rotation = new Vector3(0, 0, 90);
  const ellipse1Segments = 100;
  const ellipse1Id = "Blue Ellipse";
  const ellipse1Color = Colors.SHAPE1_COLOR_2D;
  const ellipse1 = new Ellipse2D(
    canvas,
    ellipse1Center,
    ellipse1XRadius,
    ellipse1YRadius,
    ellipse1Rotation,
    ellipse1Segments,
    ellipse1Id,
    ellipse1Color
  );

  // Ellipse2
  const ellipse2Center = new Vector2(-35, -35);
  const ellipse2XRadius = 50;
  const ellipse2YRadius = 25;
  const ellipse2Rotation = new Vector3(0, 0, 90);
  const ellipse2Segments = 100;
  const ellipse2Id = "Red Ellipse";
  const ellipse2Color = Colors.SHAPE2_COLOR_2D;
  const ellipse2 = new Ellipse2D(
    canvas,
    ellipse2Center,
    ellipse2XRadius,
    ellipse2YRadius,
    ellipse2Rotation,
    ellipse2Segments,
    ellipse2Id,
    ellipse2Color
  );

  // Interaction
  const colorConnection = Colors.CONNECTION_COLOR;
  const pointEllipse = new EllipseEllipseSD(
    canvas,
    ellipse1,
    ellipse2,
    colorConnection
  );
  pointEllipse.startAnimation();
});
