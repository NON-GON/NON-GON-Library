import { Point2D } from "./shapes/2D/Point2D";
import { Ellipse2D } from "./shapes/2D/Ellipse2D";
import { PointEllipse2D } from "./closest_distance/2D/PointEllipse2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Point
    const pointCenter = new Vector2(-50, 50);
    const pointId = 'Point';
    const pointColor = Colors.BRIGHT_BLUE;
    const point = new Point2D(canvas, pointCenter, pointId, pointColor);

    // Ellipse
    const ellipseCenter = new Vector2(30, -30);
    const ellipseXRadius = 50;
    const ellipseYRadius = 25;
    const ellipseRotation = new Vector2(0, 0);
    const ellipseSegments = 100;
    const ellipseId = 'Ellipse'
    const ellipseColor = Colors.ORANGE;
    const ellipse = new Ellipse2D(canvas, ellipseCenter,
                                  ellipseXRadius, ellipseYRadius, 
                                  ellipseRotation, ellipseSegments, 
                                  ellipseId, ellipseColor);
    
    // Interaction
    const colorConnection = Colors.PINK;
    const pointEllipse = new PointEllipse2D(canvas, point, pointColor, 
                                            ellipse, ellipseColor, colorConnection);
    pointEllipse.startAnimation();
});
