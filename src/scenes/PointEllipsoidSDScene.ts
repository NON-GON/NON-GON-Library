import { Point3D } from "./shapes/3D/Point3D";
import { Ellipsoid3D } from "./shapes/3D/Ellipsoid3D";
import { PointEllipsoidSD } from "./shortest_distance/3D/PointEllipsoidSD";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Point
  const pointCenter = new Vector3(25, 25, 25);
  const pointId = "Point";
  const pointColor = Colors.SHAPE1_COLOR_3D;
  const point = new Point3D(canvas, pointCenter, pointId, pointColor);

  // Ellipsoid
  const ellipsoidCenter = new Vector3(-25, -25, -25);
  const ellipsoidXRadius = 25;
  const ellipsoidYRadius = 50;
  const ellipsoidZRadius = 25;
  const ellipsoidRotation = new Vector3(0, 0, 0);
  const ellipsoidSegments = 100;
  const ellipsoidId = "Ellipsoid";
  const ellipsoidColor = Colors.SHAPE2_COLOR_3D;
  const ellipsoid = new Ellipsoid3D(
    canvas,
    ellipsoidCenter,
    ellipsoidXRadius,
    ellipsoidYRadius,
    ellipsoidZRadius,
    ellipsoidRotation,
    ellipsoidSegments,
    ellipsoidId,
    ellipsoidColor
  );

  // Interaction
  const colorConnection = Colors.CONNECTION_COLOR;
  const pointEllipsoid = new PointEllipsoidSD(
    canvas,
    point,
    ellipsoid,
    colorConnection
  );
  pointEllipsoid.startAnimation();
});
