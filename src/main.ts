import * as THREE from "three";
import { GeometryManager } from "./Geometries/GeometryManager";
import { GeometryType2D, GeometryType3D } from "./Geometries/GeoTypes";
import { Vector3, Vector2 } from "./Calc/Util/Utils";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfffafa);
let geometryManager = new GeometryManager();

let angle = 0; // Add a variable to track the rotation angle
let hexBlue = 0xb0c4de;
let hexRed = 0xf08080;

initialization();
function initialization() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth - 15, window.innerHeight - 20);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 50;

  const svgRenderer = new SVGRenderer(); // Create an SVG renderer
  svgRenderer.setSize(window.innerWidth - 15, window.innerHeight - 20);
  document.body.appendChild(svgRenderer.domElement); // Append SVG renderer to the DOM

  scene.userData.renderer = renderer; // Store the renderer in scene's userData
  scene.userData.svgRenderer = svgRenderer; // Store the SVG renderer in scene's userData
  scene.userData.camera = camera; // Store the camera in scene's userData

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
      exportSceneToSVG(); // Call the export function when "P" is pressed
    }
  });

  animate(renderer, scene, camera);
}

function animate(renderer: any, scene: any, camera: any) {
  requestAnimationFrame(() => animate(renderer, scene, camera));

  // Update the camera's position to rotate around the scene
  angle += 0.01; // Adjust the speed of rotation
  camera.position.x = 50 * Math.cos(angle);
  camera.position.z = 50 * Math.sin(angle);
  camera.lookAt(0, 0, 0); // Ensure the camera always looks at the center of the scene

  renderer.render(scene, camera);
}

function exportSceneToSVG() {
  const svgRenderer = scene.userData.svgRenderer;
  const camera = scene.userData.camera; // Retrieve the camera from userData
  if (!svgRenderer || !camera) {
    console.error("SVGRenderer or Camera is not initialized.");
    return;
  }

  svgRenderer.render(scene, camera); // Render the scene to SVG using the correct camera
  const svgElement = svgRenderer.domElement;
  const svgData = new XMLSerializer().serializeToString(svgElement);

  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "scene.svg";
  link.click();

  URL.revokeObjectURL(url); // Clean up the URL object
}

