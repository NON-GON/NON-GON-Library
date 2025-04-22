import * as THREE from "three";
import { GeometryManager } from "./Geometries/GeometryManager";
import { Vector2 } from "three";
import { GeometryType2D, GeometryType3D } from "./Geometries/GeoTypes";
import { Vector3 } from "./Calc/Util/Utils";
const scene = new THREE.Scene();
let geo1: any | undefined;
let geo2: any | undefined;
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



// Point Ellipse Test
GeometryManager





function drawMinimumDistance(point1: Vector3, point2: Vector3) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000ff0 });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(point1.x, point1.y, point1.z),
    new THREE.Vector3(point2.x, point2.y, point2.z),
  ]);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}
