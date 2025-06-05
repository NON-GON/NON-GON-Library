import * as THREE from "three";
import { Colors } from "../colors";
import { GeometryManager } from "../Geometries/GeometryManager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector2, Vector3 } from "../Calc/Util/Utils";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export abstract class Base3DScene {
  protected geometryManager = new GeometryManager();
  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected controls: OrbitControls;
  protected sliders: HTMLElement | null;

  constructor(protected canvas: HTMLCanvasElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // Camera
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //this.camera.position.set(-100, 50, 80);
    this.camera.position.set(-150, 75, 120); // CAM PERSPECTIVE FOR 3D ILLUSTRATIONS ONLY
    //this.camera.position.set(-150, 0, 0); // for PQ illustrations
    this.camera.lookAt(0, 0, 0);

    // Scene & Light
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(Colors.BACKGROUND);

    // Key Light
    const key = new THREE.DirectionalLight(Colors.WHITE, 1.0);
    key.position.set(-100, 100, 100);
    this.scene.add(key);

    // Fill Light
    const fill = new THREE.DirectionalLight(Colors.WHITE, 0.3);
    fill.position.set(100, 50, -50);
    this.scene.add(fill);

    // Back (Rim)
    const back = new THREE.DirectionalLight(Colors.WHITE, 0.5);
    back.position.set(0, 100, -100);
    this.scene.add(back);

    // Ambient
    this.scene.add(new THREE.AmbientLight(0x222222));

    // Grid & Axes
    //this.makeGridAndAxes();

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 200;
    this.controls.addEventListener("start", () => {
      canvas.style.cursor = "grabbing";
    });
    this.controls.addEventListener("end", () => {
      canvas.style.cursor = "grab";
    });
    this.sliders = document.getElementById("sliders");

    // Image Capture
    window.addEventListener("keydown", (evt) => {
      if (evt.key === "s" || evt.key === "S") {
        this.saveScreenshot();
      }
    });

    const exporter = new GLTFExporter();

    window.addEventListener('keydown', (event) => {
      // Use 'e' key (case-insensitive) to trigger export
      if (event.key.toLowerCase() !== 'e') return;
      event.preventDefault();

      // Options for high-quality .glb
      const options = {
        binary: true,         // Export as .glb
        embedImages: true,    // Embed textures into the .glb
        maxTextureSize: Infinity, // Preserve full-resolution textures
        // You can add more options here: trs, onlyVisible, truncateDrawRange, etc.
      };

      exporter.parse(
        this.scene,
        (result) => {
          // If binary is true, result is an ArrayBuffer representing the .glb
          if (result instanceof ArrayBuffer) {
            this.saveArrayBuffer(result, 'scene_export.glb');
            console.log('✅ Export successful: scene_export.glb');
          } else {
            // Fallback for non-binary (e.g., .gltf JSON) if you change options
            const output = JSON.stringify(result, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            const link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.href = URL.createObjectURL(blob);
            link.download = 'scene_export.gltf';
            link.click();
            setTimeout(() => {
              URL.revokeObjectURL(link.href);
              document.body.removeChild(link);
            }, 100);
            console.log('✅ Export successful: scene_export.gltf');
          }
        },
        options
      );
    });

    // Resize Handler
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }, 100);
  }
  
  private saveScreenshot() {
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "non-gon-scene.png";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private makeGridAndAxes() {
    // Bounding Grid
    const gridSize = 200;
    //const gridGeometry = new BoxLineGeometry(gridSize, gridSize, gridSize);
    //const gridMaterial = new THREE.LineBasicMaterial({color: Colors.WHITE, transparent: true, opacity: 0.05});
    //const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    //this.scene.add(grid);

    // Cartesian Axes
    const halfGridSize = gridSize / 2;
    const xAxis = this.makeClippedAxis(
      new THREE.Vector3(1, 0, 0),
      halfGridSize,
      Colors.RED
    );
    const xAxisNeg = this.makeClippedAxis(
      new THREE.Vector3(-1, 0, 0),
      halfGridSize,
      Colors.RED
    );
    const yAxis = this.makeClippedAxis(
      new THREE.Vector3(0, 1, 0),
      halfGridSize,
      Colors.BLUE
    );
    const yAxisNeg = this.makeClippedAxis(
      new THREE.Vector3(0, -1, 0),
      halfGridSize,
      Colors.BLUE
    );
    const zAxis = this.makeClippedAxis(
      new THREE.Vector3(0, 0, 1),
      halfGridSize,
      Colors.GREEN
    );
    const zAxisNeg = this.makeClippedAxis(
      new THREE.Vector3(0, 0, -1),
      halfGridSize,
      Colors.GREEN
    );
    this.scene.add(xAxis, xAxisNeg, yAxis, yAxisNeg, zAxis, zAxisNeg);

    // Axes Arrowheads
    const arrowX = this.makeArrowCone(
      new THREE.Vector3(1, 0, 0),
      halfGridSize,
      Colors.RED
    );
    const arrowY = this.makeArrowCone(
      new THREE.Vector3(0, 1, 0),
      halfGridSize,
      Colors.BLUE
    );
    const arrowZ = this.makeArrowCone(
      new THREE.Vector3(0, 0, 1),
      halfGridSize,
      Colors.GREEN
    );
    this.scene.add(arrowX, arrowY, arrowZ);
  }

  private makeClippedAxis(
    dir: THREE.Vector3,
    length: number,
    color: number
  ): THREE.Line {
    const points = [
      new THREE.Vector3(0, 0, 0),
      dir.clone().multiplyScalar(length),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
    return new THREE.Line(geometry, material);
  }

  private makeArrowCone(dir: THREE.Vector3, length: number, color: number) {
    const coneHeight = 4;
    const coneRadius = 2;
    const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight, 16);
    const coneMaterial = new THREE.MeshBasicMaterial({ color });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);

    coneGeometry.translate(0, -coneHeight / 2, 0);
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      dir.clone().normalize()
    );
    cone.applyQuaternion(quaternion);

    const tipPos = dir.clone().setLength(length);
    cone.position.copy(tipPos);

    return cone;
  }

  protected makeSlidersSolo(
    shapeId: string,
    shapeColor: number,
    shapeParams: any
  ) {
    const fieldSet = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = shapeId;
    fieldSet.appendChild(legend);
    this.makeShapeCenterSliders(fieldSet, shapeId, shapeColor);
    this.makeShapeRotationSliders(fieldSet, shapeId, shapeColor);
    this.sliders.appendChild(fieldSet);
  }

  protected makeSlidersInteraction(
    shape1: any,
    shape2: any,
    connectionColor?: number | undefined
  ) {
    this.makeSlidersInteractionAux(
      shape1,
      shape2,
      connectionColor
    );
    this.makeSlidersInteractionAux(
      shape2,
      shape1,
      connectionColor
    );
  }

  protected makeSlidersInteractionAux(
    shape1: any,
    shape2: any,
    connectionColor: number | undefined
  ) {
    const fieldSet = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = shape1.getId();
    fieldSet.appendChild(legend);

    this.makeShapeCenterSlidersInteraction(
      fieldSet,
      shape1,
      shape2,
      connectionColor
    );
    this.makeShapeRotationSlidersInteraction(
      fieldSet,
      shape1,
      shape2,
      connectionColor
    );

    this.sliders.appendChild(fieldSet);
  }

  private makeShapeCenterSliders(
    fieldSet: HTMLFieldSetElement,
    shapeId: string,
    shapeColor: number
  ) {
    const shapeCenter = this.geometryManager.getGeometry(shapeId).center;
    const fields = [
      [
        "Center X: ",
        shapeCenter.x,
        (v) => this.geometryManager.changeCenterX(shapeId, v),
      ],
      [
        "Center Y: ",
        shapeCenter.y,
        (v) => this.geometryManager.changeCenterY(shapeId, v),
      ],
      [
        "Center Z: ",
        shapeCenter.z,
        (v) => this.geometryManager.changeCenterZ(shapeId, v),
      ],
    ];

    fields.forEach(([labelText, value, newCenter]) => {
      const label = document.createElement("label");
      label.textContent = labelText;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "-100";
      slider.max = "100";
      slider.step = "0.01";
      slider.value = value.toString();

      slider.addEventListener("input", () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shapeId));
        newCenter(v);
        this.scene.add(
          this.geometryManager.getGeometryMesh(shapeId, shapeColor, "mesh")
        );
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement("br"));
    });
  }

  private makeShapeRotationSliders(
    fieldSet: HTMLFieldSetElement,
    shapeId: string,
    shapeColor: number
  ) {
    const shapeRotation = this.geometryManager.getGeometry(shapeId).rotation;
    const fields = [
      [
        "Rotation X: ",
        shapeRotation.x,
        (v) => this.geometryManager.changeRotationX(shapeId, v),
      ],
      [
        "Rotation Y: ",
        shapeRotation.y,
        (v) => this.geometryManager.changeRotationY(shapeId, v),
      ],
      [
        "Rotation Z: ",
        shapeRotation.z,
        (v) => this.geometryManager.changeRotationZ(shapeId, v),
      ],
    ];

    fields.forEach(([labelText, value, newRotation]) => {
      const label = document.createElement("label");
      label.textContent = labelText;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "-360";
      slider.max = "360";
      slider.step = "0.01";
      slider.value = value.toString();

      slider.addEventListener("input", () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shapeId));
        newRotation(v);
        this.scene.add(
          this.geometryManager.getGeometryMesh(shapeId, shapeColor, "mesh")
        );
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement("br"));
    });
  }

  private makeShapeCenterSlidersInteraction(
    fieldSet: HTMLFieldSetElement,
    shape1: any,
    shape2: any,
    connectionColor: number | undefined
  ) {
    const shape1Id = shape1.getId();
    const shape1Color = shape1.getColor();
    const shape2Id = shape2.getId();
    const shape2Color = shape2.getColor();

    const shapeCenter = this.geometryManager.getGeometry(shape1Id).center;
    const fields = [
      [
        "Center X: ",
        shapeCenter.x,
        (v) => this.geometryManager.changeCenterX(shape1Id, v),
      ],
      [
        "Center Y: ",
        shapeCenter.y,
        (v) => this.geometryManager.changeCenterY(shape1Id, v),
      ],
      [
        "Center Z: ",
        shapeCenter.z,
        (v) => this.geometryManager.changeCenterZ(shape1Id, v),
      ],
    ];

    fields.forEach(([labelText, value, newCenter]) => {
      const label = document.createElement("label");
      label.textContent = labelText;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "-100";
      slider.max = "100";
      slider.step = "0.01";
      slider.value = value.toString();

      slider.addEventListener("input", () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shape1Id));
        newCenter(v);

        if (connectionColor !== undefined) {
          this.scene.add(
            this.geometryManager.getGeometryMesh(shape1Id, shape1Color, "mesh")
          );
          const points = this.geometryManager.calculateShortestDistance(
            shape1Id,
            shape2Id
          );
          this.scene.remove(
            this.scene.getObjectByName(
              this.drawShortestDistance(points[0], points[1], connectionColor)
            )
          );
        } else {
          if (this.geometryManager.calculateProximityQuery(shape1Id, shape2Id)) {
            this.scene.remove(this.scene.getObjectByName(shape2Id));
            this.geometryManager.deletePreviousGeometry(shape2Id);

            this.scene.add(this.geometryManager.getGeometryMesh(shape1Id, shape1Color, "line"));
            this.scene.add(this.geometryManager.getGeometryMesh(shape2Id, shape2Color, "line"));
          } else {
            this.scene.remove(this.scene.getObjectByName(shape2Id));
            this.geometryManager.deletePreviousGeometry(shape2Id);

            this.scene.add(this.geometryManager.getGeometryMesh(shape1Id, shape1Color, "mesh"));
            this.scene.add(this.geometryManager.getGeometryMesh(shape2Id, shape2Color, "mesh"));
          }
        }
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement("br"));
    });
  }

  private makeShapeRotationSlidersInteraction(
    fieldSet: HTMLFieldSetElement,
    shape1: any,
    shape2: any,
    connectionColor: number | undefined
  ) {
    const shape1Id = shape1.getId();
    const shape1Color = shape1.getColor();
    const shape2Id = shape2.getId();
    const shape2Color = shape2.getColor();

    const shapeRotation = this.geometryManager.getGeometry(shape1Id).rotation;
    const fields = [
      [
        "Rotation X: ",
        shapeRotation.x,
        (v) => this.geometryManager.changeRotationX(shape1Id, v),
      ],
      [
        "Rotation Y: ",
        shapeRotation.y,
        (v) => this.geometryManager.changeRotationY(shape1Id, v),
      ],
      [
        "Rotation Z: ",
        shapeRotation.z,
        (v) => this.geometryManager.changeRotationZ(shape1Id, v),
      ],
    ];

    fields.forEach(([labelText, value, newRotation]) => {
      const label = document.createElement("label");
      label.textContent = labelText;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "-360";
      slider.max = "360";
      slider.step = "0.01";
      slider.value = value.toString();

      slider.addEventListener("input", () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shape1Id));
        newRotation(v);

        if (connectionColor !== undefined) {
          this.scene.add(
            this.geometryManager.getGeometryMesh(shape1Id, shape1Color, "mesh")
          );
          const points = this.geometryManager.calculateShortestDistance(
            shape1Id,
            shape2Id
          );
          this.scene.remove(
            this.scene.getObjectByName(
              this.drawShortestDistance(points[0], points[1], connectionColor)
            )
          );
        } else {
          if (this.geometryManager.calculateProximityQuery(shape1Id, shape2Id)) {
            this.scene.remove(this.scene.getObjectByName(shape2Id));
            this.geometryManager.deletePreviousGeometry(shape2Id);

            this.scene.add(this.geometryManager.getGeometryMesh(shape1Id, shape1Color, "line"));
            this.scene.add(this.geometryManager.getGeometryMesh(shape2Id, shape2Color, "line"));
          } else {
            this.scene.remove(this.scene.getObjectByName(shape2Id));
            this.geometryManager.deletePreviousGeometry(shape2Id);

            this.scene.add(this.geometryManager.getGeometryMesh(shape1Id, shape1Color, "mesh"));
            this.scene.add(this.geometryManager.getGeometryMesh(shape2Id, shape2Color, "mesh"));
          }
        }
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement("br"));
    });
  }

  private onWindowResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  public startAnimation(): void {
    this.buildScene();
    this.render();
  }

  private render = (): void => {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };

  protected abstract buildScene(): void;

  protected drawShortestDistance(
    point1: Vector3 | Vector2,
    point2: Vector3 | Vector2,
    color: number
  ) {
    console.log(point1, point2);
    const lineMaterial = new MeshLineMaterial({ color: color, lineWidth: 1.75});
    const lineGeometry = new MeshLineGeometry()
    lineGeometry.setPoints([
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

    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.name = 'connection';
    this.scene.add(line);

    return line.name;
  }
}
