import { Plane } from "../../Geometries/2D/Plane";
import { Cylinder } from "../../Geometries/3D/Cylinder";
import { Ellipsoid } from "../../Geometries/3D/Ellipsoid";
import { EllipticParaboloid } from "../../Geometries/3D/Ellipticparaboloid";
import { Hyperboloid } from "../../Geometries/3D/Hyperboloid";
import {
  ApproximatlyEqual,
  radToDeg,
  degToRad,
  calDetMatrix4x4,
  DescartesLawOfSignsFourthDegreePolynomial,
  FindClosestPoints,
  FindIntersectionPoints,
  IsPlaneBetween,
  overlaps,
  RectanglesIntersect,
  SAT,
  Vector3,
  VertexEdgeTestFunction,
} from "../Util/Utils";

export class ProximityQuery3D {
  /**
   * Checks if a point is inside a sphere in 3D space.
   * @param positionPoint
   * @param positionSphere
   * @param sphereRadius
   * @returns  True if the point is inside the sphere, false otherwise.
   */
  public static PointSphere3D(
    positionPoint: Vector3,
    positionSphere: Vector3,
    sphereRadius: number
  ): boolean {
    const pX = positionPoint.x;
    const pY = positionPoint.y;
    const pZ = positionPoint.z;
    const sX = positionSphere.x;
    const sY = positionSphere.y;
    const sZ = positionSphere.z;

    const distance = Math.sqrt(
      (pX - sX) ** 2 + (pY - sY) ** 2 + (pZ - sZ) ** 2
    );
    return distance < sphereRadius;
  }
  /**
   * Checks if a 3D point lies within a 3D Axis-Aligned Bounding Box (AABB).
   * @param positionPoint - The point's 3D position.
   * @param positionAABB - The center position of the AABB.
   * @param lengthAABB - Length of the AABB along the X-axis.
   * @param heightAABB - Height of the AABB along the Z-axis.
   * @param widthAABB - Width of the AABB along the Y-axis.
   * @returns True if the point lies inside the AABB, false otherwise.
   */
  public static Point_AABB3D(
    positionPoint: Vector3,
    positionAABB: Vector3,
    lengthAABB: number,
    heightAABB: number,
    widthAABB: number
  ): boolean {
    const pX = positionPoint.x;
    const pY = positionPoint.y;
    const pZ = positionPoint.z;
    const minX = positionAABB.x - lengthAABB / 2;
    const maxX = positionAABB.x + lengthAABB / 2;
    const minY = positionAABB.y - widthAABB / 2;
    const maxY = positionAABB.y + widthAABB / 2;
    const minZ = positionAABB.z - heightAABB / 2;
    const maxZ = positionAABB.z + heightAABB / 2;

    return (
      pX >= minX &&
      pX <= maxX &&
      pY >= minY &&
      pY <= maxY &&
      pZ >= minZ &&
      pZ <= maxZ
    );
  }
  /**
   * Checks if a sphere intersects with a 3D AABB.
   * @param positionAABB - The center position of the AABB.
   * @param lengthAABB - Length of the AABB along the X-axis.
   * @param heightAABB - Height of the AABB along the Z-axis.
   * @param widthAABB - Width of the AABB along the Y-axis.
   * @param positionSphere - The center position of the sphere.
   * @param sphereRadius - Radius of the sphere.
   * @returns True if the sphere intersects the AABB, false otherwise.
   */
  public static Sphere_AABB3D(
    positionAABB: Vector3,
    lengthAABB: number,
    heightAABB: number,
    widthAABB: number,
    positionSphere: Vector3,
    sphereRadius: number
  ): boolean {
    const minX = positionAABB.x - lengthAABB / 2;
    const maxX = positionAABB.x + lengthAABB / 2;
    const minY = positionAABB.y - widthAABB / 2;
    const maxY = positionAABB.y + widthAABB / 2;
    const minZ = positionAABB.z - heightAABB / 2;
    const maxZ = positionAABB.z + heightAABB / 2;
    const sX = positionSphere.x;
    const sY = positionSphere.y;
    const sZ = positionSphere.z;

    const x = Math.max(minX, Math.min(sX, maxX));
    const y = Math.max(minY, Math.min(sY, maxY));
    const z = Math.max(minZ, Math.min(sZ, maxZ));

    const distance = Math.sqrt((x - sX) ** 2 + (y - sY) ** 2 + (z - sZ) ** 2);

    return distance < sphereRadius;
  }

  /**
   * Determines whether two spheres in 3D space intersect.
   * @param positionSphere1 - Center position of the first sphere.
   * @param positionSphere2 - Center position of the second sphere.
   * @param sphereRadius1 - Radius of the first sphere.
   * @param sphereRadius2 - Radius of the second sphere.
   * @returns True if the spheres intersect, false otherwise.
   */
  public static SphereSphere3D(
    positionSphere1: Vector3,
    positionSphere2: Vector3,
    sphereRadius1: number,
    sphereRadius2: number
  ): boolean {
    const sX1 = positionSphere1.x;
    const sX2 = positionSphere2.x;
    const sY1 = positionSphere1.y;
    const sY2 = positionSphere2.y;
    const sZ1 = positionSphere1.z;
    const sZ2 = positionSphere2.z;

    const distance = Math.sqrt(
      (sX1 - sX2) ** 2 + (sY1 - sY2) ** 2 + (sZ1 - sZ2) ** 2
    );
    return distance < sphereRadius1 + sphereRadius2;
  }

  /**
   * Checks for intersection between two 3D AABBs.
   * @param positionAABB1 - Center position of the first AABB.
   * @param positionAABB2 - Center position of the second AABB.
   * @param length1 - Length of the first AABB along the X-axis.
   * @param length2 - Length of the second AABB along the X-axis.
   * @param width1 - Width of the first AABB along the Y-axis.
   * @param width2 - Width of the second AABB along the Y-axis.
   * @param height1 - Height of the first AABB along the Z-axis.
   * @param height2 - Height of the second AABB along the Z-axis.
   * @returns True if the AABBs intersect, false otherwise.
   */
  public static AABB_AABB3D(
    positionAABB1: Vector3,
    positionAABB2: Vector3,
    length1: number,
    length2: number,
    width1: number,
    width2: number,
    height1: number,
    height2: number
  ): boolean {
    const x1 = positionAABB1.x;
    const y1 = positionAABB1.y;
    const z1 = positionAABB1.z;
    const x2 = positionAABB2.x;
    const y2 = positionAABB2.y;
    const z2 = positionAABB2.z;

    return (
      x1 < x2 + length2 &&
      x1 + length1 > x2 &&
      y1 < y2 + width2 &&
      y1 + width1 > y2 &&
      z1 < z2 + height2 &&
      z1 + height1 > z2
    );
  }

  /**
   * Checks for intersection between two 3D Oriented Bounding Boxes (OBBs) using the Separating Axis Theorem (SAT).
   * @param normals - Array of separating axis normals to test.
   * @param corners1 - Vertices of the first OBB.
   * @param corners2 - Vertices of the second OBB.
   * @returns True if the OBBs intersect, false otherwise.
   */
  public static OBB_OBB3D(
    normals: Vector3[],
    corners1: Vector3[],
    corners2: Vector3[]
  ): boolean {
    for (let i = 0; i < normals.length; i++) {
      let shape1Min = 0,
        shape1Max = 0,
        shape2Min = 0,
        shape2Max = 0;
      const shape1 = SAT(normals[i], corners1, shape1Min, shape1Max);
      const shape2 = SAT(normals[i], corners2, shape2Min, shape2Max);
      if (!overlaps(shape1[0], shape1[1], shape2[0], shape2[1])) {
        return false;
      }
    }
    return true;
  }

