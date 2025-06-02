import { Vector3, Vector2, getRoot } from "../Util/Utils";
import { Ellipsoid } from "../../Geometries/3D/Ellipsoid";
import { Sphere } from "../../Geometries/3D/Sphere";
import { Plane } from "../../Geometries/2D/Plane";
import { Superellipsoid } from "../../Geometries/3D/Superellipsoid";
import { ShortestDistance2D } from "./Shortest_Distance_2D";
import { Convex } from "../../Geometries/3D/Convex";
export class ShortestDistance3D {
  /**
   * Find the contact points between a point and an ellipsoid.
   * @param point
   * @param ellipsoid
   * @returns A tuple of two points: the original point and the closest point on the ellipsoid.
   */
  static point_Ellipsoid(
    point: Vector3,
    ellipsoid: Ellipsoid | Sphere
  ): Vector3[] {
    const copyPoint = point.clone();
    let sol: Vector3[] = [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
    let a = 0;
    let b = 0;
    let c = 0;
    if (ellipsoid instanceof Sphere) {
      a = ellipsoid.radius; // Ellipsoid semi-axis
      b = ellipsoid.radius;
      c = ellipsoid.radius;
    } else if (ellipsoid instanceof Ellipsoid) {
      a = ellipsoid.xradius; // Ellipsoid semi-axis
      b = ellipsoid.yradius;
      c = ellipsoid.zradius;
    }

    // Transform the query point to a new system of coordinates relative to the ellipsoid
    let Point_ = ellipsoid.WorldSpaceToLocalSpace(point);
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
          let l = ShortestDistance2D.pointEllipse(
            new Vector2(s2, s3).toVector3(),
            b,
            c
          );
          y = l.x;
          z = l.y;
        }
      } else {
        y = 0;
        if (s1 > 0) {
          let l = ShortestDistance2D.pointEllipse(
            new Vector2(s1, s3).toVector3(),
            a,
            c
          );
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
        let l = ShortestDistance2D.pointEllipse(
          new Vector2(s1, s2).toVector3(),
          a,
          b
        );
        x = l.x;
        y = l.y;
      }
    }

