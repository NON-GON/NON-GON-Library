import { Point2D } from "./shapes/2D/Point2D";
import { Ellipse2D } from "./shapes/2D/Ellipse2D";
import { PointEllipseSD } from "./shortest_distance/2D/PointEllipseSD";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Point
  const pointCenter = new Vector2(25, 25);
  const pointId = "Point";
  const pointColor = Colors.SHAPE1_COLOR_2D;
  const point = new Point2D(canvas, pointCenter, pointId, pointColor);

  // Ellipse
  const ellipseCenter = new Vector2(-25, -25);
  const ellipseXRadius = 50;
  const ellipseYRadius = 25;
  const ellipseRotation = new Vector3(0, 0, 90);
  const ellipseSegments = 100;
  const ellipseId = "Ellipse";
  const ellipseColor = Colors.SHAPE2_COLOR_2D;
  const ellipse = new Ellipse2D(
    canvas,
    ellipseCenter,
    ellipseXRadius,
    ellipseYRadius,
    ellipseRotation,
    ellipseSegments,
    ellipseId,
    ellipseColor
  );

  // Interaction
  const colorConnection = Colors.CONNECTION_COLOR;
  const pointEllipse = new PointEllipseSD(
    canvas,
    point,
    ellipse,
    colorConnection
  );
  pointEllipse.startAnimation();
});
