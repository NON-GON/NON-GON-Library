import { Cylinder } from "../../Geometries/3D/Cylinder";
import {
  calDetMatrix4x4,
  FindClosestPoints,
  FindIntersectionPoints,
  overlaps,
  SAT,
  Vector3,
} from "../Util/Utils";

export class ProximityQuery3D {
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

  public static Cylinder_Cylinder_Chittawadigi(
    cylinder1: Cylinder,
    cylinder2: Cylinder
  ): boolean {
    const xradius1 = cylinder1.xradius;
    const xradius2 = cylinder2.xradius;
    const yradius1 = cylinder1.yradius;
    const yradius2 = cylinder2.yradius;

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

    let b: number, theta: number, a: number, alpha: number, c: number;

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
    } else {
      b = closestPointAxisCylinder1.distanceTo(cylinder1Position);
      const endOfFirstRay = closestPointAxisCylinder1;
      a = commonNormal.magnitude();
      const endOfSecondRay = endOfFirstRay.add(commonNormal);
      alpha =
        Math.round(cylinder1.forward().angleTo(cylinder2.forward()) * 100) /
        100;

      if (alpha > 90) {
        alpha = 180 - alpha;
      }
      c = endOfSecondRay.distanceTo(cylinder2Position);
    }

    if (a < 0.00001) a = 0;
    if (b < 0.00001) b = 0;
    if (c < 0.00001) c = 0;
    if (Math.abs(alpha) < 0.00001) alpha = 0;

    const s1 = yradius1 / 2;
    const s2 = yradius2 / 2;
    const r1 = xradius1;
    const r2 = xradius2;

