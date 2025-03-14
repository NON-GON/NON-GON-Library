export class Superellipse {
  public static create(
    xradius: number,
    yradius: number,
    exponent: number,
    segments: number
  ): [number, number][] {
    let points: [number, number][] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2; 
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      
      const x = xradius * Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / exponent);
      const y = yradius * Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / exponent);

      points.push([x, y]);
    }

    return points;
  }
}