  private static getAllIntersectionPoints(
    cylinder1Position: Vector3,
    cylinder2Position: Vector3,
    commonNormal: Vector3,
    Circle1Center1: Vector3,
    Circle2Center1: Vector3,
    Circle1Center2: Vector3,
    Circle2Center2: Vector3,
    zAxisCylinder1: Vector3,
    zAxisCylinder2: Vector3,
    cylinder1: Cylinder,
    cylinder2: Cylinder
  ) {
    const point1 = FindIntersectionPoints(
      cylinder1Position,
      commonNormal,
      Circle1Center1,
      zAxisCylinder1,
      cylinder1.xradius
    );
    const point2 = FindIntersectionPoints(
      cylinder1Position,
      commonNormal,
      Circle2Center1,
      zAxisCylinder1,
      cylinder1.xradius
    );
    const point3 = FindIntersectionPoints(
      cylinder2Position,
      commonNormal,
      Circle1Center2,
      zAxisCylinder2,
      cylinder2.xradius
    );
    const point4 = FindIntersectionPoints(
      cylinder2Position,
      commonNormal,
      Circle2Center2,
      zAxisCylinder2,
      cylinder2.xradius
    );

    return [point1, point2, point3, point4];
  }

  /**
   * Checks if two cylinders intersect in 3D space using the Chittawadigi method.
   * @param cylinder1 - The first cylinder.
   * @param cylinder2 - The second cylinder.
   * @returns True if the cylinders intersect, false otherwise.
   */
  public static Cylinder_Cylinder_Chittawadigi(
    cylinder1: Cylinder,
    cylinder2: Cylinder
  ): boolean {
    const cylinder1Position = cylinder1.getCenter();
    const cylinder2Position = cylinder2.getCenter();

    const zAxisCylinder1 = cylinder1.forward();
    const zAxisCylinder2 = cylinder2.forward();

    let closestPointAxisCylinder1: Vector3;
    let closestPointAxisCylinder2: Vector3;

    const { closestPointLineA, closestPointLineB } = FindClosestPoints(
      cylinder1Position,
      cylinder1Position.add(zAxisCylinder1),
      cylinder2Position,
      cylinder2Position.add(zAxisCylinder2)
    );

    closestPointAxisCylinder1 = closestPointLineA;
    closestPointAxisCylinder2 = closestPointLineB;

    const commonNormal = closestPointAxisCylinder2.subtract(
      closestPointAxisCylinder1
    );



    let b: number, a: number, alpha: number, c: number;

    if (
      closestPointAxisCylinder1.equal(cylinder1Position) &&
      closestPointAxisCylinder2.equal(cylinder2Position)
    ) {
      b = 0;
      c = Math.abs(cylinder2Position.z - cylinder1Position.z);
      const endOfSecondRay = new Vector3(
        cylinder1Position.x,
        cylinder1Position.y,
        cylinder1Position.z + cylinder2Position.z - cylinder1Position.z
      );
      a = Math.abs(cylinder2Position.distanceTo(endOfSecondRay));
      alpha = 0;

      console.log("[Parallel] Closest points are base points.");
    } else {
      b = closestPointAxisCylinder1.distanceTo(cylinder1Position);
      a = commonNormal.magnitude();
      const endOfSecondRay = closestPointAxisCylinder1.add(commonNormal);
      alpha =
        Math.round(cylinder1.forward().angleTo(cylinder2.forward()) * 100) /
        100;

      alpha = radToDeg(alpha);
      if (alpha > 90) alpha = 180 - alpha;

      c = endOfSecondRay.distanceTo(cylinder2Position);

      console.log("[General Case] Closest points not at base.");
    }

    // Precision clean-up
    if (a < 0.00001) a = 0;
    if (b < 0.00001) b = 0;
    if (c < 0.00001) c = 0;
    if (Math.abs(alpha) < 0.00001) alpha = 0;

    console.log(`[Parameters] a: ${a}, b: ${b}, c: ${c}, alpha: ${alpha}`);

    const s1 = cylinder1.yradius / 2;
    const s2 = cylinder2.yradius / 2;

    if ((alpha === 0 || alpha === 180) && b === 0) {
      console.log("[Case] Parallel and aligned.");
      const intersects =
        s1 + s2 >= Math.abs(c) &&
        cylinder1.xradius + cylinder2.xradius >= Math.abs(a);
      console.log("[Result] Parallel overlap:", intersects);
      return intersects;
    } else {
      if (
        Math.abs(b) <= s1 &&
        Math.abs(c) <= s2 &&
        Math.abs(a) <= cylinder1.xradius + cylinder2.xradius
      ) {
        console.log("[Early Out] Bounding box overlap.");
        return true;
      } else {
        let doZAxisIntersect = false;

        if (
          closestPointAxisCylinder1.distanceTo(closestPointAxisCylinder2) <=
          0.001
        ) {
          const crossProduct = zAxisCylinder1.cross(zAxisCylinder2);
          closestPointAxisCylinder2 = closestPointAxisCylinder2.add(
            crossProduct
          );
          commonNormal.set(
            closestPointAxisCylinder2.subtract(closestPointAxisCylinder1)
          );
          doZAxisIntersect = true;

          console.log("[Intersection] Cylinder axes intersect.");
        }

        const Circle1Center1 = cylinder1Position.add(zAxisCylinder1.scale(s1));
        const Circle2Center1 = cylinder1Position.subtract(
          zAxisCylinder1.scale(s1)
        );
        const Circle1Center2 = cylinder2Position.add(zAxisCylinder2.scale(s2));
        const Circle2Center2 = cylinder2Position.subtract(
          zAxisCylinder2.scale(s2)
        );




        const points = this.getAllIntersectionPoints(
          cylinder1Position,
          cylinder2Position,
          commonNormal,
          Circle1Center1,
          Circle2Center1,
          Circle1Center2,
          Circle2Center2,
          zAxisCylinder1,
          zAxisCylinder2,
          cylinder1,
          cylinder2
        );


        if (!points[0] || !points[1] || !points[2] || !points[3]) {
          console.log("[Failure] Intersection points could not be calculated.");
          return false;
        }

        const Q1Vertices = [];
        if (
          points[0][1].distanceTo(points[1][0]) <
          points[0][1].distanceTo(points[1][1])
        ) {
          Q1Vertices.push(
            points[0][0],
            points[0][1],
            points[1][0],
            points[1][1]
          );
        } else {
          Q1Vertices.push(
            points[0][0],
            points[0][1],
            points[1][1],
            points[1][0]
          );
        }

        const Q2Vertices = [];
        if (
          points[2][1].distanceTo(points[3][0]) <
          points[2][1].distanceTo(points[3][1])
        ) {
          if (doZAxisIntersect) {
            Q2Vertices.push(
              points[2][0],
              points[2][1],
              points[3][0],
              points[3][1]
            );
          } else {
            Q2Vertices.push(
              points[2][0].subtract(commonNormal),
              points[2][1].subtract(commonNormal),
              points[3][0].subtract(commonNormal),
              points[3][1].subtract(commonNormal)
            );
          }
        } else {
          if (doZAxisIntersect) {
            Q2Vertices.push(
              points[2][0],
              points[2][1],
              points[3][1],
              points[3][0]
            );
          } else {
            Q2Vertices.push(
              points[2][0].subtract(commonNormal),
              points[2][1].subtract(commonNormal),
              points[3][1].subtract(commonNormal),
              points[3][0].subtract(commonNormal)
            );
          }
        }

        console.log("[SAT] Testing rectangle intersection.");
        if (!RectanglesIntersect(Q1Vertices, Q2Vertices)) {
          console.log("[SAT] No intersection.");
          return false;
        }

        console.log("[SAT] Rectangles intersect. Running VertexEdgeTest...");
        const result = VertexEdgeTestFunction(
          s1,
          s2,
          cylinder1.xradius,
          cylinder2.xradius,
          a,
          b,
          c,
          alpha,
          cylinder1,
          cylinder2,
          commonNormal
        );

        console.log("[VertexEdgeTest] Result:", result);
        return result;
      }
    }
  }

