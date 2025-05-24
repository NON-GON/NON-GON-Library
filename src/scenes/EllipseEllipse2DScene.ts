import { Ellipse2D } from "./shapes/2D/Ellipse2D";
import { EllipseEllipse2D } from "./closest_distance/2D/EllipseEllipse2D";
import { Vector2 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Ellipse1
    const ellipse1Center = new Vector2(-30, 30);
    const ellipse1XRadius = 50;
    const ellipse1YRadius = 25;
    const ellipse1Rotation = new Vector2(0, 0);
    const ellipse1Segments = 100;
    const ellipse1Color = Colors.BRIGHT_BLUE;
    const ellipse1 = new Ellipse2D(canvas, ellipse1Center,
                                  ellipse1XRadius, ellipse1YRadius, 
                                  ellipse1Rotation, ellipse1Segments, 
                                  ellipse1Color);

    // Ellipse2
    const ellipse2Center = new Vector2(30, -30);
    const ellipse2XRadius = 50;
    const ellipse2YRadius = 25;
    const ellipse2Rotation = new Vector2(0, 0);
    const ellipse2Segments = 100;
    const ellipse2Color = Colors.ORANGE;
    const ellipse2 = new Ellipse2D(canvas, ellipse2Center,
                                  ellipse2XRadius, ellipse2YRadius, 
                                  ellipse2Rotation, ellipse2Segments, 
                                  ellipse2Color);
    
    // Interaction
    const colorConnection = Colors.PINK;
    const pointEllipse = new EllipseEllipse2D(canvas, ellipse1, ellipse1Color, 
                                            ellipse2, ellipse2Color, colorConnection);
    pointEllipse.startAnimation();
});
