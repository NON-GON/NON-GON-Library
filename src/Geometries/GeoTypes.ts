export enum GeometryType2D {
  Ellipse = "Ellipse",
  Supperellipse = "Supperellipse",
  Line = "Line",
  Circle = "Circle",
  Convex_Line = "Convex_Line",
  Convex_Circle = "Convex_Circle",
  Point = "Point",
  Plane = "Plane",
}

export enum GeometryType3D {
  Sphere = "Sphere",
  Ellipsoid = "Ellipsoid",
  Cylinder = "Cylinder",
  Cone = "Cone",
  Cube = "Cube",
  Superellipsoid = "Superellipsoid",
}

export function isGeometryType2D(type: any): type is GeometryType2D {
  return Object.values(GeometryType2D).includes(type);
}

export function isGeometryType3D(type: any): type is GeometryType3D {
  return Object.values(GeometryType3D).includes(type);
}
