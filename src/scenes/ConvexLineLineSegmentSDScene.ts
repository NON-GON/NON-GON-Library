import { ConvexLine2D } from "./shapes/2D/ConvexLine2D";
import { LineSegment2D } from "./shapes/2D/LineSegment2D";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";
import { ConvexLineLineSegmentSD } from "./shortest_distance/2D/ConvexLineLineSegmentSD";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Convex Line
  const convexLineCenter = new Vector2(0, 0);
  const convexLineRotation = new Vector3(0, 0, 31);
  const convexLineSegments = 100;
  const convexLineId = "Convex Line";
  const convexLineColor = Colors.SHAPE1_COLOR_2D;
  const convexLine = new ConvexLine2D(
    canvas,
    convexLineCenter,
    convexLineRotation,
    convexLineSegments,
    convexLineId,
    convexLineColor
  );

  // Line Segment
  const lineSegmentStart = new Vector2(25, -25);
  const lineSegmentEnd = new Vector2(-5, -25);
  const lineSegmentRotation = new Vector3(0, 0, 0);
  const lineId = "Line Segment";
  const lineSegmentColor = Colors.SHAPE2_COLOR_2D;
  const lineSegment = new LineSegment2D(
    canvas,
    lineSegmentStart,
    lineSegmentEnd,
    lineSegmentRotation,
    lineId,
    lineSegmentColor
  );

  // Interaction
  const colorConnection = Colors.CONNECTION_COLOR;
  const convexLineLineSegment = new ConvexLineLineSegmentSD(
    canvas,
    convexLine,
    lineSegment,
    colorConnection
  );
  convexLineLineSegment.startAnimation();
});
