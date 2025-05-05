export enum GeometryType2D {
  Circle = "Circle",
  ConvexCircle = "ConvexCircle",
  ConvexLine = "ConvexLine",
  Ellipse = "Ellipse",
  Line = "Line",
  Plane = "Plane",
  Point = "Point",
  Supperellipse = "Supperellipse",
}

export enum GeometryType3D {
  Convex = "Convex",
  Cylinder = "Cylinder",
  Ellipsoid = "Ellipsoid",
  EllipticParaboloid = "EllipticParaboloid",
  Hyperboloid = "Hyperboloid",
  Sphere = "Sphere",
  Superellipsoid = "Superellipsoid",
}

export function isGeometryType2D(type: any): type is GeometryType2D {
  return Object.values(GeometryType2D).includes(type);
}

export function isGeometryType3D(type: any): type is GeometryType3D {
  return Object.values(GeometryType3D).includes(type);
}
