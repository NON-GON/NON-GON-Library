import * as THREE from "three";
import { GeometryCreator } from "./Geometries/GeometryCreator";

const scene = new THREE.Scene();

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
  renderer.render(scene, camera);
}

const shapeSelect = document.getElementById("geo1_shapeSelect");
shapeSelect?.addEventListener("change", function () {
  const shape = (this as HTMLSelectElement).value;
  const inputGroups: { [key: string]: HTMLElement | null } = {
    circle: document.getElementById("circleInputs"),
    ellipse: document.getElementById("ellipseInputs"),
  };
  for (const key in inputGroups) {
    if (inputGroups[key]) {
      inputGroups[key]!.style.display = key === shape ? "block" : "none";
    }
  }
});

document.getElementById("geo1_radius")?.addEventListener("change", function () {
  const radius = (this as HTMLInputElement).value;
  const geometryCreator = new GeometryCreator(parseFloat(radius), -20, 0);
  scene.remove(scene.children[0]);
  scene.add(geometryCreator.create2DGeometry());
});

document
  .getElementById("geo1_radiusY")
  ?.addEventListener("change", function () {
    const yradius = (this as HTMLInputElement).value;
    const xradius = (document.getElementById(
      "geo1_radiusX"
    ) as HTMLInputElement).value;

    const geometryCreator = new GeometryCreator(
      parseFloat(xradius),
      parseFloat(yradius),
      -20,
      0
    );
    scene.remove(scene.children[0]);
    scene.add(geometryCreator.create2DGeometry());
  });

const shapeSelect2 = document.getElementById("geo2_shapeSelect");
shapeSelect2?.addEventListener("change", function () {
  const shape = (this as HTMLSelectElement).value;
  const inputGroups: { [key: string]: HTMLElement | null } = {
    circle: document.getElementById("circleInputs2"),
    ellipse: document.getElementById("ellipseInputs2"),
  };
  for (const key in inputGroups) {
    if (inputGroups[key]) {
      inputGroups[key]!.style.display = key === shape ? "block" : "none";
    }
  }
});

document.getElementById("geo2_radius")?.addEventListener("change", function () {
  const radius = (this as HTMLInputElement).value;
  const geometryCreator = new GeometryCreator(parseFloat(radius), 20, 0);
  scene.remove(scene.children[1]);
  scene.add(geometryCreator.create2DGeometry());
});

document
  .getElementById("geo2_radiusY")
  ?.addEventListener("change", function () {
    const yradius = (this as HTMLInputElement).value;
    const xradius = (document.getElementById(
      "geo2_radiusX"
    ) as HTMLInputElement).value;
    const geometryCreator = new GeometryCreator(
      parseFloat(xradius),
      parseFloat(yradius),
      20,
      0
    );
    scene.remove(scene.children[1]);
    scene.add(geometryCreator.create2DGeometry());
  });