  /**
   * Calculates the characteristic polynomial of two ellipsoids.
   * @param ellipsoid1 - The first ellipsoid.
   * @param ellipsoid2 - The second ellipsoid.
   * @returns The coefficients of the characteristic polynomial.
   */
  public static characteristicPolynomialEllipsoid(
    ellipsoid1: Ellipsoid,
    ellipsoid2: Ellipsoid
  ): number[] {
    const sinAlpha1 = Math.sin(ellipsoid1.getRotation().x * (Math.PI / 180));
    const sinBeta1 = Math.sin(ellipsoid1.getRotation().y * (Math.PI / 180));
    const sinPhi1 = Math.sin(ellipsoid1.getRotation().z * (Math.PI / 180));
    const cosAlpha1 = Math.cos(ellipsoid1.getRotation().x * (Math.PI / 180));
    const cosBeta1 = Math.cos(ellipsoid1.getRotation().y * (Math.PI / 180));
    const cosPhi1 = Math.cos(ellipsoid1.getRotation().z * (Math.PI / 180));

    const sinAlpha2 = Math.sin(ellipsoid2.getRotation().x * (Math.PI / 180));
    const sinBeta2 = Math.sin(ellipsoid2.getRotation().y * (Math.PI / 180));
    const sinPhi2 = Math.sin(ellipsoid2.getRotation().z * (Math.PI / 180));
    const cosAlpha2 = Math.cos(ellipsoid2.getRotation().x * (Math.PI / 180));
    const cosBeta2 = Math.cos(ellipsoid2.getRotation().y * (Math.PI / 180));
    const cosPhi2 = Math.cos(ellipsoid2.getRotation().z * (Math.PI / 180));

    const matrixA: number[][] = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
    const matrixB: number[][] = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    const aa1 = ellipsoid1.xradius * ellipsoid1.xradius;
    const bb1 = ellipsoid1.yradius * ellipsoid1.yradius;
    const cc1 = ellipsoid1.zradius * ellipsoid1.zradius;

    const aa2 = ellipsoid2.xradius * ellipsoid2.xradius;
    const bb2 = ellipsoid2.yradius * ellipsoid2.yradius;
    const cc2 = ellipsoid2.zradius * ellipsoid2.zradius;

    const A1 =
      cosBeta1 ** 2 * cosPhi1 ** 2 * bb1 * cc1 +
      cosBeta1 ** 2 * sinPhi1 ** 2 * aa1 * cc1 +
      sinBeta1 ** 2 * aa1 * bb1;
    const B1 =
      (sinBeta1 * sinAlpha1 * cosPhi1 + sinPhi1 * cosAlpha1) ** 2 * bb1 * cc1 +
      (sinPhi1 * sinBeta1 * sinAlpha1 + cosAlpha1 * cosPhi1) ** 2 * aa1 * cc1 +
      (sinAlpha1 * cosBeta1) ** 2 * aa1 * bb1;
    const C1 =
      (-sinBeta1 * cosAlpha1 * cosPhi1 + sinAlpha1 * sinPhi1) *
        (-sinBeta1 * sinAlpha1 * cosPhi1 + sinAlpha1 * sinPhi1) *
        bb1 *
        cc1 +
      (sinBeta1 * cosAlpha1 * sinPhi1 + cosPhi1 * sinAlpha1) *
        (sinBeta1 * cosAlpha1 * sinPhi1 + cosPhi1 * sinAlpha1) *
        aa1 *
        cc1 +
      cosBeta1 ** 2 * cosAlpha1 ** 2 * aa1 * bb1;
    const D1 =
      (sinBeta1 * sinAlpha1 * cosPhi1 * cosBeta1 * cosPhi1 +
        sinPhi1 * cosAlpha1 * cosBeta1 * cosPhi1) *
        bb1 *
        cc1 +
      (sinPhi1 * sinBeta1 * sinAlpha1 * cosBeta1 * sinPhi1 -
        cosAlpha1 * cosPhi1 * cosBeta1 * sinPhi1) *
        aa1 *
        cc1 +
      -sinAlpha1 * cosBeta1 * sinBeta1 * aa1 * bb1;
    const E1 =
      (-sinBeta1 * cosAlpha1 * cosPhi1 + sinAlpha1 * sinPhi1) *
        (sinBeta1 * sinAlpha1 * cosPhi1 + sinPhi1 * cosAlpha1) *
        bb1 *
        cc1 +
      (sinBeta1 * cosAlpha1 * sinPhi1 + cosPhi1 * sinAlpha1) *
        (-sinPhi1 * sinBeta1 * sinAlpha1 + cosAlpha1 * cosPhi1) *
        aa1 *
        cc1 +
      -cosBeta1 * cosAlpha1 * cosBeta1 * sinAlpha1 * aa1 * bb1;
    const F1 =
      (-sinBeta1 * cosAlpha1 * cosPhi1 * cosBeta1 * cosPhi1 +
        sinAlpha1 * sinPhi1 * cosBeta1 * cosPhi1) *
        bb1 *
        cc1 +
      (-sinBeta1 +
        cosAlpha1 * sinPhi1 * cosBeta1 * sinPhi1 -
        cosPhi1 * sinAlpha1 * cosBeta1 * sinPhi1) *
        aa1 *
        cc1 +
      cosBeta1 * cosAlpha1 * sinBeta1 * aa1 * bb1;

    const G1 =
      -ellipsoid1.getCenter().x * A1 -
      ellipsoid1.getCenter().y * D1 -
      ellipsoid1.getCenter().z * F1;
    const H1 =
      -ellipsoid1.getCenter().x * D1 -
      ellipsoid1.getCenter().y * B1 -
      ellipsoid1.getCenter().z * E1;
    const I1 =
      -ellipsoid1.getCenter().x * F1 -
      ellipsoid1.getCenter().y * E1 -
      ellipsoid1.getCenter().z * C1;
    const J1 =
      ellipsoid1.getCenter().x ** 2 * A1 +
      ellipsoid1.getCenter().x * ellipsoid1.getCenter().y * 2 * D1 +
      ellipsoid1.getCenter().x * ellipsoid1.getCenter().z * 2 * F1 +
      ellipsoid1.getCenter().y ** 2 * B1 +
      ellipsoid1.getCenter().y * ellipsoid1.getCenter().z * 2 * E1 +
      ellipsoid1.getCenter().z ** 2 * C1 -
      aa1 * bb1 * cc1;

    matrixA[0][0] = A1;
    matrixA[0][1] = D1;
    matrixA[0][2] = F1;
    matrixA[0][3] = G1;
    matrixA[1][0] = D1;
    matrixA[1][1] = B1;
    matrixA[1][2] = E1;
    matrixA[1][3] = H1;
    matrixA[2][0] = F1;
    matrixA[2][1] = E1;
    matrixA[2][2] = C1;
    matrixA[2][3] = I1;
    matrixA[3][0] = G1;
    matrixA[3][1] = H1;
    matrixA[3][2] = I1;
    matrixA[3][3] = J1;

    const A2 =
      cosBeta2 ** 2 * cosPhi2 ** 2 * bb2 * cc2 +
      cosBeta2 ** 2 * sinPhi2 ** 2 * aa2 * cc2 +
      sinBeta2 ** 2 * aa2 * bb2;
    const B2 =
      (sinBeta2 * sinAlpha2 * cosPhi2 + sinPhi2 * cosAlpha2) ** 2 * bb2 * cc2 +
      (sinPhi2 * sinBeta2 * sinAlpha2 + cosAlpha2 * cosPhi2) ** 2 * aa2 * cc2 +
      (sinAlpha2 * cosBeta2) ** 2 * aa2 * bb2;
    const C2 =
      (-sinBeta2 * cosAlpha2 * cosPhi2 + sinAlpha2 * sinPhi2) *
        (-sinBeta2 * sinAlpha2 * cosPhi2 + sinAlpha2 * sinPhi2) *
        bb2 *
        cc2 +
      (sinBeta2 * cosAlpha2 * sinPhi2 + cosPhi2 * sinAlpha2) *
        (sinBeta2 * cosAlpha2 * sinPhi2 + cosPhi2 * sinAlpha2) *
        aa2 *
        cc2 +
      cosBeta2 ** 2 * cosAlpha2 ** 2 * aa2 * bb2;
    const D2 =
      (sinBeta2 * sinAlpha2 * cosPhi2 * cosBeta2 * cosPhi2 +
        sinPhi2 * cosAlpha2 * cosBeta2 * cosPhi2) *
        bb2 *
        cc2 +
      (sinPhi2 * sinBeta2 * sinAlpha2 * cosBeta2 * sinPhi2 -
        cosAlpha2 * cosPhi2 * cosBeta2 * sinPhi2) *
        aa2 *
        cc2 +
      -sinAlpha2 * cosBeta2 * sinBeta2 * aa2 * bb2;
    const E2 =
      (-sinBeta2 * cosAlpha2 * cosPhi2 + sinAlpha2 * sinPhi2) *
        (sinBeta2 * sinAlpha2 * cosPhi2 + sinPhi2 * cosAlpha2) *
        bb2 *
        cc2 +
      (sinBeta2 * cosAlpha2 * sinPhi2 + cosPhi2 * sinAlpha2) *
        (-sinPhi2 * sinBeta2 * sinAlpha2 + cosAlpha2 * cosPhi2) *
        aa2 *
        cc2 +
      -cosBeta2 * cosAlpha2 * cosBeta2 * sinAlpha2 * aa2 * bb2;
    const F2 =
      (-sinBeta2 * cosAlpha2 * cosPhi2 * cosBeta2 * cosPhi2 +
        sinAlpha2 * sinPhi2 * cosBeta2 * cosPhi2) *
        bb2 *
        cc2 +
      (-sinBeta2 +
        cosAlpha2 * sinPhi2 * cosBeta2 * sinPhi2 -
        cosPhi2 * sinAlpha2 * cosBeta2 * sinPhi2) *
        aa2 *
        cc2 +
      cosBeta2 * cosAlpha2 * sinBeta2 * aa2 * bb2;

    const G2 =
      -ellipsoid2.getCenter().x * A2 -
      ellipsoid2.getCenter().y * D2 -
      ellipsoid2.getCenter().z * F2;
    const H2 =
      -ellipsoid2.getCenter().x * D2 -
      ellipsoid2.getCenter().y * B2 -
      ellipsoid2.getCenter().z * E2;
    const I2 =
      -ellipsoid2.getCenter().x * F2 -
      ellipsoid2.getCenter().y * E2 -
      ellipsoid2.getCenter().z * C2;
    const J2 =
      ellipsoid2.getCenter().x ** 2 * A2 +
      ellipsoid2.getCenter().x * ellipsoid2.getCenter().y * 2 * D2 +
      ellipsoid2.getCenter().x * ellipsoid2.getCenter().z * 2 * F2 +
      ellipsoid2.getCenter().y ** 2 * B2 +
      ellipsoid2.getCenter().y * ellipsoid2.getCenter().z * 2 * E2 +
      ellipsoid2.getCenter().z ** 2 * C2 -
      aa2 * bb2 * cc2;

    matrixB[0][0] = A2;
    matrixB[0][1] = D2;
    matrixB[0][2] = F2;
    matrixB[0][3] = G2;
    matrixB[1][0] = D2;
    matrixB[1][1] = B2;
    matrixB[1][2] = E2;
    matrixB[1][3] = H2;
    matrixB[2][0] = F2;
    matrixB[2][1] = E2;
    matrixB[2][2] = C2;
    matrixB[2][3] = I2;
    matrixB[3][0] = G2;
    matrixB[3][1] = H2;
    matrixB[3][2] = I2;
    matrixB[3][3] = J2;

    return this.calcCharacteristicPolynomial(
      matrixA,
      matrixB,
      A1,
      B1,
      C1,
      D1,
      E1,
      F1,
      G1,
      H1,
      I1,
      J1,
      A2,
      B2,
      C2,
      D2,
      E2,
      F2,
      G2,
      H2,
      I2,
      J2
    );
  }
  /**
   * Calculates the coefficients of the characteristic polynomial of two ellipsoids.
   * @param matrixA - Coefficients of the first ellipsoid's polynomial.
   * @param matrixB - Coefficients of the second ellipsoid's polynomial.
   * @param A1, B1, C1, D1, E1, F1, G1, H1, I1, J1 - Coefficients of the first ellipsoid.
   * @param A2, B2, C2, D2, E2, F2, G2, H2, I2, J2 - Coefficients of the second ellipsoid.
   * @returns The coefficients of the characteristic polynomial.
   */
  private static calcCharacteristicPolynomial(
    matrixA: number[][],
    matrixB: number[][],
    A1: number,
    B1: number,
    C1: number,
    D1: number,
    E1: number,
    F1: number,
    G1: number,
    H1: number,
    I1: number,
    J1: number,
    A2: number,
    B2: number,
    C2: number,
    D2: number,
    E2: number,
    F2: number,
    G2: number,
    H2: number,
    I2: number,
    J2: number
  ): number[] {
    let a4 = calDetMatrix4x4(matrixA);
    let a3 =
      (1 / 3) *
      (A1 * B1 * C1 * J2 +
        A1 * B1 * C2 * J1 +
        A1 * B2 * C1 * J1 +
        A2 * B1 * C1 * J1 +
        (A1 * E1 * I1 * H2 +
          A1 * E1 * I2 * H1 +
          A1 * E2 * I1 * H1 +
          A2 * E1 * I1 * H1) +
        (A1 * H1 * E1 * I2 +
          A1 * H1 * E2 * I1 +
          A1 * H2 * E1 * I1 +
          A2 * H1 * E1 * I1) -
        (A1 * H1 * C1 * H2 +
          A1 * H1 * C2 * H1 +
          A1 * H2 * C1 * H1 +
          A2 * H1 * C1 * H1) -
        (A1 * E1 * E1 * J2 +
          A1 * E1 * E2 * J1 +
          A1 * E2 * E1 * J1 +
          A2 * E1 * E1 * J1) -
        (A1 * B1 * I1 * I2 +
          A1 * B1 * I2 * I1 +
          A1 * B2 * I1 * I1 +
          A2 * B1 * I1 * I1) -
        (D1 * D1 * C1 * J2 +
          D1 * D1 * C2 * J1 +
          D1 * D2 * C1 * J1 +
          D2 * D1 * C1 * J1) -
        (F1 * D1 * I1 * H2 +
          F1 * D1 * I2 * H1 +
          F1 * D2 * I1 * H1 +
          F2 * D1 * I1 * H1) -
        (G1 * D1 * E1 * I2 +
          G1 * D1 * E2 * I1 +
          G1 * D2 * E1 * I1 +
          G2 * D1 * E1 * I1) +
        (G1 * D1 * C1 * H2 +
          G1 * D1 * C2 * H1 +
          G1 * D2 * C1 * H1 +
          G2 * D1 * C1 * H1) +
        (F1 * D1 * E1 * J2 +
          F1 * D1 * E2 * J1 +
          F1 * D2 * E1 * J1 +
          F2 * D1 * E1 * J1) +
        (D1 * D1 * I1 * I2 +
          D1 * D1 * I2 * I1 +
          D1 * D2 * I1 * I1 +
          D2 * D1 * I1 * I1) +
        (D1 * E1 * F1 * J2 +
          D1 * E1 * F2 * J1 +
          D1 * E2 * F1 * J1 +
          D2 * E1 * F1 * J1) +
        (F1 * H1 * F1 * H2 +
          F1 * H1 * F2 * H1 +
          F1 * H2 * F1 * H1 +
          F2 * H1 * F1 * H1) +
        (G1 * B1 * F1 * I2 +
          G1 * B1 * F2 * I1 +
          G1 * B2 * F1 * I1 +
          G2 * B1 * F1 * I1) -
        (G1 * E1 * F1 * H2 +
          G1 * E1 * F2 * H1 +
          G1 * E2 * F1 * H1 +
          G2 * E1 * F1 * H1) -
        (F1 * B1 * F1 * J2 +
          F1 * B1 * F2 * J1 +
          F1 * B2 * F1 * J1 +
          F2 * B1 * F1 * J1) -
        (D1 * H1 * F1 * I2 +
          D1 * H1 * F2 * I1 +
          D1 * H2 * F1 * I1 +
          D2 * H1 * F1 * I1) -
        (D1 * E1 * I1 * G2 +
          D1 * E1 * I2 * G1 +
          D1 * E2 * I1 * G1 +
          D2 * E1 * I1 * G1) -
        (F1 * H1 * E1 * G2 +
          F1 * H1 * E2 * G1 +
          F1 * H2 * E1 * G1 +
          F2 * H1 * E1 * G1) -
        (G1 * B1 * C1 * G2 +
          G1 * B1 * C2 * G1 +
          G1 * B2 * C1 * G1 +
          G2 * B1 * C1 * G1) +
        (G1 * E1 * E1 * G2 +
          G1 * E1 * E2 * G1 +
          G1 * E2 * E1 * G1 +
          G2 * E1 * E1 * G1) +
        (F1 * B1 * I1 * G2 +
          F1 * B1 * I2 * G1 +
          F1 * B2 * I1 * G1 +
          F2 * B1 * I1 * G1) +
        (D1 * H1 * C1 * G2 +
          D1 * H1 * C2 * G1 +
          D1 * H2 * C1 * G1 +
          D2 * H1 * C1 * G1));
    let a2 =
      (1 / 3) *
      (A1 * B1 * C2 * J2 +
        A1 * B2 * C1 * J2 +
        A1 * B2 * C2 * J1 +
        A2 * B1 * C1 * J2 +
        A2 * B1 * C2 * J1 +
        A2 * B2 * C1 * J1 +
        (A1 * E1 * I2 * H2 +
          A1 * E2 * I1 * H2 +
          A1 * E2 * I2 * H1 +
          A2 * E1 * I1 * H2 +
          A2 * E1 * I2 * H1 +
          A2 * E2 * I1 * H1) +
        (A1 * H1 * E2 * I2 +
          A1 * H2 * E1 * I2 +
          A1 * H2 * E2 * I1 +
          A2 * H1 * E1 * I2 +
          A2 * H1 * E2 * I1 +
          A2 * H2 * E1 * I1) -
        (A1 * H1 * C2 * H2 +
          A1 * H2 * C1 * H2 +
          A1 * H2 * C2 * H1 +
          A2 * H1 * C1 * H2 +
          A2 * H1 * C2 * H1 +
          A2 * H2 * C1 * H1) -
        (A1 * E1 * E2 * J2 +
          A1 * E2 * E1 * J2 +
          A1 * E2 * E2 * J1 +
          A2 * E1 * E1 * J2 +
          A2 * E1 * E2 * J1 +
          A2 * E2 * E1 * J1) -
        (A1 * B1 * I2 * I2 +
          A1 * B2 * I1 * I2 +
          A1 * B2 * I2 * I1 +
          A2 * B1 * I1 * I2 +
          A2 * B1 * I2 * I1 +
          A2 * B2 * I1 * I1) -
        (D1 * D1 * C2 * J2 +
          D1 * D2 * C1 * J2 +
          D1 * D2 * C2 * J1 +
          D2 * D1 * C1 * J2 +
          D2 * D1 * C2 * J1 +
          D2 * D2 * C1 * J1) -
        (F1 * D1 * I2 * H2 +
          F1 * D2 * I1 * H2 +
          F1 * D2 * I2 * H1 +
          F2 * D1 * I1 * H2 +
          F2 * D1 * I2 * H1 +
          F2 * D2 * I1 * H1) -
        (G1 * D1 * E2 * I2 +
          G1 * D2 * E1 * I2 +
          G1 * D2 * E2 * I1 +
          G2 * D1 * E1 * I2 +
          G2 * D1 * E2 * I1 +
          G2 * D2 * E1 * I1) +
        (G1 * D1 * C2 * H2 +
          G1 * D2 * C1 * H2 +
          G1 * D2 * C2 * H1 +
          G2 * D1 * C1 * H2 +
          G2 * D1 * C2 * H1 +
          G2 * D2 * C1 * H1) +
        (F1 * D1 * E2 * J2 +
          F1 * D2 * E1 * J2 +
          F1 * D2 * E2 * J1 +
          F2 * D1 * E1 * J2 +
          F2 * D1 * E2 * J1 +
          F2 * D2 * E1 * J1) +
        (D1 * D1 * I2 * I2 +
          D1 * D2 * I1 * I2 +
          D1 * D2 * I2 * I1 +
          D2 * D1 * I1 * I2 +
          D2 * D1 * I2 * I1 +
          D2 * D2 * I1 * I1) +
        (D1 * E1 * F2 * J2 +
          D1 * E2 * F1 * J2 +
          D1 * E2 * F2 * J1 +
          D2 * E1 * F1 * J2 +
          D2 * E1 * F2 * J1 +
          D2 * E2 * F1 * J1) +
        (F1 * H1 * F2 * H2 +
          F1 * H2 * F1 * H2 +
          F1 * H2 * F2 * H1 +
          F2 * H1 * F1 * H2 +
          F2 * H1 * F2 * H1 +
          F2 * H2 * F1 * H1) +
        (G1 * B1 * F2 * I2 +
          G1 * B2 * F1 * I2 +
          G1 * B2 * F2 * I1 +
          G2 * B1 * F1 * I2 +
          G2 * B1 * F2 * I1 +
          G2 * B2 * F1 * I1) -
        (G1 * E1 * F2 * H2 +
          G1 * E2 * F1 * H2 +
          G1 * E2 * F2 * H1 +
          G2 * E1 * F1 * H2 +
          G2 * E1 * F2 * H1 +
          G2 * E2 * F1 * H1) -
        (F1 * B1 * F2 * J2 +
          F1 * B2 * F1 * J2 +
          F1 * B2 * F2 * J1 +
          F2 * B1 * F1 * J2 +
          F2 * B1 * F2 * J1 +
          F2 * B2 * F1 * J1) -
        (D1 * H1 * F2 * I2 +
          D1 * H2 * F1 * I2 +
          D1 * H2 * F2 * I1 +
          D2 * H1 * F1 * I2 +
          D2 * H1 * F2 * I1 +
          D2 * H2 * F1 * I1) -
        (D1 * E1 * I2 * G2 +
          D1 * E2 * I1 * G2 +
          D1 * E2 * I2 * G1 +
          D2 * E1 * I1 * G2 +
          D2 * E1 * I2 * G1 +
          D2 * E2 * I1 * G1) -
        (F1 * H1 * E2 * G2 +
          F1 * H2 * E1 * G2 +
          F1 * H2 * E2 * G1 +
          F2 * H1 * E1 * G2 +
          F2 * H1 * E2 * G1 +
          F2 * H2 * E1 * G1) -
        (G1 * B1 * C2 * G2 +
          G1 * B2 * C1 * G2 +
          G1 * B2 * C2 * G1 +
          G2 * B1 * C1 * G2 +
          G2 * B1 * C2 * G1 +
          G2 * B2 * C1 * G1) +
        (G1 * E1 * E2 * G2 +
          G1 * E2 * E1 * G2 +
          G1 * E2 * E2 * G1 +
          G2 * E1 * E1 * G2 +
          G2 * E1 * E2 * G1 +
          G2 * E2 * E1 * G1) +
        (F1 * B1 * I2 * G2 +
          F1 * B2 * I1 * G2 +
          F1 * B2 * I2 * G1 +
          F2 * B1 * I1 * G2 +
          F2 * B1 * I2 * G1 +
          F2 * B2 * I1 * G1) +
        (D1 * H1 * C2 * G2 +
          D1 * H2 * C1 * G2 +
          D1 * H2 * C2 * G1 +
          D2 * H1 * C1 * G2 +
          D2 * H1 * C2 * G1 +
          D2 * H2 * C1 * G1));
    let a1 =
      (1 / 3) *
      (A1 * B2 * C2 * J2 +
        A2 * B1 * C2 * J2 +
        A2 * B2 * C1 * J2 +
        A2 * B2 * C2 * J1 +
        (A1 * E2 * I2 * H2 +
          A2 * E1 * I2 * H2 +
          A2 * E2 * I1 * H2 +
          A2 * E2 * I2 * H1) +
        (A1 * H2 * E2 * I2 +
          A2 * H1 * E2 * I2 +
          A2 * H2 * E1 * I2 +
          A2 * H2 * E2 * I1) -
        (A1 * H2 * C2 * H2 +
          A2 * H1 * C2 * H2 +
          A2 * H2 * C1 * H2 +
          A2 * H2 * C2 * H1) -
        (A1 * E2 * E2 * J2 +
          A2 * E1 * E2 * J2 +
          A2 * E2 * E1 * J2 +
          A2 * E2 * E2 * J1) -
        (A1 * B2 * I2 * I2 +
          A2 * B1 * I2 * I2 +
          A2 * B2 * I1 * I2 +
          A2 * B2 * I2 * I1) -
        (D1 * D2 * C2 * J2 +
          D2 * D1 * C2 * J2 +
          D2 * D2 * C1 * J2 +
          D2 * D2 * C2 * J1) -
        (F1 * D2 * I2 * H2 +
          F2 * D1 * I2 * H2 +
          F2 * D2 * I1 * H2 +
          F2 * D2 * I2 * H1) -
        (G1 * D2 * E2 * I2 +
          G2 * D1 * E2 * I2 +
          G2 * D2 * E1 * I2 +
          G2 * D2 * E2 * I1) +
        (G1 * D2 * C2 * H2 +
          G2 * D1 * C2 * H2 +
          G2 * D2 * C1 * H2 +
          G2 * D2 * C2 * H1) +
        (F1 * D2 * E2 * J2 +
          F2 * D1 * E2 * J2 +
          F2 * D2 * E1 * J2 +
          F2 * D2 * E2 * J1) +
        (D1 * D2 * I2 * I2 +
          D2 * D1 * I2 * I2 +
          D2 * D2 * I1 * I2 +
          D2 * D2 * I2 * I1) +
        (D1 * E2 * F2 * J2 +
          D2 * E1 * F2 * J2 +
          D2 * E2 * F1 * J2 +
          D2 * E2 * F2 * J1) +
        (F1 * H2 * F2 * H2 +
          F2 * H1 * F2 * H2 +
          F2 * H2 * F1 * H2 +
          F2 * H2 * F2 * H1) +
        (G1 * B2 * F2 * I2 +
          G2 * B1 * F2 * I2 +
          G2 * B2 * F1 * I2 +
          G2 * B2 * F2 * I1) -
        (G1 * E2 * F2 * H2 +
          G2 * E1 * F2 * H2 +
          G2 * E2 * F1 * H2 +
          G2 * E2 * F2 * H1) -
        (F1 * B2 * F2 * J2 +
          F2 * B1 * F2 * J2 +
          F2 * B2 * F1 * J2 +
          F2 * B2 * F2 * J1) -
        (D1 * H2 * F2 * I2 +
          D2 * H1 * F2 * I2 +
          D2 * H2 * F1 * I2 +
          D2 * H2 * F2 * I1) -
        (D1 * E2 * I2 * G2 +
          D2 * E1 * I2 * G2 +
          D2 * E2 * I1 * G2 +
          D2 * E2 * I2 * G1) -
        (F1 * H2 * E2 * G2 +
          F2 * H1 * E2 * G2 +
          F2 * H2 * E1 * G2 +
          F2 * H2 * E2 * G1) -
        (G1 * B2 * C2 * G2 +
          G2 * B1 * C2 * G2 +
          G2 * B2 * C1 * G2 +
          G2 * B2 * C2 * G1) +
        (G1 * E2 * E2 * G2 +
          G2 * E1 * E2 * G2 +
          G2 * E2 * E1 * G2 +
          G2 * E2 * E2 * G1) +
        (F1 * B2 * I2 * G2 +
          F2 * B1 * I2 * G2 +
          F2 * B2 * I1 * G2 +
          F2 * B2 * I2 * G1) +
        (D1 * H2 * C2 * G2 +
          D2 * H1 * C2 * G2 +
          D2 * H2 * C1 * G2 +
          D2 * H2 * C2 * G1));
    let a0 = calDetMatrix4x4(matrixB);

    return [a4, a3, a2, a1, a0];
  }
  /**
   * Checks if two ellipsoids intersect using the Caravantes method.
   * @param Ellipsoid1 - The first ellipsoid.
   * @param Ellipsoid2 - The second ellipsoid.
   * @returns True if the ellipsoids intersect, false otherwise.
   */
  public static Ellipsoid_Ellipsoid_Caravantes(
    Ellipsoid1: Ellipsoid,
    Ellipsoid2: Ellipsoid
  ): boolean {
    const characteristicPolynomialValues = this.characteristicPolynomialEllipsoid(
      Ellipsoid1,
      Ellipsoid2
    );

    const a4 = characteristicPolynomialValues[0];
    const a3 = characteristicPolynomialValues[1];
    const a2 = characteristicPolynomialValues[2];
    const a1 = characteristicPolynomialValues[3];
    const a0 = characteristicPolynomialValues[4];
    return !DescartesLawOfSignsFourthDegreePolynomial(a4, a3, a2, a1, a0);
  }
  /**
   * Calculates the coefficients of the characteristic polynomial of an ellipsoid and an elliptic paraboloid.
   * @param ellipsoid - The ellipsoid.
   * @param ellipticParaboloid - The elliptic paraboloid.
   * @returns The coefficients of the characteristic polynomial.
   */
  public static characteristicPolynomialEllipsoidEllipticParaboloid(
    ellipsoid: Ellipsoid,
    ellipticParaboloid: EllipticParaboloid
  ): number[] {
    const sinAlphaEllipsoid = Math.sin(
      ellipsoid.getRotation().x * (Math.PI / 180)
    );
    const sinBetaEllipsoid = Math.sin(
      ellipsoid.getRotation().y * (Math.PI / 180)
    );
    const sinPhiEllipsoid = Math.sin(
      ellipsoid.getRotation().z * (Math.PI / 180)
    );
    const cosAlphaEllipsoid = Math.cos(
      ellipsoid.getRotation().x * (Math.PI / 180)
    );
    const cosBetaEllipsoid = Math.cos(
      ellipsoid.getRotation().y * (Math.PI / 180)
    );
    const cosPhiEllipsoid = Math.cos(
      ellipsoid.getRotation().z * (Math.PI / 180)
    );

    const sinAlphaEllipticParaboloid = Math.sin(
      ellipticParaboloid.getRotation().x * (Math.PI / 180)
    );
    const sinBetaEllipticParaboloid = Math.sin(
      ellipticParaboloid.getRotation().y * (Math.PI / 180)
    );
    const sinPhiEllipticParaboloid = Math.sin(
      ellipticParaboloid.getRotation().z * (Math.PI / 180)
    );
    const cosAlphaEllipticParaboloid = Math.cos(
      ellipticParaboloid.getRotation().x * (Math.PI / 180)
    );
    const cosBetaEllipticParaboloid = Math.cos(
      ellipticParaboloid.getRotation().y * (Math.PI / 180)
    );
    const cosPhiEllipticParaboloid = Math.cos(
      ellipticParaboloid.getRotation().z * (Math.PI / 180)
    );

    const matrixA: number[][] = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
    const matrixB: number[][] = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    const aa1 = ellipsoid.xradius ** 2;
    const bb1 = ellipsoid.yradius ** 2;
    const cc1 = ellipsoid.zradius ** 2;

    const aa2 = ellipticParaboloid.xradius ** 2;
    const bb2 = ellipticParaboloid.yradius ** 2;

    const A1 =
      cosBetaEllipsoid ** 2 * cosPhiEllipsoid ** 2 * bb1 * cc1 +
      cosBetaEllipsoid ** 2 * sinPhiEllipsoid ** 2 * aa1 * cc1 +
      sinBetaEllipsoid ** 2 * aa1 * bb1;
    const B1 =
      (sinBetaEllipsoid * sinAlphaEllipsoid * cosPhiEllipsoid +
        sinPhiEllipsoid * cosAlphaEllipsoid) **
        2 *
        bb1 *
        cc1 +
      (sinPhiEllipsoid * sinBetaEllipsoid * sinAlphaEllipsoid +
        cosAlphaEllipsoid * cosPhiEllipsoid) **
        2 *
        aa1 *
        cc1 +
      (sinAlphaEllipsoid * cosBetaEllipsoid) ** 2 * aa1 * bb1;
    const C1 =
      (-sinBetaEllipsoid * cosAlphaEllipsoid * cosPhiEllipsoid +
        sinAlphaEllipsoid * sinPhiEllipsoid) **
        2 *
        bb1 *
        cc1 +
      (sinBetaEllipsoid * cosAlphaEllipsoid * sinPhiEllipsoid +
        cosPhiEllipsoid * sinAlphaEllipsoid) **
        2 *
        aa1 *
        cc1 +
      cosBetaEllipsoid ** 2 * cosAlphaEllipsoid ** 2 * aa1 * bb1;
    const D1 =
      (sinBetaEllipsoid *
        sinAlphaEllipsoid *
        cosPhiEllipsoid *
        cosBetaEllipsoid *
        cosPhiEllipsoid +
        sinPhiEllipsoid *
          cosAlphaEllipsoid *
          cosBetaEllipsoid *
          cosPhiEllipsoid) *
        bb1 *
        cc1 +
      (sinPhiEllipsoid *
        sinBetaEllipsoid *
        sinAlphaEllipsoid *
        cosBetaEllipsoid *
        sinPhiEllipsoid -
        cosAlphaEllipsoid *
          cosPhiEllipsoid *
          cosBetaEllipsoid *
          sinPhiEllipsoid) *
        aa1 *
        cc1 +
      -sinAlphaEllipsoid * cosBetaEllipsoid * sinBetaEllipsoid * aa1 * bb1;
    const E1 =
      (-sinBetaEllipsoid * cosAlphaEllipsoid * cosPhiEllipsoid +
        sinAlphaEllipsoid * sinPhiEllipsoid) *
        (sinBetaEllipsoid * sinAlphaEllipsoid * cosPhiEllipsoid +
          sinPhiEllipsoid * cosAlphaEllipsoid) *
        bb1 *
        cc1 +
      (sinBetaEllipsoid * cosAlphaEllipsoid * sinPhiEllipsoid +
        cosPhiEllipsoid * sinAlphaEllipsoid) *
        (-sinPhiEllipsoid * sinBetaEllipsoid * sinAlphaEllipsoid +
          cosAlphaEllipsoid * cosPhiEllipsoid) *
        aa1 *
        cc1 +
      -cosBetaEllipsoid *
        cosAlphaEllipsoid *
        cosBetaEllipsoid *
        sinAlphaEllipsoid *
        aa1 *
        bb1;
    const F1 =
      (-sinBetaEllipsoid *
        cosAlphaEllipsoid *
        cosPhiEllipsoid *
        cosBetaEllipsoid *
        cosPhiEllipsoid +
        sinAlphaEllipsoid *
          sinPhiEllipsoid *
          cosBetaEllipsoid *
          cosPhiEllipsoid) *
        bb1 *
        cc1 +
      (-sinBetaEllipsoid +
        cosAlphaEllipsoid *
          sinPhiEllipsoid *
          cosBetaEllipsoid *
          sinPhiEllipsoid -
        cosPhiEllipsoid *
          sinAlphaEllipsoid *
          cosBetaEllipsoid *
          sinPhiEllipsoid) *
        aa1 *
        cc1 +
      cosBetaEllipsoid * cosAlphaEllipsoid * sinBetaEllipsoid * aa1 * bb1;

    const G1 =
      -ellipsoid.getCenter().x * A1 -
      ellipsoid.getCenter().y * D1 -
      ellipsoid.getCenter().z * F1;
    const H1 =
      -ellipsoid.getCenter().x * D1 -
      ellipsoid.getCenter().y * B1 -
      ellipsoid.getCenter().z * E1;
    const I1 =
      -ellipsoid.getCenter().x * F1 -
      ellipsoid.getCenter().y * E1 -
      ellipsoid.getCenter().z * C1;
    const J1 =
      ellipsoid.getCenter().x ** 2 * A1 +
      ellipsoid.getCenter().x * ellipsoid.getCenter().y * 2 * D1 +
      ellipsoid.getCenter().x * ellipsoid.getCenter().z * 2 * F1 +
      ellipsoid.getCenter().y ** 2 * B1 +
      ellipsoid.getCenter().y * ellipsoid.getCenter().z * 2 * E1 +
      ellipsoid.getCenter().z ** 2 * C1 -
      aa1 * bb1 * cc1;

    matrixA[0][0] = A1;
    matrixA[0][1] = D1;
    matrixA[0][2] = F1;
    matrixA[0][3] = G1;
    matrixA[1][0] = D1;
    matrixA[1][1] = B1;
    matrixA[1][2] = E1;
    matrixA[1][3] = H1;
    matrixA[2][0] = F1;
    matrixA[2][1] = E1;
    matrixA[2][2] = C1;
    matrixA[2][3] = I1;
    matrixA[3][0] = G1;
    matrixA[3][1] = H1;
    matrixA[3][2] = I1;
    matrixA[3][3] = J1;

    const A2 =
      cosBetaEllipticParaboloid ** 2 * cosPhiEllipticParaboloid ** 2 * bb2 +
      cosBetaEllipticParaboloid ** 2 * sinPhiEllipticParaboloid ** 2 * aa2;
    const B2 =
      (sinBetaEllipticParaboloid *
        sinAlphaEllipticParaboloid *
        cosPhiEllipticParaboloid +
        sinPhiEllipticParaboloid * cosAlphaEllipticParaboloid) **
        2 *
        bb2 +
      (sinPhiEllipticParaboloid *
        sinBetaEllipticParaboloid *
        sinAlphaEllipticParaboloid +
        cosAlphaEllipticParaboloid * cosPhiEllipticParaboloid) **
        2 *
        aa2;
    const C2 = 0;
    const D2 = 0;
    const E2 = 0;
    const F2 = 0;

    const G2 = -ellipticParaboloid.getCenter().x * A2;
    const H2 = -ellipticParaboloid.getCenter().y * B2;
    const I2 = -1;
    const J2 =
      ellipticParaboloid.getCenter().x ** 2 * A2 +
      ellipticParaboloid.getCenter().y ** 2 * B2;

    matrixB[0][0] = A2;
    matrixB[0][1] = D2;
    matrixB[0][2] = F2;
    matrixB[0][3] = G2;
    matrixB[1][0] = D2;
    matrixB[1][1] = B2;
    matrixB[1][2] = E2;
    matrixB[1][3] = H2;
    matrixB[2][0] = F2;
    matrixB[2][1] = E2;
    matrixB[2][2] = C2;
    matrixB[2][3] = I2;
    matrixB[3][0] = G2;
    matrixB[3][1] = H2;
    matrixB[3][2] = I2;
    matrixB[3][3] = J2;

    return this.calcCharacteristicPolynomial(
      matrixA,
      matrixB,
      A1,
      B1,
      C1,
      D1,
      E1,
      F1,
      G1,
      H1,
      I1,
      J1,
      A2,
      B2,
      C2,
      D2,
      E2,
      F2,
      G2,
      H2,
      I2,
      J2
    );
  }