    x = multx * x;
    y = multy * y;
    z = multz * z;
    sol[0] = copyPoint;
    let pop = new Vector3(x, y, z);
    pop = ellipsoid.LocalSpaceToWorldSpace(pop);
    sol[1] = pop;
    console.log(
      "Shortest distance point to ellipsoid: " +
        sol[0].x +
        " " +
        sol[0].y +
        " " +
        sol[0].z +
        " " +
        " -> " +
        sol[1].x +
        " " +
        sol[1].y +
        " " +
        sol[1].z
    );
    return sol;
  }

  /**
   * Find the contact points between two ellipsoids.
   * @param ellipsoid1
   * @param ellipsoid2
   * @returns A tuple of two points: the closest point of the ellipsoid1 and the closest point of the ellipsoid2.
   */
  static ellipsoidEllipsoid(
    ellipsoid1: Ellipsoid | Sphere,
    ellipsoid2: Ellipsoid | Sphere
  ): Vector3[] {
    let sol: Vector3[] = [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];

    // Initialize points and distances
    let point0 = ellipsoid1.getCenter();
    let point1 = ShortestDistance3D.point_Ellipsoid(point0, ellipsoid2)[1];
    let dist0 = point0.distanceTo(point1);
    let dist1: number;
    let n_iter = 0;

    // Iterative process to find the closest points
    while (true) {
      point0 = point1;
      point1 = ShortestDistance3D.point_Ellipsoid(point0, ellipsoid2)[1];
      dist1 = point0.distanceTo(point1);

      point0 = point1;
      dist0 = dist1;
      point1 = ShortestDistance3D.point_Ellipsoid(point0, ellipsoid1)[1];
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

  /**
   * Find the contact points between a plane and a superellipsoid.
   * @param plane
   * @param superellipsoid
   * @returns A tuple of two points: the closest point of the plane and the closest point of the superellipsoid.
   */
  static superellipsoidPlane(
    plane: Plane,
    superellipsoid: Superellipsoid
  ): [Vector3, Vector3] {
    let sol: [Vector3, Vector3] = [Vector3.Zero(), Vector3.Zero()];

    let center = superellipsoid.getCenter();
    center = superellipsoid.InverseTransformPoint(center);

    let temp = plane.TransformPoint(center);
    center = new Vector3(temp.x, temp.y, 0);

    let n: Vector3;
    if (center.y > 0) {
      let temp = plane.TransformDirection(new Vector3(0, 1, 0));
      if (temp instanceof Vector2) {
        n = new Vector3(temp.x, temp.y, 0);
      } else {
        n = temp;
      }
    } else {
      let temp = plane.TransformDirection(new Vector3(0, -1, 0));
      if (temp instanceof Vector2) {
        n = new Vector3(temp.x, temp.y, 0);
      } else {
        n = temp;
      }
    }

    n = superellipsoid.InverseTransformDirection(n);

    const EPS = Math.pow(10, -6);
    let phi1: number;
    let phi2: number;

    if (Math.abs(n.x) <= EPS && Math.abs(n.y) <= EPS) {
      phi1 = Math.PI / 2;
      phi2 = (Math.sign(n.z) * Math.PI) / 2;
    } else if (Math.abs(n.x) <= EPS && Math.abs(n.z) <= EPS) {
      phi1 = Math.PI + (Math.sign(n.y) * Math.PI) / 2;
      phi2 = 0;
    } else if (Math.abs(n.y) <= EPS && Math.abs(n.z) <= EPS) {
      phi1 = Math.PI + Math.sign(n.x) * Math.PI;
      phi2 = 0;
    } else {
      const anx = Math.abs(superellipsoid.xradius * n.x);
      const bny = Math.abs(superellipsoid.yradius * n.y);
      phi1 = Math.atan2(
        Math.sign(n.y) * Math.pow(bny, 1 / (2 - superellipsoid.e1)),
        Math.sign(n.x) * Math.pow(anx, 1 / (2 - superellipsoid.e1))
      );

      if (anx > bny) {
        const Cphi = Math.cos(phi1);
        phi2 = Math.atan2(
          Math.sign(n.z) *
            Math.pow(
              Math.abs(
                superellipsoid.zradius *
                  n.z *
                  Math.sign(Cphi) *
                  Math.pow(Math.abs(Cphi), 2 - superellipsoid.e1)
              ),
              1 / (2 - superellipsoid.e2)
            ),
          Math.sign(n.x) * Math.pow(anx, 1 / (2 - superellipsoid.e2))
        );
      } else {
        const Sphi = Math.sin(phi1);
        phi2 = Math.atan2(
          Math.sign(n.z) *
            Math.pow(
              Math.abs(
                superellipsoid.zradius *
                  n.z *
                  Math.sign(Sphi) *
                  Math.pow(Math.abs(Sphi), 2 - superellipsoid.e1)
              ),
              1 / (2 - superellipsoid.e2)
            ),
          Math.sign(n.y) * Math.pow(bny, 1 / (2 - superellipsoid.e2))
        );
      }
    }

    const point1_local = superellipsoid.point(phi1, phi2);
    const point2_local = point1_local.clone().scale(-1);

    const point1_world = superellipsoid.LocalSpaceToWorldSpace(
      point1_local.clone()
    );
    const point2_world = superellipsoid.LocalSpaceToWorldSpace(
      point2_local.clone()
    );

    const point_plane1 = plane.WorldSpaceToLocalSpace(point1_world.clone());
    const point_plane2 = plane.WorldSpaceToLocalSpace(point2_world.clone());

    const dist1 = Math.abs(point_plane1.y);
    const dist2 = Math.abs(point_plane2.y);

    point_plane1.y = 0;
    point_plane2.y = 0;

    if (dist1 < dist2) {
      sol[0] = plane.LocalSpaceToWorldSpace(point_plane1.clone());
      sol[1] = point1_world;
    } else {
      sol[0] = plane.LocalSpaceToWorldSpace(point_plane2.clone());
      sol[1] = point2_world;
    }

    return sol;
  }

  /**
   * Find the contact points between a convex and a plane.
   * @param geometry
   * @param plane
   * @returns A tuple of two points: the closest point of the convex and the closest point of the plane.
   */
  static AlmostConvexGeometryPlane(
    geometry: Convex,
    plane: Plane
  ): [Vector3, Vector3] {
    let n = plane.TransformDirection(new Vector3(0, 1, 0));
    n = geometry.InverseTransformDirection(n).scale(-1);

    let theta =
      (Math.PI / 180) *
      n
        .projectOnPlane(new Vector3(0, 0, 1))
        .signedAngle(new Vector3(1, 0, 0), new Vector3(0, 0, -1));
    let phi = (Math.PI / 180) * n.angleTo(new Vector3(0, 1, 0));
    let point = geometry.point(theta, phi);
    point = geometry.TransformPoint(point);
    let point_ = plane.InverseTransformPoint(point);
    point_ = new Vector3(point_.x, 0, point_.z);
    point_ = plane.TransformPoint(point_);
    return [point_, point];
  }
}
