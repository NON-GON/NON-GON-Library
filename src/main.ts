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



const paramsGeo3 = {
  center: new Vector3(10, 10, 0),

  
  segments: 64,
};
const paramesGeo4 = {
  center: new Vector3(0, 0, 0),
  xradius: 4,
  yradius: 2,
  zradius: 2,
  segments: 64,
};

let geo3 = geometryManager.createGeometry(
  GeometryType3D.Ellipsoid,
  "geo3",
  paramsGeo3
);
let geo4 = geometryManager.createGeometry(
  GeometryType3D.Ellipsoid,
  "geo4",
  paramesGeo4
);

scene.add(geo3);
scene.add(geo4);

calculate3DMinimumDistance();
function calculate3DMinimumDistance() {
  const geo3 = geometryManager.getGeometry("geo3");
  const geo4 = geometryManager.getGeometry("geo4");
  if (geo3 && geo4) {
    const distance = geometryManager.calculateMinimumDistance("geo3", "geo4");
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000ff0 });
    if (distance[0] instanceof Vector3 && distance[1] instanceof Vector3) {
      console.log(distance[0], distance[1]);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(distance[0].x, distance[0].y, distance[0].z),
        new THREE.Vector3(distance[1].x, distance[1].y, distance[1].z),
      ]);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
  }
}
