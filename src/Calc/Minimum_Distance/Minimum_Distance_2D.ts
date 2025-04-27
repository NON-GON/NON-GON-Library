import { Ellipse } from "../../Geometries/2D/Ellipse";
import { Line } from "../../Geometries/2D/Line";
import { Superellipse } from "../../Geometries/2D/Superellipse";
import { Distance, quarticRoots, Vector2, Vector3 } from "../Util/Utils";

export class MinimumDistance2D {
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

    let a = ellipse.xradius;
    let b = ellipse.yradius;

    // Transform the query point to a new system of coordinates relative to the ellipse

    let Point_ = ellipse.WorldSpaceToLocalSpace(point);

    T = MinimumDistance2D.pointEllipse(Point_, a, b); // Ensure no NaN values
    if (isNaN(T.x) || isNaN(T.y)) {
      throw new Error("Invalid result from pointEllipse");
    }
    T = ellipse.LocalSpaceToWorldSpace(T); // Transform back to world space

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

  static ellipseEllipse(
    ellipse1: Ellipse,
    ellipse2: Ellipse
  ): [Vector2, Vector2] {
    let tol = 0.1;
    let T: Vector2[] = [new Vector2(0, 0), new Vector2(0, 0)];
    let p1 = ellipse1.getCenter();
    let p2 = MinimumDistance2D.pointEllipseObj(p1, ellipse2)[1];

    let dist = Distance(p1, p2);

    while (true) {
      p1 = MinimumDistance2D.pointEllipseObj(p2, ellipse1)[1];
      let dist_ = Distance(p1, p2);
      if (Math.abs(dist - dist_) < tol) {
        break;
      }
      dist = dist_;
      p2 = MinimumDistance2D.pointEllipseObj(p1, ellipse2)[1];
      dist_ = Distance(p1, p2);
      if (Math.abs(dist - dist_) < tol) {
        break;
      }
      dist = dist_;
    }
    T[0] = p1;
    T[1] = p2;
    return [T[0], T[1]];
  }

  static superellipseLine(
    line: Line,
    superellipse: Superellipse
  ): [Vector3, Vector3] {
    let n = line.TransformDirection(new Vector3(0, 1, 0));

    let a = superellipse.xradius;
    let b = superellipse.yradius;
    let e = superellipse.exponent;

    n = superellipse.InverseTransformDirection(n);
    let nx = n.x;
    let ny = n.y;
    let phi = Math.atan(
      (Math.sign(ny) * Math.pow(Math.abs(b * ny), 1 / (2 - e))) /
        (Math.sign(nx) * Math.pow(Math.abs(a * nx), 1 / (2 - e)))
    );

    let cosPhi = Math.cos(phi);
    let sinPhi = Math.sin(phi);

    let T = new Vector2(
      Math.sign(cosPhi) * a * Math.pow(Math.abs(cosPhi), e),
      Math.sign(sinPhi) * b * Math.pow(Math.abs(sinPhi), e)
    );
    let Ti = T.clone().scale(-1);

    T = superellipse.TransformPoint(T.toVector3());
    Ti = superellipse.TransformPoint(Ti.toVector3());

    let T_ = line.InverseTransformPoint(T.toVector3());
    let Ti_ = line.InverseTransformPoint(Ti.toVector3());

    if (Math.abs(Ti_.y) < Math.abs(T_.y)) {
      T = Ti;
      T_ = Ti_;
    }
    let L = line.TransformPoint(new Vector3(T_.x, 0, 0));

    return [L, T.toVector3()];
  }
}
