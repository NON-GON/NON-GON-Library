import { Ellipsoid3D } from "./shapes/3D/Ellipsoid3D";
import { EllipsoidEllipsoid3D } from "./closest_distance/3D/EllipsoidEllipsoid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Ellipsoid1
    const ellipsoid1Center = new Vector3(-50, 50, 50);
    const ellipsoid1XRadius = 25;
    const ellipsoid1YRadius = 50;
    const ellipsoid1ZRadius = 25;
    const ellipsoid1Rotation = new Vector3(0, 0, 0);
    const ellipsoid1Segments = 100;
    const ellipsoid1Color = Colors.MUSTARD;
    const ellipsoid1 = new Ellipsoid3D(canvas, ellipsoid1Center,
                                       ellipsoid1XRadius, ellipsoid1YRadius,
                                       ellipsoid1ZRadius, ellipsoid1Rotation,
                                       ellipsoid1Segments, ellipsoid1Color);

    // Ellipsoid2
    const ellipsoid2Center = new Vector3(50, -50, -50);
    const ellipsoid2XRadius = 25;
    const ellipsoid2YRadius = 50;
    const ellipsoid2ZRadius = 25;
    const ellipsoid2Rotation = new Vector3(0, 0, 0);
    const ellipsoid2Segments = 100;
    const ellipsoid2Color = Colors.PURPLE;
    const ellipsoid2 = new Ellipsoid3D(canvas, ellipsoid2Center,
                                       ellipsoid2XRadius, ellipsoid2YRadius,
                                       ellipsoid2ZRadius, ellipsoid2Rotation,
                                       ellipsoid2Segments, ellipsoid2Color);
    
    // Interaction
    const colorConnection = Colors.TEAL;
    const ellipsoidEllipsoid = new EllipsoidEllipsoid3D(canvas, ellipsoid1, ellipsoid1Color,
                                                        ellipsoid2, ellipsoid2Color, colorConnection);
    ellipsoidEllipsoid.startAnimation();
});
