import * as THREE from "three";
import { GeometryManager } from "./Geometries/GeometryManager";
import { Vector2 } from "three";
import { LineSegments } from "three";

enum _2Dgeo {
  Ellipse,
  Supperellipse,
  Line,
  Circle,
  Convex_Line,
  Convex_Circle,
  Point,
}
const scene = new THREE.Scene();
let geo1: any | undefined;
let geo2: any | undefined;
let geometryManager = new GeometryManager("2D");

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
  const circleParams = {
    center: new Vector2(0, 0),
    radius: parseFloat(radius),
    segments: 64,
  };
  if (geo1 === undefined) {
    geo1 = geometryManager.createGeometry(_2Dgeo.Circle, "geo1", circleParams);
    scene.add(geo1);
  } else {
    scene.remove(geo1);
    geo1 = geometryManager.createGeometry(_2Dgeo.Circle, "geo1", circleParams);
    scene.add(geo1);
  }
});
document
  .getElementById("geo1_radiusY")
  ?.addEventListener("change", function () {
    const yradius = (this as HTMLInputElement).value;
    const xradius = (document.getElementById(
      "geo1_radiusX"
    ) as HTMLInputElement).value;
    const ellipseParams = {
      center: new Vector2(0, 0),
      xradius: parseFloat(xradius),
      yradius: parseFloat(yradius),
      segments: 64,
    };
    if (geo1 === undefined) {
      geo1 = geometryManager.createGeometry(
        _2Dgeo.Ellipse,
        "geo1",
        ellipseParams
      );
      scene.add(geo1);
    } else {
      scene.remove(geo1);
      geo1 = geometryManager.createGeometry(
        _2Dgeo.Ellipse,
        "geo1",
        ellipseParams
      );
      scene.add(geo1);
    }
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
  const circleParams = {
    center: new Vector2(10, 0),
    radius: parseFloat(radius),
    segments: 64,
  };
  if (geo2 === undefined) {
    geo2 = geometryManager.createGeometry(_2Dgeo.Circle, "geo2", circleParams);
    scene.add(geo2);
  } else {
    scene.remove(geo2);
    geo2 = geometryManager.createGeometry(_2Dgeo.Circle, "geo2", circleParams);
    scene.add(geo2);
  }
});

document
  .getElementById("geo2_radiusY")
  ?.addEventListener("change", function () {
    const yradius = (this as HTMLInputElement).value;
    const xradius = (document.getElementById(
      "geo2_radiusX"
    ) as HTMLInputElement).value;
    const ellipseParams = {
      center: new Vector2(10, 0),
      xradius: parseFloat(xradius),
      yradius: parseFloat(yradius),
      segments: 64,
    };
    if (geo2 === undefined) {
      geo2 = geometryManager.createGeometry(
        _2Dgeo.Ellipse,
        "geo2",
        ellipseParams
      );
      scene.add(geo2);
    } else {
      scene.remove(geo2);
      geo2 = geometryManager.createGeometry(
        _2Dgeo.Ellipse,
        "geo2",
        ellipseParams
      );
      scene.add(geo2);
    }
  });

document
  .getElementById("geo1_positionX")
  ?.addEventListener("input", function () {
    const posX = (this as HTMLInputElement).value;
    if (geo1) {
      geo1.position.x = parseFloat(posX);
    }
  });

document
  .getElementById("geo2_positionX")
  ?.addEventListener("input", function () {
    const posX = (this as HTMLInputElement).value;
    if (geo2) {
      geo2.position.x = parseFloat(posX);
    }
  });

document
  .getElementById("calculateButton")
  ?.addEventListener("click", function () {
    const distance = geometryManager.calculateMinimumDistance(
      _2Dgeo.Ellipse,
      "geo1",
      "geo2"
    );
    if (geo1 && geo2) {
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector2(distance[0].x, distance[0].y),
        new THREE.Vector2(distance[1].x, distance[1].y),
      ]);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
  });
