import { overlaps, SAT, Vector3 } from "../Util/Utils";

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
}
