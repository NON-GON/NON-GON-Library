import { ConvexLine2D } from "./shapes/2D/ConvexLine2D";
import { LineSegment2D } from "./shapes/2D/LineSegment2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";
import { ConvexLineLineSegment2D } from "./closest_distance/2D/ConvexLineLineSegment2D";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Convex Line
    const convexLineCenter = new Vector2(0, 0);
    const convexLineRotation = new Vector2(0, 0);
    const convexLineSegments = 100;
    const convexLineColor = Colors.BRIGHT_BLUE;
    const convexLine = new ConvexLine2D(canvas, convexLineCenter, convexLineRotation, convexLineSegments, convexLineColor);

    // Line Segment
    const lineSegmentStart = new Vector2(25, 25);
    const lineSegmentEnd = new Vector2(50, -75);
    const lineSegmentRotation = new Vector2(0, 0);
    const lineSegmentColor = Colors.ORANGE;
    const lineSegment = new LineSegment2D(canvas, lineSegmentStart, lineSegmentEnd, lineSegmentRotation, lineSegmentColor);

    // Interaction
    const colorConnection = Colors.PINK;
    const convexLineLineSegment = new ConvexLineLineSegment2D(canvas, convexLine, convexLineColor, lineSegment, lineSegmentColor, colorConnection);
    convexLineLineSegment.startAnimation();
});
