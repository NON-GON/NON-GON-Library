import * as THREE from "three";
export class Ellipse {
  public static create(
    xradius: number,
    yradius: number,
    angle: number,
    segments: number
  ): [number, number] {
    let curve = new THREE.EllipseCurve(
      0,
      0,
      xradius,
      yradius,
      0,
      angle,
      false,
      0
    );
    let points = curve.getPoints(segments);
    console.log(points);
    return points;
  }
}