function pointEllipseMDTest() {
  let params0 = {
    center: new Vector2(20, 0),
  };
  geometryManager.createGeometry(GeometryType2D.Point, "geo0", params0);

  let params1 = {
    center: new Vector2(0, 0),
    xradius: 30,
    yradius: 20,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType2D.Ellipse, "geo1", params1);

  scene.add(geometryManager.getGeometryMesh("geo1", hexBlue));
  scene.add(geometryManager.getGeometryMesh("geo0", hexRed));

  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function ellipseEllipseMDTest() {
  let params0 = {
    center: new Vector2(0, 2),
    xradius: 5,
    yradius: 2,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType2D.Ellipse, "geo0", params0);

  let params1 = {
    center: new Vector2(0, 0),
    xradius: 4,
    yradius: 2,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType2D.Ellipse, "geo1", params1);

  scene.add(geometryManager.getGeometryMesh("geo1", hexBlue));
  scene.add(geometryManager.getGeometryMesh("geo0", hexRed));

  let points = geometryManager.calculateMinimumDistance("geo1", "geo0");
  drawMinimumDistance(points[0], points[1]);
}

function superellipseLineMDTest() {
  let params0 = {
    center: new Vector2(0, 0),
    xradius: 5,
    yradius: 5,
    exponent: 2,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  let params1 = {
    start: new Vector3(0, 5, 0),
    end: new Vector3(0, 7, 0),
    rotation: new Vector3(0, 0, 0),
  };
  geometryManager.createGeometry(GeometryType2D.Supperellipse, "geo0", params0);
  geometryManager.createGeometry(GeometryType2D.Line, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1", hexBlue));
  scene.add(geometryManager.getGeometryMesh("geo0", hexRed));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");

  drawMinimumDistance(points[0], points[1]);
}

function pointEllipsoidMDTest() {
  let params0 = {
    center: new Vector2(0, 0),
  };
  geometryManager.createGeometry(GeometryType2D.Point, "geo0", params0);
  let params1 = {
    center: new Vector3(15, 0, 0),
    xradius: 10,
    yradius: 5,
    zradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 15,
  };
  geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1", hexBlue));
  scene.add(geometryManager.getGeometryMesh("geo0", hexRed));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function EllipsoidEllipsoidMDTest() {
  let geometryManager = new GeometryManager();
  let params0 = {
    center: new Vector3(-10, 15, 5),
    xradius: 4,
    yradius: 12,
    zradius: 8,
    rotation: new Vector3(0, 0, 0),
    segments: 15,
  };
  geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo0", params0);
  let params1 = {
    center: new Vector3(15, 6, 0),
    xradius: 7,
    yradius: 5,
    zradius: 3,
    rotation: new Vector3(0, 0, 0),
    segments: 15,
  };
  geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function SuperellipsoidPlaneMDTest() {
  let params0 = {
    center: new Vector3(0, 20, 0),
    xradius: 5,
    yradius: 5,
    zradius: 5,
    e1: 5,
    e2: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  let params1 = {
    center: new Vector2(0, 0),
    rotation: new Vector3(0, 0, 0),
    width: 10,
    height: 10,
    segments: 100,
  };
  geometryManager.createGeometry(
    GeometryType3D.Superellipsoid,
    "geo0",
    params0
  );
  geometryManager.createGeometry(GeometryType2D.Plane, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function ellipseEllipsePQTest() {
  const paramsEllipse0 = {
    center: new Vector2(0, 1.5),
    xradius: 5,
    yradius: 2,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  const paramsEllipse1 = {
    center: new Vector2(0, 0),
    xradius: 4,
    yradius: 2,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(
    GeometryType2D.Ellipse,
    "geo0",
    paramsEllipse0
  );
  geometryManager.createGeometry(
    GeometryType2D.Ellipse,
    "geo1",
    paramsEllipse1
  );
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const resultAlberich = geometryManager.calculateProximityQuery(
    "geo0",
    "geo1",
    "Alberich"
  );
  const resultCaravantes = geometryManager.calculateProximityQuery(
    "geo0",
    "geo1",
    "Caravantes"
  );
  console.log("Alberich Result:", resultAlberich);
  console.log("Caravantes Result:", resultCaravantes);
}

function cylinderCylinderPQTest() {
  const paramsCylinder0 = {
    center: new Vector3(0, 5, 0),
    xradius: 5,
    yradius: 5,
    height: 10,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  const paramsCylinder1 = {
    center: new Vector3(0, 0, 0),
    xradius: 5,
    yradius: 5,
    height: 10,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(
    GeometryType3D.Cylinder,
    "geo0",
    paramsCylinder0
  );
  geometryManager.createGeometry(
    GeometryType3D.Cylinder,
    "geo1",
    paramsCylinder1
  );
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const resultChittawadigi = geometryManager.calculateProximityQuery(
    "geo0",
    "geo1",
    "Chittawadigi"
  );
  console.log("Chittawadigi Result:", resultChittawadigi);
}

function ellipsoidEllipsoidPQTest() {
  const paramsEllipsoid0 = {
    center: new Vector3(0, 5, 0),
    xradius: 5,
    yradius: 5,
    zradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 20,
  };
  const paramsEllipsoid1 = {
    center: new Vector3(0, 0, 0),
    xradius: 5,
    yradius: 5,
    zradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 20,
  };
  geometryManager.createGeometry(
    GeometryType3D.Ellipsoid,
    "geo0",
    paramsEllipsoid0
  );
  geometryManager.createGeometry(
    GeometryType3D.Ellipsoid,
    "geo1",
    paramsEllipsoid1
  );
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const resultCaravantes = geometryManager.calculateProximityQuery(
    "geo0",
    "geo1",
    "Caravantes"
  );
  console.log("Caravantes Result:", resultCaravantes);
}

function ellipsoidEllipticParaboloidPQTest() {
  const paramsEllipsoid = {
    center: new Vector3(0, 5, 0),
    xradius: 5,
    yradius: 5,
    zradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 15,
  };
  const paramsEllipticParaboloid = {
    center: new Vector3(0, 0, 0),
    xradius: 5,
    yradius: 5,
    height: 10,
    rotation: new Vector3(0, 0, 0),
    segments: 15,
  };
  geometryManager.createGeometry(
    GeometryType3D.Ellipsoid,
    "geo0",
    paramsEllipsoid
  );
  geometryManager.createGeometry(
    GeometryType3D.EllipticParaboloid,
    "geo1",
    paramsEllipticParaboloid
  );
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const resultCaravantes = geometryManager.calculateProximityQuery(
    "geo0",
    "geo1"
  );
  console.log("Caravantes Result:", resultCaravantes);
}

function almostConvexGeometryPlaneMDTest() {
  const paramsConvex = {
    center: new Vector3(0, 10, 0),
    rotation: new Vector3(0, 0, 0),
    segments: 30,
  };
  const paramsPlane = {
    center: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    width: 10,
    height: 10,
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType3D.Convex, "geo0", paramsConvex);
  geometryManager.createGeometry(GeometryType2D.Plane, "geo1", paramsPlane);
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const points = geometryManager.calculateMinimumDistance("geo1", "geo0");
  drawMinimumDistance(points[0], points[1]);
}

function convexLineLineMDTest() {
  const paramsConvexLine = {
    center: new Vector3(40, 0, 0),
    rotation: new Vector3(0, 0, 0),
    segments: 200,
  };
  const paramsLine = {
    start: new Vector3(-10, 0, 0),
    end: new Vector3(100, 0, 0),
    rotation: new Vector3(0, 0, 0),
  };

  geometryManager.createGeometry(
    GeometryType2D.ConvexLine,
    "geo0",
    paramsConvexLine
  );

  geometryManager.createGeometry(GeometryType2D.Line, "geo1", paramsLine);
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const points = geometryManager.calculateMinimumDistance("geo1", "geo0");
  drawMinimumDistance(points[0], points[1]);
}

function convexCircleCircleMD() {
  const paramsConvexCircle = {
    center: new Vector3(-15, 10, 0),
    radius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  const paramsCircle = {
    center: new Vector3(0, 0, 0),
    radius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(
    GeometryType2D.ConvexCircle,
    "geo0",
    paramsConvexCircle
  );
  geometryManager.createGeometry(GeometryType2D.Circle, "geo1", paramsCircle);
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function hyperboloidPlanePQTest() {
  const paramsHyperboloid = {
    center: new Vector3(4, 6, 0),
    xradius: 4,
    yradius: 2,
    zradius: 2,
    zfactor: -5,
    height: 10,
    rotation: new Vector3(90, 0, 0),
    segments: 20,
  };
  const paramsPlane = {
    center: new Vector2(4, 6),
    rotation: new Vector3(90, 0, 0),
    width: 20,
    height: 20,
    segments: 100,
  };
  geometryManager.createGeometry(
    GeometryType3D.Hyperboloid,
    "geo0",
    paramsHyperboloid
  );
  geometryManager.createGeometry(GeometryType2D.Plane, "geo1", paramsPlane);
  scene.add(geometryManager.getGeometryMesh("geo1", hexRed));
  scene.add(geometryManager.getGeometryMesh("geo0", hexBlue));
  const answer = geometryManager.calculateProximityQuery("geo1", "geo0");
  console.log("Proximity Query Result:", answer);
}

function drawMinimumDistance(
  point1: Vector3 | Vector2,
  point2: Vector3 | Vector2
) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x080808 });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(
      parseFloat(point1.x.toFixed(3)),
      parseFloat(point1.y.toFixed(3)),
      "z" in point1 ? parseFloat((point1 as Vector3).z.toFixed(3)) : 0
    ),
    new THREE.Vector3(
      parseFloat(point2.x.toFixed(3)),
      parseFloat(point2.y.toFixed(3)),
      "z" in point2 ? parseFloat((point2 as Vector3).z.toFixed(3)) : 0
    ),
  ]);

  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}

pointEllipseMDTest();
