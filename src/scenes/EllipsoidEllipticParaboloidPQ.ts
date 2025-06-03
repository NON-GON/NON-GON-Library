import { Ellipsoid3D } from "./shapes/3D/Ellipsoid3D";
import { EllipticParaboloid3D } from "./shapes/3D/EllipticParaboloid3D";
import { EllipsoidEllipticParaboloidPQ } from "./proximity_queries/3D/EllipsoidEllipticParaboloidPQ";
import { Vector3 } from "../Calc/Util/Utils";
import { Colors } from "../colors";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("c") as HTMLCanvasElement;

  // Ellipsoid
  const ellipsoidCenter = new Vector3(0, 0, 15);
  const ellipsoidXRadius = 25;
  const ellipsoidYRadius = 50;
  const ellipsoidZRadius = 25;
  const ellipsoidRotation = new Vector3(0, 0, 0);
  const ellipsoidSegments = 25;
  const ellipsoidId = "Ellipsoid";
  const ellipsoidColor = Colors.SHAPE1_COLOR_3D;
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

  // Elliptic Paraboloid
  const ellipticParaboloidCenter = new Vector3(0, -50, -15);
  const ellipticParaboloidXRadius = 25;
  const ellipticParaboloidYRadius = 25;
  const ellipticParaboloidHeight = 100;
  const ellipticParaboloidRotation = new Vector3(-90, 0, 0);
  const ellipticParaboloidSegments = 25;
  const ellipticParaboloidId = "Elliptic Paraboloid";
  const ellipticParaboloidColor = Colors.SHAPE2_COLOR_3D;
  const ellipticParaboloid = new EllipticParaboloid3D(
    canvas,
    ellipticParaboloidCenter,
    ellipticParaboloidXRadius,
    ellipticParaboloidYRadius,
    ellipticParaboloidHeight,
    ellipticParaboloidRotation,
    ellipticParaboloidSegments,
    ellipticParaboloidId,
    ellipticParaboloidColor
  );

  // Interaction
  const ellipsoidEllipticParaboloid = new EllipsoidEllipticParaboloidPQ(
    canvas,
    ellipsoid,
    ellipticParaboloid
  );
  ellipsoidEllipticParaboloid.startAnimation();
});