    if ((alpha === 0 || alpha === 180) && b === 0) {
      return s1 + s2 >= Math.abs(c) && r1 + r2 >= Math.abs(a);
    } else {
      if (Math.abs(b) <= s1 && Math.abs(c) <= s2 && Math.abs(a) <= r1 + r2) {
        return true;
      } else {
        let doZAxisIntersect = false;

        if (
          closestPointAxisCylinder1.distanceTo(closestPointAxisCylinder2) <=
          0.001
        ) {
          const directionA = zAxisCylinder1;
          const directionB = zAxisCylinder2;
          const crossProduct = directionA.cross(directionB);
          closestPointAxisCylinder2 = closestPointAxisCylinder2.add(
            crossProduct
          );
          commonNormal.set(
            closestPointAxisCylinder2.subtract(closestPointAxisCylinder1)
          );
          doZAxisIntersect = true;
        }

        const Circle1Center1 = cylinder1Position.add(zAxisCylinder1.scale(s1));
        const Circle2Center1 = cylinder1Position.subtract(
          zAxisCylinder1.scale(s1)
        );
        const Circle1Center2 = cylinder2Position.add(zAxisCylinder2.scale(s2));
        const Circle2Center2 = cylinder2Position.subtract(
          zAxisCylinder2.scale(s2)
        );

        const point1 = FindIntersectionPoints(
          cylinder1Position,
          commonNormal,
          Circle1Center1,
          zAxisCylinder1,
          r1
        );
        const point2 = FindIntersectionPoints(
          cylinder1Position,
          commonNormal,
          Circle2Center1,
          zAxisCylinder1,
          r1
        );
        const point3 = FindIntersectionPoints(
          cylinder2Position,
          commonNormal,
          Circle1Center2,
          zAxisCylinder2,
          r2
        );
        const point4 = FindIntersectionPoints(
          cylinder2Position,
          commonNormal,
          Circle2Center2,
          zAxisCylinder2,
          r2
        );

        if (!point1 || !point2 || !point3 || !point4) {
          return false;
        }

        const Q1Vertices = [];
        if (point1[1].distanceTo(point2[0]) < point1[1].distanceTo(point2[1])) {
          Q1Vertices.push(point1[0], point1[1], point2[0], point2[1]);
        } else {
          Q1Vertices.push(point1[0], point1[1], point2[1], point2[0]);
        }

        const Q2Vertices = [];
        if (point3[1].distanceTo(point4[0]) < point3[1].distanceTo(point4[1])) {
          if (doZAxisIntersect) {
            Q2Vertices.push(point3[0], point3[1], point4[0], point4[1]);
          } else {
            Q2Vertices.push(
              point3[0].subtract(commonNormal),
              point3[1].subtract(commonNormal),
              point4[0].subtract(commonNormal),
              point4[1].subtract(commonNormal)
            );
          }
        } else {
          if (doZAxisIntersect) {
            Q2Vertices.push(point3[0], point3[1], point4[1], point4[0]);
          } else {
            Q2Vertices.push(
              point3[0].subtract(commonNormal),
              point3[1].subtract(commonNormal),
              point4[1].subtract(commonNormal),
              point4[0].subtract(commonNormal)
            );
          }
        }

        if (
          !RectanglesIntersection.RectanglesIntersect(Q1Vertices, Q2Vertices)
        ) {
          return false;
        }

        return VertexEdgeTest.VertexEdgeTestFunction(
          s1,
          s2,
          r1,
          r2,
          a,
          b,
          c,
          alpha,
          cylinder1,
          cylinder2,
          commonNormal
        );
      }
    }
  }

  public static characteristicPolynomialEllipsoid(
    ellipsoid1: any,
    ellipsoid2: any
  ): number[] {
    const xradius1 = ellipsoid1.xradius;
    const yradius1 = ellipsoid1.yradius;
    const zradius1 = ellipsoid1.zradius;
    const xEllipsoid1 = ellipsoid1.getCenter().x;
    const yEllipsoid1 = ellipsoid1.getCenter().y;
    const zEllipsoid1 = ellipsoid1.getCenter().z;
    const alpha1 = ellipsoid1.getRotation().x * (Math.PI / 180);
    const beta1 = ellipsoid1.getRotation().y * (Math.PI / 180);
    const phi1 = ellipsoid1.getRotation().z * (Math.PI / 180);
    const sinAlpha1 = Math.sin(alpha1);
    const sinBeta1 = Math.sin(beta1);
    const sinPhi1 = Math.sin(phi1);
    const cosAlpha1 = Math.cos(alpha1);
    const cosBeta1 = Math.cos(beta1);
    const cosPhi1 = Math.cos(phi1);

    const xradius2 = ellipsoid2.xradius;
    const yradius2 = ellipsoid2.yradius;
    const zradius2 = ellipsoid2.zradius;
    const xEllipsoid2 = ellipsoid2.getCenter().x;
    const yEllipsoid2 = ellipsoid2.getCenter().y;
    const zEllipsoid2 = ellipsoid2.getCenter().z;
    const alpha2 = ellipsoid2.getRotation().x * (Math.PI / 180);
    const beta2 = ellipsoid2.getRotation().y * (Math.PI / 180);
    const phi2 = ellipsoid2.getRotation().z * (Math.PI / 180);
    const sinAlpha2 = Math.sin(alpha2);
    const sinBeta2 = Math.sin(beta2);
    const sinPhi2 = Math.sin(phi2);
    const cosAlpha2 = Math.cos(alpha2);
    const cosBeta2 = Math.cos(beta2);
    const cosPhi2 = Math.cos(phi2);

    const matrixA: number[][] = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
    const matrixB: number[][] = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    const aa1 = xradius1 * xradius1;
    const bb1 = yradius1 * yradius1;
    const cc1 = zradius1 * zradius1;

    const aa2 = xradius2 * xradius2;
    const bb2 = yradius2 * yradius2;
    const cc2 = zradius2 * zradius2;

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

    const G1 = -xEllipsoid1 * A1 - yEllipsoid1 * D1 - zEllipsoid1 * F1;
    const H1 = -xEllipsoid1 * D1 - yEllipsoid1 * B1 - zEllipsoid1 * E1;
    const I1 = -xEllipsoid1 * F1 - yEllipsoid1 * E1 - zEllipsoid1 * C1;
    const J1 =
      xEllipsoid1 ** 2 * A1 +
      xEllipsoid1 * yEllipsoid1 * 2 * D1 +
      xEllipsoid1 * zEllipsoid1 * 2 * F1 +
      yEllipsoid1 ** 2 * B1 +
      yEllipsoid1 * zEllipsoid1 * 2 * E1 +
      zEllipsoid1 ** 2 * C1 -
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

    const G2 = -xEllipsoid2 * A2 - yEllipsoid2 * D2 - zEllipsoid2 * F2;
    const H2 = -xEllipsoid2 * D2 - yEllipsoid2 * B2 - zEllipsoid2 * E2;
    const I2 = -xEllipsoid2 * F2 - yEllipsoid2 * E2 - zEllipsoid2 * C2;
    const J2 =
      xEllipsoid2 ** 2 * A2 +
      xEllipsoid2 * yEllipsoid2 * 2 * D2 +
      xEllipsoid2 * zEllipsoid2 * 2 * F2 +
      yEllipsoid2 ** 2 * B2 +
      yEllipsoid2 * zEllipsoid2 * 2 * E2 +
      zEllipsoid2 ** 2 * C2 -
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
}
