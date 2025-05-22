import { StrictlyConvexShape3D } from "./shapes/3D/StrictlyConvexShape3D";
import { Plane3D } from "./shapes/3D/Plane3D";
import { StrictlyConvexShapePlane3D } from "./closest_distance/3D/StrictlyConvexShapePlane3D";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;

    // Strictly Convex Shape
    const strictlyConvexShapeCenter = new Vector3(-50, 50, 50);
    const strictlyConvexShapeRotation = new Vector3(0, 0, 0);
    const strictlyConvexShapeSegments = 100;
    const strictlyConvexShapeColor = Colors.MUSTARD;
    const strictlyConvexShape = new StrictlyConvexShape3D(canvas, strictlyConvexShapeCenter, strictlyConvexShapeRotation, strictlyConvexShapeSegments, strictlyConvexShapeColor);

    // Plane
    const planeCenter = new Vector3(50, -50, -50);
    const planeRotation = new Vector3(0, 0, 0);
    const planeWidth = 50;
    const planeHeight = 75;
    const planeSegments = 100;
    const planeColor = Colors.PURPLE;
    const plane = new Plane3D(canvas, planeCenter, planeRotation, planeWidth, planeHeight, planeSegments, planeColor);
    
    // Interaction
    const colorConnection = Colors.TEAL;
    const strictlyConvexShapePlane = new StrictlyConvexShapePlane3D(canvas, strictlyConvexShape, strictlyConvexShapeColor, plane, planeColor, colorConnection);
    strictlyConvexShapePlane.startAnimation();
});
