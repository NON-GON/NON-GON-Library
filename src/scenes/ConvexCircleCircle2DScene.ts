import { ConvexCircle2D } from "./shapes/2D/ConvexCircle2D";
import { Circle2D } from "./shapes/2D/Circle2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";
import { ConvexCircleCircle2D } from "./closest_distance/2D/ConvexCircleCircle2D";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Convex Circle
  const convexCircleCenter = new Vector2(0, 0);
  const convexCircleRadius = 25;
  const convexCircleRotation = new Vector2(0, 0);
  const convexCircleSegments = 100;
  const convexCircleId = 'Convex Circle';
  const convexCircleColor = Colors.BRIGHT_BLUE;
  const convexCircle = new ConvexCircle2D(
    canvas,
    convexCircleCenter,
    convexCircleRadius,
    convexCircleRotation,
    convexCircleSegments,
    convexCircleId,
    convexCircleColor
  );

  // Circle
  const circleCenter = new Vector2(50, 50);
  const circleRadius = 25;
  const circleRotation = new Vector2(0, 0);
  const circleSegments = 100;
  const circleId = 'Circle';
  const circleColor = Colors.ORANGE;
  const circle = new Circle2D(
    canvas,
    circleCenter,
    circleRadius,
    circleRotation,
    circleSegments,
    circleId,
    circleColor
  );

  // Interaction
  const colorConnection = Colors.PINK;
  const convexCircleCircle = new ConvexCircleCircle2D(
    canvas,
    convexCircle,
    convexCircleColor,
    circle,
    circleColor,
    colorConnection
  );
  convexCircleCircle.startAnimation();
});
