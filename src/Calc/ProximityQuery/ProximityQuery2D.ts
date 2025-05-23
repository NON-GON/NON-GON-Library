import { Ellipse } from "../../Geometries/2D/Ellipse";
import {
  calDetMatrix3x3,
  descartesLawOfSignsThirdDegreePolynomial,
  overlaps,
  SAT,
  Vector3,
  Vector2,
} from "../Util/Utils";

export class ProximityQuery2D {
  /**
   * Checks if two axis-aligned bounding boxes (AABBs) overlap in 2D.
   *
   * @param positionAABB1 - Top-left position of the first AABB.
   * @param positionAABB2 - Top-left position of the second AABB.
   * @param length1 - Width of the first AABB.
   * @param length2 - Width of the second AABB.
   * @param height1 - Height of the first AABB.
   * @param height2 - Height of the second AABB.
   * @returns True if the AABBs intersect, false otherwise.
   */
  public static AABB_AABB2D(
    positionAABB1: Vector2,
    positionAABB2: Vector2,
    length1: number,
    length2: number,
    height1: number,
    height2: number
  ): boolean {
    const x1 = positionAABB1.x;
    const y1 = positionAABB1.y;
    
    const x2 = positionAABB2.x;
    const y2 = positionAABB2.y;

    return (
      x1 < x2 + length2 &&
      x1 + length1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    );
  }
  /**
   * Checks if two oriented bounding boxes (OBBs) intersect using the Separating Axis Theorem (SAT).
   *
   * @param normals1 - Normals (axes) of the first OBB.
   * @param normals2 - Normals (axes) of the second OBB.
   * @param corners1 - Corner points of the first OBB.
   * @param corners2 - Corner points of the second OBB.
   * @returns True if the OBBs intersect, false otherwise.
   */
  public static OBB_OBB2D(
    normals1: Vector3[],
    normals2: Vector3[],
    corners1: Vector3[],
    corners2: Vector3[]
  ): boolean {
    for (let i = 0; i < normals1.length; i++) {
      let shape1Min = 0,
        shape1Max = 0,
        shape2Min = 0,
        shape2Max = 0;
      const shape1 = SAT(normals1[i], corners1, shape1Min, shape1Max);
      const shape2 = SAT(normals1[i], corners2, shape2Min, shape2Max);
      if (!overlaps(shape1[0], shape1[1], shape2[0], shape2[1])) {
        return false;
      }
    }

    for (let i = 0; i < normals2.length; i++) {
      let shape1Min = 0,
        shape1Max = 0,
        shape2Min = 0,
        shape2Max = 0;
      const shape1 = SAT(normals2[i], corners1, shape1Min, shape1Max);
      const shape2 = SAT(normals2[i], corners2, shape2Min, shape2Max);
      if (overlaps(shape1[0], shape1[1], shape2[0], shape2[1])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Computes the characteristic polynomial representing two ellipses for collision testing.
   *
   * @param Ellipse1 - The first ellipse.
   * @param Ellipse2 - The second ellipse.
   * @returns Array of polynomial coefficients [a3, a2, a1, a0].
   */
  public static characteristicPolynomial(
    Ellipse1: Ellipse,
    Ellipse2: Ellipse
  ): number[] {
    //const xradius1 = Ellipse1.xradius;
    //const yradius1 = Ellipse1.yradius;
    //const xEllipse1 = Ellipse1.getCenter().x;
    //const yEllipse1 = Ellipse1.getCenter().y;
    //
    //const xradius2 = Ellipse2.xradius;
    //const yradius2 = Ellipse2.yradius;
    //const xEllipse2 = Ellipse2.getCenter().x;
    //const yEllipse2 = Ellipse2.getCenter().y;

    const matrixA: number[][] = Array.from({ length: 3 }, () =>
      Array(3).fill(0)
    );
    const matrixB: number[][] = Array.from({ length: 3 }, () =>
      Array(3).fill(0)
    );

    // Ellipse 1
    const theta1 = Ellipse1.getRotation().z * (Math.PI / 180);
    const sinTheta1 = Math.sin(theta1);
    const cosTheta1 = Math.cos(theta1);
    const aaEllipse1 = Ellipse1.xradius ** 2;
    const bbEllipse1 = Ellipse1.yradius ** 2;
    const A1 =
      aaEllipse1 * sinTheta1 * sinTheta1 + bbEllipse1 * cosTheta1 * cosTheta1;
    const B1 = (bbEllipse1 - aaEllipse1) * sinTheta1 * cosTheta1;
    const C1 =
      aaEllipse1 * cosTheta1 * cosTheta1 + bbEllipse1 * sinTheta1 * sinTheta1;
    const D1 = -A1 * Ellipse1.getCenter().x - B1 * Ellipse1.getCenter().y;
    const E1 = -B1 * Ellipse1.getCenter().x - C1 * Ellipse1.getCenter().y;
    const F1 =
      A1 * Ellipse1.getCenter().x ** 2 +
      2 * B1 * Ellipse1.getCenter().x * Ellipse1.getCenter().y +
      C1 * Ellipse1.getCenter().y * Ellipse1.getCenter().y -
      aaEllipse1 * bbEllipse1;
    matrixA[0][0] = A1;
    matrixA[0][1] = B1;
    matrixA[0][2] = D1;
    matrixA[1][0] = B1;
    matrixA[1][1] = C1;
    matrixA[1][2] = E1;
    matrixA[2][0] = D1;
    matrixA[2][1] = E1;
    matrixA[2][2] = F1;

    // Ellipse 2
    const theta2 = Ellipse2.getRotation().z * (Math.PI / 180);
    const sinTheta2 = Math.sin(theta2);
    const cosTheta2 = Math.cos(theta2);
    const aaEllipse2 = Ellipse2.xradius * Ellipse2.xradius;
    const bbEllipse2 = Ellipse2.yradius * Ellipse2.yradius;
    const A2 =
      aaEllipse2 * sinTheta2 * sinTheta2 + bbEllipse2 * cosTheta2 * cosTheta2;
    const B2 = (bbEllipse2 - aaEllipse2) * sinTheta2 * cosTheta2;
    const C2 =
      aaEllipse2 * cosTheta2 * cosTheta2 + bbEllipse2 * sinTheta2 * sinTheta2;
    const D2 = -A2 * Ellipse2.xradius - B2 * Ellipse2.yradius;
    const E2 = -B2 * Ellipse2.xradius - C2 * Ellipse2.yradius;
    const F2 =
      A2 * Ellipse2.getCenter().x ** 2 +
      2 * B2 * Ellipse1.getCenter().x * Ellipse1.getCenter().y +
      C2 * Ellipse1.getCenter().y ** 2 -
      aaEllipse2 * bbEllipse2;
    matrixB[0][0] = A2;
    matrixB[0][1] = B2;
    matrixB[0][2] = D2;
    matrixB[1][0] = B2;
    matrixB[1][1] = C2;
    matrixB[1][2] = E2;
    matrixB[2][0] = D2;
    matrixB[2][1] = E2;
    matrixB[2][2] = F2;

    const a3 = calDetMatrix3x3(matrixA);
    const a2 =
      (1 / 3) *
      (A1 * C1 * F2 +
        A1 * C2 * F1 +
        A2 * C1 * F1 +
        B1 * E1 * D2 +
        B1 * E2 * D1 +
        B2 * E1 * D1 +
        D1 * B1 * E2 +
        D1 * B2 * E1 +
        D2 * B1 * E1 -
        D1 * C1 * D2 -
        D1 * C2 * D1 -
        D2 * C1 * D1 -
        B1 * B1 * F2 -
        B1 * B2 * F1 -
        B2 * B1 * F1 -
        A1 * E1 * E2 -
        A1 * E2 * E1 -
        A2 * E1 * E1);
    const a1 =
      (1 / 3) *
      (A1 * C2 * F2 +
        A2 * C1 * F2 +
        A2 * C2 * F1 +
        B1 * E2 * D2 +
        B2 * E1 * D2 +
        B2 * E2 * D1 +
        D1 * B2 * E2 +
        D2 * B1 * E2 +
        D2 * B2 * E1 -
        D1 * C2 * D2 -
        D2 * C1 * D2 -
        D2 * C2 * D1 -
        B1 * B2 * F2 -
        B2 * B1 * F2 -
        B2 * B2 * F1 -
        A1 * E2 * E2 -
        A2 * E1 * E2 -
        A2 * E2 * E1);
    const a0 = calDetMatrix3x3(matrixB);

    return [a3, a2, a1, a0];
  }

  /**
   * Determines if two ellipses intersect using the Caravantes method based on the sign of a specific scalar.
   *
   * @param Ellipse1 - The first ellipse.
   * @param Ellipse2 - The second ellipse.
   * @returns True if the ellipses intersect, false otherwise.
   */
  public static Ellipse_Ellipse_Caravantes(
    Ellipse1: Ellipse,
    Ellipse2: Ellipse
  ): boolean {
    const characteristicPolynomialValues = ProximityQuery2D.characteristicPolynomial(
      Ellipse1,
      Ellipse2
    );

    const a3 = characteristicPolynomialValues[0];
    const a2 = characteristicPolynomialValues[1];
    const a1 = characteristicPolynomialValues[2];
    const a0 = characteristicPolynomialValues[3];

    const s0 =
      a3 *
      (27 * a0 * a0 * a3 * a3 -
        18 * a0 * a1 * a2 * a3 +
        4 * a0 * a2 * a2 * a2 +
        4 * a1 * a1 * a1 * a3 -
        a1 * a1 * a2 * a2);

    if (descartesLawOfSignsThirdDegreePolynomial(a3, a2, a1, a0)) {
      return s0 < 0;
    } else {
      return true;
    }
  }
  /**
   * Determines if two ellipses intersect using the Alberich method based on polynomial discriminants.
   *
   * @param Ellipse1 - The first ellipse.
   * @param Ellipse2 - The second ellipse.
   * @returns True if the ellipses intersect, false otherwise.
   */
  public static Ellipse_Ellipse_Alberich(
    Ellipse1: Ellipse,
    Ellipse2: Ellipse
  ): boolean {
    const characteristicPolynomialValues = ProximityQuery2D.characteristicPolynomial(
      Ellipse1,
      Ellipse2
    );

    const l3 = characteristicPolynomialValues[0];
    const l2 = characteristicPolynomialValues[1];
    const l1 = characteristicPolynomialValues[2];
    const l0 = characteristicPolynomialValues[3];

    const delta1 = l3 * l1 - l2 * l2;
    const delta2 = l3 * l0 - l2 * l1;
    const delta3 = l2 * l0 - l1 * l1;

    const discriminant_P = 4 * delta1 * delta3 - delta2 * delta2;

    if (discriminant_P >= 0) {
      if (l1 > 0 || l2 > 0) {
        if (discriminant_P > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
