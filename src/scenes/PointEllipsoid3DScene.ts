import { Point3D } from "./shapes/3D/Point3D";
import { Ellipsoid3D } from "./shapes/3D/Ellipsoid3D";
import { PointEllipsoid3D } from "./closest_distance/3D/PointEllipsoid3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Point
    const pointCenter = new Vector3(-50, 50, 50);
    const pointId = 'Point'
    const pointColor = Colors.BRIGHT_BLUE;
    const point = new Point3D(canvas, pointCenter, pointId, pointColor);

    // Ellipsoid
    const ellipsoidCenter = new Vector3(50, -50, -50);
    const ellipsoidXRadius = 25;
    const ellipsoidYRadius = 50;
    const ellipsoidZRadius = 25;
    const ellipsoidRotation = new Vector3(0, 0, 0);
    const ellipsoidSegments = 100;
    const ellipsoidId = 'Ellipsoid';
    const ellipsoidColor = Colors.ORANGE;
    const ellipsoid = new Ellipsoid3D(canvas, ellipsoidCenter,
                                      ellipsoidXRadius, ellipsoidYRadius,
                                      ellipsoidZRadius, ellipsoidRotation,
                                      ellipsoidSegments, ellipsoidId, ellipsoidColor);
    
    // Interaction
    const colorConnection = Colors.PINK;
    const pointEllipsoid = new PointEllipsoid3D(canvas, point, ellipsoid, colorConnection);
    pointEllipsoid.startAnimation();
});
