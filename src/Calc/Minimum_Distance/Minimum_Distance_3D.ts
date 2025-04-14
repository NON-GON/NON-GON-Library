import {
  Vector3,
  Vector2,
  WorldSpaceToLocalSpace3D,
  LocalSpaceToWorldSpace3D,
  getRoot,
} from "../Util/Utils";
import { Ellipsoid } from "../../Geometries/3D/Ellipsoid";
import { Sphere } from "../../Geometries/3D/Sphere";
import { pointEllipse } from "./Minimum_Distance_2D";



export function point_Ellipsoid(
  point: Vector3,
  ellipsoid: Ellipsoid | Sphere
): Vector3[] {
  let sol: Vector3[] = [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
  let a = ellipsoid.xradius; // Ellipsoid semi-axis
  let b = ellipsoid.yradius;
  let c = ellipsoid.zradius;

  // Transform the query point to a new system of coordinates relative to the ellipsoid
  let Point_ = WorldSpaceToLocalSpace3D(ellipsoid, point);
  let s1 = Point_.x;
  let s2 = Point_.y;
  let s3 = Point_.z;

  let x = 0;
  let y = 0;
  let z = 0;

  let multx = 1;
  let multy = 1;
  let multz = 1;

  if (s3 < 0) {
    s3 = -s3;
    multz = -1;
  }
  if (s2 < 0) {
    s2 = -s2;
    multy = -1;
  }
  if (s1 < 0) {
    s1 = -s1;
    multx = -1;
  }

  let emin = Math.min(a, b, c);

  if (s3 > 0) {
    if (s2 > 0) {
      if (s1 > 0) {
        let z0 = s1 / a;
        let z1 = s2 / b;
        let z2 = s3 / c;
        let g = z0 * z0 + z1 * z1 + z2 * z2 - 1;
        if (g !== 0) {
          let r0 = (a * a) / (emin * emin);
          let r1 = (b * b) / (emin * emin);
          let r2 = (c * c) / (emin * emin);
          let tbar = getRoot(r0, r1, r2, z0, z1, z2, g, 200);
          x = (r0 * s1) / (tbar + r0);
          y = (r1 * s2) / (tbar + r1);
          z = (r2 * s3) / (tbar + r2);
        } else {
          x = s1;
          y = s2;
          z = s3;
        }
      } else {
        x = 0;
        let l = pointEllipse(new Vector2(s2, s3), b, c);
        y = l.x;
        z = l.y;
      }
    } else {
      y = 0;
      if (s1 > 0) {
        let l = pointEllipse(new Vector2(s1, s3), a, c);
        x = l.x;
        z = l.y;
      } else {
        x = 0;
        z = c;
      }
    }
  } else {
    let d = a * a - c * c;
    let d1 = b * b - c * c;
    let n = a * s1;
    let n1 = b * s2;
    let computed = false;

    if (n < d && n1 < d1) {
      let xde = n / d;
      let xde1 = n1 / d1;
      let xdesqr = xde * xde;
      let xde1sqr = xde1 * xde1;
      let discr = 1 - xdesqr - xde1sqr;

      if (discr > 0) {
        x = a * xde;
        y = b * xde1;
        z = c * Math.sqrt(discr);
        computed = true;
      }
    }
    if (!computed) {
      z = 0;
      let l = pointEllipse(new Vector2(s1, s2), a, b);
      x = l.x;
      y = l.y;
    }
  }

  x = multx * x;
  y = multy * y;
  z = multz * z;
  sol[0] = point;
  let pop = new Vector3(x, y, z);
  pop = LocalSpaceToWorldSpace3D(ellipsoid, pop);
  sol[1] = pop;
  return sol;
}

export function ellipsoidEllipsoid(
  ellipsoid1: Ellipsoid | Sphere,
  ellipsoid2: Ellipsoid | Sphere
): Vector3[] {
  let sol: Vector3[] = [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];

  // Calculate the direction vector between the two ellipsoids
  let d = WorldSpaceToLocalSpace3D(
    ellipsoid1,
    ellipsoid1.getCenter().subtract(ellipsoid2.getCenter())
  );


  // Initialize points and distances
  let point0 = ellipsoid1.getCenter();
  let point1 = point_Ellipsoid(point0, ellipsoid2)[1];
  let dist0 = point0.distanceTo(point1);
  let dist1: number;
  let n_iter = 0;

  // Iterative process to find the closest points
  while (true) {
    point0 = point1;
    point1 = point_Ellipsoid(point0, ellipsoid2)[1];
    dist1 = point0.distanceTo(point1);

    point0 = point1;
    dist0 = dist1;
    point1 = point_Ellipsoid(point0, ellipsoid1)[1];
    dist1 = point0.distanceTo(point1);

    if (Math.abs(dist0 - dist1) < 1e-1 || n_iter > 15) {
      break;
    }
    dist0 = dist1;
    n_iter++;
  }

  sol[0] = point1;
  sol[1] = point0;

  return sol;
}

export superellipsoidPlane(
  plane: Plane,
  superellipsoid: Superellipsoid
): [Vector3, Vector3] {
  let sol = [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
  let center = superellipsoid.getCenter();
  center = superellipsoid.InverseTransformPoint(center);
  center = Plane.TransformPoint(center);
  let n;
  if(center.y > 0){
    
  }
}