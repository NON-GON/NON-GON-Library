import { Superellipse2D } from "./shapes/2D/Superellipse2D";
import { LineSegment2D } from "./shapes/2D/LineSegment2D";
import { SuperellipseLineSegment2D } from "./closest_distance/2D/SuperellipseLineSegment2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Superellipse
    const superellipseCenter = new Vector2(0, 0);
    const superellipseXRadius = 50;
    const superellipseYRadius = 25;
    const superellipseExponent = 0.5;
    const superellipseRotation = new Vector2(0, 0);
    const superellipseSegments = 100;
    const superellipseId = 'Superellipse';
    const superellipseColor = Colors.BRIGHT_BLUE;
    const superellipse = new Superellipse2D(canvas, superellipseCenter,
                                            superellipseXRadius, superellipseYRadius,
                                            superellipseExponent, superellipseRotation,
                                            superellipseSegments, superellipseId, superellipseColor);

    // Line Segment
    const lineSegmentStart = new Vector2(-75, 0);
    const lineSegmentEnd = new Vector2(75, 0);
    const lineSegmentRotation = new Vector2(0, 0);
    const lineSegmentId = 'Line Segment'
    const lineSegmentColor = Colors.ORANGE;
    const lineSegment = new LineSegment2D(canvas, lineSegmentStart,
                                          lineSegmentEnd, lineSegmentRotation,
                                          lineSegmentId, lineSegmentColor);
    
    // Interaction
    const colorConnection = Colors.PINK;
    const superellipseLineSegment = new SuperellipseLineSegment2D(canvas, superellipse, superellipseColor,
                                                                  lineSegment, lineSegmentColor, colorConnection);
    superellipseLineSegment.startAnimation();
});
