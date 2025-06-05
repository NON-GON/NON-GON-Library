import { Circle } from "../../Geometries/2D/Circle";
import { Convexcircle } from "../../Geometries/2D/Convexcircle";
import { ConvexLine } from "../../Geometries/2D/Convexline";
import { Ellipse } from "../../Geometries/2D/Ellipse";
import { Line } from "../../Geometries/2D/Line";
import { Superellipse } from "../../Geometries/2D/Superellipse";
import { quarticRoots, Vector2, Vector3 } from "../Util/Utils";
import * as THREE from "three";

export class ShortestDistance2D {
  /**
   * Find the contact points between a point and an ellipse.
   * @param point
   * @param ellipse
   * @returns A tuple of two points: the original point and the closest point on the ellipse.
   */
  static pointEllipseObj(
    point: Vector3 | Vector2,
    ellipse: Ellipse
  ): [Vector3, Vector3] {
    if (point instanceof Vector2) {
      point = new Vector3(point.x, point.y, 0);
    }
    if (point instanceof Vector2) {
      return [Vector3.Zero(), Vector3.Zero()];
    }

    let res: Vector3[] = [Vector3.Zero(), Vector3.Zero()];
    let T: Vector3 = Vector3.Zero(); // Closest point on the ellipse

    // Transform the query point to a new system of coordinates relative to the ellipse

    let Point_ = ellipse.InverseTransformPoint(point);
    console.log("Point_" + Point_.x + " " + Point_.y + " " + Point_.z);

    T = ShortestDistance2D.pointEllipse(
      Point_,
      ellipse.xradius,
      ellipse.yradius
    ); // Ensure no NaN values
    console.log("T: " + T.x + " " + T.y + " " + T.z);
    if (isNaN(T.x) || isNaN(T.y)) {
      throw new Error("Invalid result from pointEllipse");
    }
    T = ellipse.TransformPoint(T); // Transform back to world space
    console.log("T after transform: " + T.x + " " + T.y + " " + T.z);

    res[0] = point;
    res[1] = T;
    return [res[0], res[1]];
  }

  static pointEllipse(point: Vector3, a: number, b: number): Vector3 {
    let T = Vector3.Zero(); // Closest point on the ellipse

    // Transform the query point to a new system of coordinates relative to the ellipse
    let s1 = point.x;
    let s2 = point.y;

    let multy = 1;
    let multx = 1;

    if (s2 < 0) {
      s2 = -s2;
      multy = -1;
    }

    if (s2 > 0) {
      if (s1 < 0) {
        s1 = -s1;
        multx = -1;
      }

      if (s1 > 0) {
        let a2 = a * a;
        let b2 = b * b;
        let s12 = s1 * s1;
        let s22 = s2 * s2;
        let z0 = -a2 * a2 * b2 * b2 + a2 * s12 * b2 * b2 + s22 * b2 * a2 * a2;
        let z1 =
          2 * b2 * s12 * a2 +
          2 * a2 * b2 * s22 -
          2 * a2 * b2 * b2 -
          2 * b2 * a2 * a2;
        let z2 = a2 * s12 + b2 * s22 - b2 * b2 - a2 * a2 - 4 * a2 * b2;
        let z3 = -2 * (b2 + a2);

        // Solve quartic equation
        let roots = quarticRoots(-1, z3, z2, z1, z0);
        // Find the largest valid root
        let t = -Infinity;
        for (let r = 0; r < 4; r++) {
          if (t < roots[r] && !Number.isNaN(roots[r])) {
            t = roots[r];
          }
        }

        T.x = (a * a * s1) / (t + a * a);
        T.y = (b * b * s2) / (t + b * b);
      } else {
        T.x = 0;
        T.y = b;
      }
    } else {
      if (s1 < (a * a - b * b) / a) {
        T.x = (a * a * s1) / (a * a - b * b);
        T.y = b * Math.sqrt(1 - (T.x / a) * (T.x / a));
      } else {
        T.x = a;
        T.y = 0;
      }
    }

    T.x = T.x * multx;
    T.y = T.y * multy;
    return T;
  }

