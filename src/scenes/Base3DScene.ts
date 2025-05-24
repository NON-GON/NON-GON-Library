import * as THREE from 'three';
import { Colors } from '../colors';
import { GeometryManager } from '../Geometries/GeometryManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector2, Vector3 } from "../Calc/Util/Utils";

export abstract class Base3DScene {
    protected geometryManager = new GeometryManager();
    protected renderer: THREE.WebGLRenderer;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected controls: OrbitControls;
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
        //this.camera.position.set(-200, 200, 200);
        this.camera.position.set(-100, 50, 80); // CAM PERSPECTIVE FOR 3D ILLUSTRATIONS ONLY
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
        this.controls.addEventListener('start', () => {
          canvas.style.cursor = 'grabbing';
        });     
        this.controls.addEventListener('end', () => {
          canvas.style.cursor = 'grab';
        });
        this.sliders = document.getElementById('sliders');

        // Image Capture
        window.addEventListener('keydown', (evt) => {
          if (evt.key === 's' || evt.key === 'S') {
            this.saveScreenshot();
          }
        });

        // Resize Handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
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

    private makeGridAndAxes() {
        // Bounding Grid
        const gridSize = 200;
        //const gridGeometry = new BoxLineGeometry(gridSize, gridSize, gridSize);
        //const gridMaterial = new THREE.LineBasicMaterial({color: Colors.WHITE, transparent: true, opacity: 0.05});
        //const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        //this.scene.add(grid);

        // Cartesian Axes
        const halfGridSize = gridSize / 2;
        const xAxis = this.makeClippedAxis(new THREE.Vector3(1, 0, 0), halfGridSize, Colors.RED);
        const xAxisNeg = this.makeClippedAxis(new THREE.Vector3(-1, 0, 0), halfGridSize, Colors.RED);
        const yAxis = this.makeClippedAxis(new THREE.Vector3(0, 1, 0), halfGridSize, Colors.BLUE);
        const yAxisNeg = this.makeClippedAxis(new THREE.Vector3(0, -1, 0), halfGridSize, Colors.BLUE);
        const zAxis = this.makeClippedAxis(new THREE.Vector3(0, 0, 1), halfGridSize, Colors.GREEN);
        const zAxisNeg = this.makeClippedAxis(new THREE.Vector3(0, 0, -1), halfGridSize, Colors.GREEN);
        this.scene.add(xAxis, xAxisNeg, yAxis, yAxisNeg, zAxis, zAxisNeg);

        // Axes Arrowheads
        const arrowX = this.makeArrowCone(new THREE.Vector3(1, 0, 0), halfGridSize, Colors.RED);
        const arrowY = this.makeArrowCone(new THREE.Vector3(0, 1, 0), halfGridSize, Colors.BLUE);
        const arrowZ = this.makeArrowCone(new THREE.Vector3(0, 0, 1), halfGridSize, Colors.GREEN);
        this.scene.add(arrowX, arrowY, arrowZ);
    }

    private makeClippedAxis(dir: THREE.Vector3, length: number, color: number): THREE.Line {
        const points = [new THREE.Vector3(0, 0, 0), dir.clone().multiplyScalar(length)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material  = new THREE.LineBasicMaterial({color, linewidth: 2});
        return new THREE.Line(geometry, material);
    }
    
    private makeArrowCone(dir: THREE.Vector3, length: number, color: number) {
        const coneHeight = 4;
        const coneRadius = 2;
        const coneGeometry  = new THREE.ConeGeometry(coneRadius, coneHeight, 16);
        const coneMaterial  = new THREE.MeshBasicMaterial({color});
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);

        coneGeometry.translate(0, -coneHeight / 2, 0);
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().normalize());
        cone.applyQuaternion(quaternion);

        const tipPos = dir.clone().setLength(length);
        cone.position.copy(tipPos);

        return cone;
    }

    protected makeSliders(shapeName: string, shapeParams: any) {
      const fieldSet = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = shapeName;
      fieldSet.appendChild(legend);

      for (const [key, value] of Object.entries(shapeParams)) {
        const label = document.createElement('label');
        label.textContent = `${key}: `;
      
        const slider = document.createElement('input');
        slider.type  = 'range';
        slider.min   = '-100';
        slider.max   = '100';
        slider.step  = '1';
        slider.value = value.toString();
      
        slider.addEventListener('input', () => {
          const v = parseFloat(slider.value);
          shapeParams[key] = v;
          // rebuild geometry here
        });

        label.appendChild(slider);
        fieldSet.appendChild(label);
        fieldSet.appendChild(document.createElement('br'));
      }

      this.sliders.appendChild(fieldSet);
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
    }

    
    protected abstract buildScene(): void;
    
    protected drawMinimumDistance(
      point1: Vector3 | Vector2,
      point2: Vector3 | Vector2,
      color: number
    ) {
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
      this.scene.add(line);
    }
}
