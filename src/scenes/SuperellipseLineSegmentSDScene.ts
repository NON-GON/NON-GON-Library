import { Superellipse2D } from "./shapes/2D/Superellipse2D";
import { LineSegment2D } from "./shapes/2D/LineSegment2D";
import { SuperellipseLineSegmentSD } from "./shortest_distance/2D/SuperellipseLineSegmentSD";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Superellipse
  const superellipseCenter = new Vector2(0, 25);
  const superellipseXRadius = 50;
  const superellipseYRadius = 25;
  const superellipseExponent = 0.5;
  const superellipseRotation = new Vector3(0, 0, 0);
  const superellipseSegments = 100;
  const superellipseId = "Superellipse";
  const superellipseColor = Colors.SHAPE1_COLOR_2D;
  const superellipse = new Superellipse2D(
    canvas,
    superellipseCenter,
    superellipseXRadius,
    superellipseYRadius,
    superellipseExponent,
    superellipseRotation,
    superellipseSegments,
    superellipseId,
    superellipseColor
  );

  // Line Segment
  const lineSegmentStart = new Vector2(50, -25);
  const lineSegmentEnd = new Vector2(-50, -25);
  const lineSegmentRotation = new Vector3(0, 0, 0);
  const lineSegmentId = "Line Segment";
  const lineSegmentColor = Colors.SHAPE2_COLOR_2D;
  const lineSegment = new LineSegment2D(
    canvas,
    lineSegmentStart,
    lineSegmentEnd,
    lineSegmentRotation,
    lineSegmentId,
    lineSegmentColor
  );

  // Interaction
  const colorConnection = Colors.CONNECTION_COLOR;
  const superellipseLineSegment = new SuperellipseLineSegmentSD(
    canvas,
    superellipse,
    lineSegment,
    colorConnection
  );
  superellipseLineSegment.startAnimation();
});