  /**
   * Find the contact points between two ellipses.
   * @param ellipse1
   * @param ellipse2
   * @returns A tuple of two points: the closest point of the ellipse1 and the closest point of the ellipse2.
   */
  static ellipseEllipse(
    ellipse1: Ellipse,
    ellipse2: Ellipse
  ): [Vector2, Vector2] {
    const tol = 0.1;
    let p1 = ellipse1.getCenter().toVector2();
    let p2 = ShortestDistance2D.pointEllipseObj(p1, ellipse2)[1].toVector2();
    console.log("Point ellipse outside of while:" + p1.x + " " + p1.y);
    let dist = p1.distanceTo(p2);

    while (true) {
      p1 = ShortestDistance2D.pointEllipseObj(p2, ellipse1)[1].toVector2();
      console.log("Point ellipse inside of while 1:" + p1.x + " " + p1.y);

      console.log(p1);
      let dist_ = p1.distanceTo(p2);
      if (Math.abs(dist - dist_) < tol) {
        break;
      }
      dist = dist_;
      p2 = ShortestDistance2D.pointEllipseObj(p1, ellipse2)[1].toVector2();
      console.log("Point ellipse inside of while 2:" + p2.x + " " + p2.y);
      dist_ = p1.distanceTo(p2);
      if (Math.abs(dist - dist_) < tol) {
        break;
      }
      dist = dist_;
    }

    return [p1.toVector2(), p2];
  }
  /**
   * Find the contact points between a line and an ellipse.
   * @param line
   * @param superellipse
   * @returns A tuple of two points: the closest point of the line and the closest point of the superellipse.
   */
  static superellipseLine(
    line: Line,
    superellipse: Superellipse
  ): [Vector3, Vector3] {
    let n = line.TransformDirection(new Vector3(0, 1, 0));
    console.log("Normal: " + n.x + " " + n.y);
    let a = superellipse.xradius;
    let b = superellipse.yradius;
    let e = superellipse.e;

    n = superellipse.InverseTransformDirection(n);
    let nx = n.x;
    let ny = n.y;
    console.log("Normal after inverse transform: " + nx + " " + ny);
    let phi = Math.atan(
      (Math.sign(ny) * Math.pow(Math.abs(b * ny), 1 / (2 - e))) /
        (Math.sign(nx) * Math.pow(Math.abs(a * nx), 1 / (2 - e)))
    );
    console.log("Phi: " + phi);

    let cosPhi = Math.cos(phi);
    let sinPhi = Math.sin(phi);

    let T = new Vector2(
      Math.sign(cosPhi) * a * Math.pow(Math.abs(cosPhi), e),
      Math.sign(sinPhi) * b * Math.pow(Math.abs(sinPhi), e)
    );
    console.log("T: " + T.x + " " + T.y);
    let Ti = T.clone().scale(-1);
    console.log("Ti: " + Ti.x + " " + Ti.y);
    T = superellipse.TransformPoint(T.toVector3()).toVector2();
    Ti = superellipse.TransformPoint(Ti.toVector3()).toVector2();
    console.log("T after transform: " + T.x + " " + T.y);
    console.log("Ti after transform: " + Ti.x + " " + Ti.y);
    let T_ = line.InverseTransformPoint(T.toVector3());
    let Ti_ = line.InverseTransformPoint(Ti.toVector3());
    console.log("T_ after inverse transform: " + T_.x + " " + T_.y);
    console.log("Ti_ after inverse transform: " + Ti_.x + " " + Ti_.y);

    if (Math.abs(Ti_.y) < Math.abs(T_.y)) {
      T = Ti;
      T_ = Ti_;
    }
    let L = line.TransformPoint(new Vector3(T_.x, 0, 0));

    return [L, T.toVector3()];
  }

  /**
   * Find the contact points between a Convexline and a line.
   * @param convex
   * @param line
   * @returns A tuple of two points: the closest point of the Convexline and the closest point of the line.
   */
  static Convex_Line(convex: ConvexLine, line: Line): [Vector3, Vector3] {
    let center = convex.getCenter().toVector2();
    let center_ = line.InverseTransformPoint(center.toVector3()).toVector2();
    let p: [Vector3, Vector3];
    let y_: Vector2;

    if (center_.y > 0) {
      y_ = convex.TransformDirection(new Vector3(0, 1, 0)).toVector2();
    } else {
      y_ = convex.TransformDirection(new Vector3(0, -1, 0)).toVector2();
    }

    y_ = line.InverseTransformDirection(y_.toVector3()).toVector2();
    let alpha = THREE.MathUtils.degToRad(y_.signedAngle(new Vector2(0, 1)));

    let f = convex.f(alpha);
    let fd = convex.fd(alpha);
    let r = Math.sqrt(f ** 2 + fd ** 2);
    let phi = alpha + Math.atan(fd / f) - Math.PI / 2;

    let rpc = new Vector2(Math.cos(phi), Math.sin(phi)).scale(r);
    rpc = convex.TransformPoint(rpc.toVector3()).toVector2();

    let rpc_ = line.InverseTransformPoint(rpc.toVector3()).toVector2();
    let l: Vector2;

    if (center_.y > 0) {
      l = line.TransformPoint(new Vector3(rpc_.x, 0, 0)).toVector2();
    } else {
      l = line.TransformPoint(new Vector3(-rpc_.x, 0, 0)).toVector2();
    }

    p = [l.toVector3(), rpc.toVector3()];
    return p;
  }

  /**
   * Find the contact points between a Convexcircle and a line.
   * @param convexCircle
   * @param circle
   * @returns A tuple of two points: the closest point of the Convexcircle and the closest point of the circle.
   */
  static ConvexCircle_Circle(convexCircle: Convexcircle, circle: Circle) {
    // Get centers in world space
    let center_convex = convexCircle.getCenter().toVector2();
    let center_circle = circle.getCenter().toVector2();

    // Direction from convexCircle to circle
    let direction = center_circle.subtract(center_convex).normalize();

    // Compute angle in convexCircle's local space
    let localDir = convexCircle
      .InverseTransformDirection(direction.toVector3())
      .toVector2()
      .normalize();
    let alpha = Math.atan2(localDir.y, localDir.x);

    // Get farthest point on convexCircle in this direction
    let R_c = convexCircle.getRadius();
    let rpc = convexCircle.point(alpha, R_c);

    // Transform this point to world space
    let convex_point = convexCircle.TransformPoint(rpc.toVector3());

    // Find the closest point on the circle in the direction of the convex_point
    let dir_to_convex = convex_point
      .toVector2()
      .subtract(center_circle)
      .normalize();
    let circle_point = center_circle.add(
      dir_to_convex.scale(circle.getRadius())
    );

    return [convex_point, circle_point.toVector3()];
  }
}
