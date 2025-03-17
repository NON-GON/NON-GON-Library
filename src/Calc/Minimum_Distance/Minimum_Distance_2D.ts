import { Ellipse } from "../../Geometries/2D/Ellipse";
import { Distance, quarticRoots, Vector2, LocalSpaceToWorldSpace, WorldSpaceToLocalSpace } from "../Util/Utils";




export function pointEllipseObj(point: Vector2, ellipse: Ellipse): [Vector2, Vector2] {
    let res: Vector2[] = [new Vector2(0, 0), new Vector2(0, 0)];
    let T: Vector2 = new Vector2(0, 0); // Closest point on the ellipse

    let a = ellipse.xradius;
    let b = ellipse.yradius;

    // Transform the query point to a new system of coordinates relative to the ellipse
    let Point_ = WorldSpaceToLocalSpace(ellipse, point);

    T = pointEllipse(Point_, a, b);
    T = LocalSpaceToWorldSpace(ellipse, T);

    res[0] = point;
    res[1] = T;
    return [res[0], res[1]];
}

export function pointEllipse(point: Vector2, a: number, b: number): Vector2 {
  let T = new Vector2(0, 0); // Closest point on the ellipse

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
          let z1 = 2 * b2 * s12 * a2 + 2 * a2 * b2 * s22 - 2 * a2 * b2 * b2 - 2 * b2 * a2 * a2;
          let z2 = a2 * s12 + b2 * s22 - b2 * b2 - a2 * a2 - 4 * a2 * b2;
          let z3 = -2 * (b2 + a2);
          
          // Solve quartic equation
          let roots = quarticRoots(-1, z3, z2, z1, z0);
          
          // Find the largest valid root
          let t = -Infinity;
          for (let r = 0; r < roots.length; r++) {
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

export function ellipseEllipse(ellipse1: Ellipse, ellipse2: Ellipse): [Vector2, Vector2] {
    let tol = 0.1;
    let T: Vector2[] = [new Vector2(0, 0), new Vector2(0, 0)];

    let p1 = ellipse1.getCenter();
    let p2 = pointEllipseObj(p1, ellipse2)[1];
    let dist = Distance(p1, p2);

    while(true){
        p1 = pointEllipseObj(p2, ellipse1)[1];
        let dist_ = Distance(p1, p2);
        if (Math.abs(dist - dist_) < tol) {
            break;
        }
        dist = dist_;
        p2 = pointEllipseObj(p1, ellipse2)[1];
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