  /**
   * Checks if an ellipsoid and an elliptic paraboloid intersect using the Brozos method.
   * @param Ellipsoid - The ellipsoid.
   * @param ellipticParaboloid - The elliptic paraboloid.
   * @returns True if the ellipsoid and elliptic paraboloid intersect, false otherwise.
   */
  public static Ellipsoid_EllipticParaboloid_Brozos(
    Ellipsoid: Ellipsoid,
    ellipticParaboloid: EllipticParaboloid
  ): boolean {
    const characteristicPolynomialValues = this.characteristicPolynomialEllipsoidEllipticParaboloid(
      Ellipsoid,
      ellipticParaboloid
    );

    const a4 = characteristicPolynomialValues[0];
    const a3 = characteristicPolynomialValues[1];
    const a2 = characteristicPolynomialValues[2];
    const a1 = characteristicPolynomialValues[3];
    const a0 = characteristicPolynomialValues[4];
    let discriminant =
      256 * a0 * a0 * a0 * a4 * a4 * a4 -
      192 * a0 * a0 * a1 * a3 * a4 * a4 -
      128 * a0 * a0 * a2 * a2 * a4 * a4 +
      144 * a0 * a0 * a2 * a3 * a3 * a4 -
      27 * a0 * a0 * a3 * a3 * a3 * a3 +
      144 * a0 * a1 * a1 * a2 * a4 * a4 -
      6 * a0 * a1 * a1 * a3 * a3 * a4 -
      80 * a0 * a1 * a2 * a2 * a3 * a4 +
      18 * a0 * a1 * a2 * a3 * a3 * a3 +
      16 * a0 * a2 * a2 * a2 * a2 * a4 -
      4 * a0 * a2 * a2 * a2 * a3 * a3 -
      27 * a1 * a1 * a1 * a1 * a4 * a4 +
      18 * a1 * a1 * a1 * a2 * a3 * a4 -
      4 * a1 * a1 * a1 * a3 * a3 * a3 -
      4 * a1 * a1 * a2 * a2 * a2 * a4 +
      a1 * a1 * a2 * a2 * a3 * a3;

    if (discriminant < 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a hyperboloid and a plane intersect.
   * @param hyperboloid - The hyperboloid.
   * @param plane - The plane.
   * @returns True if the hyperboloid and plane intersect, false otherwise.
   */
  public static Hyperboloid_Plane(
    hyperboloid: Hyperboloid,
    plane: Plane
  ): boolean {
    const zRadius = hyperboloid.height / 2;

    const hyperboloidForward = hyperboloid.forward();
    const planeNormal = plane.getNormal();

    const dot = hyperboloidForward.dot(planeNormal);

    const center = hyperboloid.center;
    const planeCenter = plane.center;

    const top = center.clone().add(hyperboloidForward.clone().scale(zRadius));
    const bottom = center
      .clone()
      .subtract(hyperboloidForward.clone().scale(zRadius));

    if (Math.abs(dot - 1) < 1e-3 || Math.abs(dot + 1) < 1e-3) {
      // Aligned
      if (IsPlaneBetween(top, planeCenter, bottom)) {
        return false;
      } else {
        return true;
      }
    } else if (IsPlaneBetween(top, planeCenter, bottom)) {
      let angle = radToDeg(hyperboloidForward.angleTo(planeNormal));
      if (angle > 90) angle = 180 - angle;

      const distance = center.distanceTo(planeCenter);
      const threshold = distance >= 1 ? distance * zRadius : zRadius;

      return angle > 40 / threshold;
    } else {
      console.log("");
      return true;
    }
  }
}
