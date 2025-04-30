import * as THREE from "three";
import { GeometryManager } from "./Geometries/GeometryManager";
import { GeometryType2D, GeometryType3D } from "./Geometries/GeoTypes";
import { Vector3, Vector2 } from "./Calc/Util/Utils";

const scene = new THREE.Scene();
let geometryManager = new GeometryManager();

let angle = 0; // Add a variable to track the rotation angle

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

function pointEllipseTest() {
  let params0 = {
    center: new Vector2(20, 0),
  };
  geometryManager.createGeometry(GeometryType2D.Point, "geo0", params0);

  let params1 = {
    center: new Vector2(0, 0),
    xradius: 10,
    yradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType2D.Ellipse, "geo1", params1);

  scene.add(geometryManager.getGeometryMesh("geo1"));
  scene.add(geometryManager.getGeometryMesh("geo0"));

  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function ellipseEllipseTest() {
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

  scene.add(geometryManager.getGeometryMesh("geo1"));
  scene.add(geometryManager.getGeometryMesh("geo0"));

  let points = geometryManager.calculateMinimumDistance("geo1", "geo0");
  drawMinimumDistance(points[0], points[1]);
}

function superellipseLineTest() {
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
  scene.add(geometryManager.getGeometryMesh("geo1"));
  scene.add(geometryManager.getGeometryMesh("geo0"));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");

  drawMinimumDistance(points[0], points[1]);
}

function pointEllipsoidTest() {
  let params0 = {
    center: new Vector2(0, 0),
  };
  geometryManager.createGeometry(GeometryType2D.Point, "geo0", params0);
  let params1 = {
    center: new Vector3(15, 0, 0),
    xradius: 10,
    yradius: 5,
    zradius: 5,
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1"));
  scene.add(geometryManager.getGeometryMesh("geo0"));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function EllipsoidEllipsoidTest() {
  let params0 = {
    center: new Vector3(-10, 0, 0),
    xradius: 10,
    yradius: 5,
    zradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo0", params0);
  let params1 = {
    center: new Vector3(15, 0, 0),
    xradius: 10,
    yradius: 5,
    zradius: 5,
    rotation: new Vector3(0, 0, 0),
    segments: 100,
  };
  geometryManager.createGeometry(GeometryType3D.Ellipsoid, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1"));
  scene.add(geometryManager.getGeometryMesh("geo0"));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function SuperellipsoidPlaneTest() {
  let params0 = {
    center: new Vector3(0, 20, 0),
    xradius: 5,
    yradius: 5,
    zradius: 5,
    segments: 100,
    e1: 5,
    e2: 5,
  };
  let params1 = {
    center: new Vector2(0, 0),
    segments: 100,
    rotation: 0,
    width: 10,
    height: 10,
  };
  geometryManager.createGeometry(
    GeometryType3D.Superellipsoid,
    "geo0",
    params0
  );
  geometryManager.createGeometry(GeometryType2D.Plane, "geo1", params1);
  scene.add(geometryManager.getGeometryMesh("geo1"));
  scene.add(geometryManager.getGeometryMesh("geo0"));
  let points = geometryManager.calculateMinimumDistance("geo0", "geo1");
  drawMinimumDistance(points[0], points[1]);
}

function drawMinimumDistance(
  point1: Vector3 | Vector2,
  point2: Vector3 | Vector2
) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
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

EllipsoidEllipsoidTest();
