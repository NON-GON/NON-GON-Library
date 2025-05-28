import * as THREE from "three";
import { Colors } from "../colors";
import { GeometryManager } from "../Geometries/GeometryManager";
import { Vector2, Vector3 } from "../Calc/Util/Utils";

export abstract class Base2DScene {
  protected geometryManager = new GeometryManager();
  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected sliders: HTMLElement | null;

  constructor(protected canvas: HTMLCanvasElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // Camera
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, -100);
    this.camera.lookAt(0, 0, 0);

    // Scene & Light
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(Colors.BACKGROUND);

    const light = new THREE.DirectionalLight(Colors.WHITE, 3);
    light.position.set(0, 0, 200);
    light.lookAt(0, 0, 0);
    this.scene.add(light);

    // Grid & Axes
    //this.makeAxes();

    // Controls
    this.sliders = document.getElementById('sliders');

    // Image Capture
    window.addEventListener('keydown', (evt) => {
      if (evt.key === 's' || evt.key === 'S') {
        this.saveScreenshot();
      }
    });

    // Resize Handler
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private saveScreenshot() {
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'non-gon-scene.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private makeAxes() {
    // Cartesian Axes
    const halfGridSize = 100;
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
    this.scene.add(xAxis, xAxisNeg, yAxis, yAxisNeg);

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
    this.scene.add(arrowX, arrowY);
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

  protected makeSlidersSolo(shapeId: string, shapeColor: number, shapeParams: any) {
    const fieldSet = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = shapeId;
    fieldSet.appendChild(legend);
    this.makeShapeCenterSliders(fieldSet, shapeId, shapeColor);
    this.makeShapeRotationSliders(fieldSet, shapeId, shapeColor);
    this.sliders.appendChild(fieldSet);
  }

  protected makeSlidersInteraction(shape1Id: string, shape1Color: number, shape1Params: any,
                                   shape2Id: string, shape2Color: number, shape2Params: any,
                                   connectionColor: number) {
    this.makeSlidersInteractionAux(shape1Id, shape1Color, shape1Params, shape2Id, connectionColor);
    this.makeSlidersInteractionAux(shape2Id, shape2Color, shape2Params, shape1Id, connectionColor);
  }

  protected makeSlidersInteractionAux(shape1Id: string, shape1Color: number, shape1Params: any, shape2Id: string, connectionColor: number) {
    const fieldSet = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = shape1Id;
    fieldSet.appendChild(legend);
    this.makeShapeCenterSlidersInteraction(fieldSet, shape1Id, shape1Color, shape2Id, connectionColor);
    this.makeShapeRotationSlidersInteraction(fieldSet, shape1Id, shape1Color, shape2Id, connectionColor);
    this.sliders.appendChild(fieldSet);
  }

  private makeShapeCenterSliders(fieldSet: HTMLFieldSetElement, shapeId: string, shapeColor: number) {
    const shapeCenter = this.geometryManager.getGeometry(shapeId).center;
    const fields = [['Center X: ', shapeCenter.x, v => this.geometryManager.changeCenterX(shapeId, v)],
                    ['Center Y: ', shapeCenter.y, v => this.geometryManager.changeCenterY(shapeId, v)]];

    fields.forEach( ([labelText, value, newCenter]) => {
      const label = document.createElement('label');
      label.textContent = labelText;
    
      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = '-100';
      slider.max   = '100';
      slider.step  = '0.01';
      slider.value = value.toString();
    
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shapeId));
        newCenter(v);
        this.scene.add(this.geometryManager.getGeometryMesh(shapeId, shapeColor, 'line'));
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement('br'));
    });
  }

  private makeShapeRotationSliders(fieldSet: HTMLFieldSetElement, shapeId: string, shapeColor: number) {
    const shapeRotation = this.geometryManager.getGeometry(shapeId).rotation;
    const fields = [['Rotation: ', shapeRotation.z, v => this.geometryManager.changeRotationZ(shapeId, v)]];

    fields.forEach( ([labelText, value, newRotation]) => {
      const label = document.createElement('label');
      label.textContent = labelText;
    
      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = '-360';
      slider.max   = '360';
      slider.step  = '0.01';
      slider.value = value.toString();
    
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shapeId));
        newRotation(v);
        this.scene.add(this.geometryManager.getGeometryMesh(shapeId, shapeColor, 'line'));
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement('br'));
    });
  }

  private makeShapeCenterSlidersInteraction(fieldSet: HTMLFieldSetElement, shape1Id: string, shape1Color: number, shape2Id: string, connectionColor: number) {
    const shapeCenter = this.geometryManager.getGeometry(shape1Id).center;
    const fields = [['Center X: ', shapeCenter.x, v => this.geometryManager.changeCenterX(shape1Id, v)],
                    ['Center Y: ', shapeCenter.y, v => this.geometryManager.changeCenterY(shape1Id, v)]];

    fields.forEach( ([labelText, value, newCenter]) => {
      const label = document.createElement('label');
      label.textContent = labelText;
    
      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = '-100';
      slider.max   = '100';
      slider.step  = '0.01';
      slider.value = value.toString();
    
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shape1Id));
        newCenter(v);
        this.scene.add(this.geometryManager.getGeometryMesh(shape1Id, shape1Color, 'line'));
        const points = this.geometryManager.calculateShortestDistance(shape1Id, shape2Id);
        this.scene.remove(this.scene.getObjectByName(this.drawShortestDistance(points[0], points[1], connectionColor)));
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement('br'));
    });
  }
  private makeShapeRotationSlidersInteraction(fieldSet: HTMLFieldSetElement, shape1Id: string, shape1Color: number, shape2Id: string, connectionColor: number) {
    const shapeRotation = this.geometryManager.getGeometry(shape1Id).rotation;
    const fields = [['Rotation Z: ', shapeRotation.z, v => this.geometryManager.changeRotationZ(shape1Id, v)]];

    fields.forEach( ([labelText, value, newRotation]) => {
      const label = document.createElement('label');
      label.textContent = labelText;
      
      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.min   = '-360';
      slider.max   = '360';
      slider.step  = '0.01';
      slider.value = value.toString();
    
      slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        this.scene.remove(this.scene.getObjectByName(shape1Id));
        newRotation(v);
        this.scene.add(this.geometryManager.getGeometryMesh(shape1Id, shape1Color, 'line'));
        const points = this.geometryManager.calculateShortestDistance(shape1Id, shape2Id);
        this.scene.remove(this.scene.getObjectByName(this.drawShortestDistance(points[0], points[1], connectionColor)));
      });

      label.appendChild(slider);
      fieldSet.appendChild(label);
      fieldSet.appendChild(document.createElement('br'));
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
    const lineMaterial = new THREE.LineBasicMaterial({ color: color });
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
    line.name = 'connection';
    this.scene.add(line);

    return line.name;
  }
}
