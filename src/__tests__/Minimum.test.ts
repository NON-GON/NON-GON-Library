// src/__tests__/math.test.ts
import { Vector2 } from "../Calc/Util/Utils";
import { GeometryManager } from "../Geometries/GeometryManager";

enum _2Dgeo {
  Ellipse,
  Supperellipse,
  Line,
  Circle,
  Convex_Line,
  Convex_Circle,
  Point,
}

test("Minimum Distance", () => {
  const geometryManager = GeometryManager.getInstance("2D");
  const ellipseParams1 = {
    center: new Vector2(0, 0),
    xradius: 4,
    yradius: 10,
    segments: 64,
  };
  const ellipseParams2 = {
    center: new Vector2(10, 0),
    xradius: 4,
    yradius: 10,
    segments: 64,
  };
  geometryManager.createGeometry(_2Dgeo.Ellipse, "geo1", ellipseParams1);
  geometryManager.createGeometry(_2Dgeo.Ellipse, "geo2", ellipseParams2);

  expect(
    geometryManager.calculateMinimumDistance(_2Dgeo.Ellipse, "geo1", "geo2")
  ).toStrictEqual([new Vector2(4, 0), new Vector2(14, 0)]);
});
