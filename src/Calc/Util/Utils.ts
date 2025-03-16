export function EuclideanDistance(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

export function quarticRoots(a: number, b: number, c: number, d: number, e: number): number[] {
  //TODO: Implement quarticRoots
  console.warn("quarticRoots solver is not implemented yet!");
  return [];
}