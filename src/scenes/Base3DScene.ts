import * as THREE from 'three';
import { Colors } from '../colors';
import { GeometryManager } from '../Geometries/GeometryManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry';

export abstract class Base3DScene {
    protected geometryManager = new GeometryManager();
    protected renderer: THREE.WebGLRenderer;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected controls: OrbitControls;

    constructor(protected canvas: HTMLCanvasElement) {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        // Camera
        const fov = 75;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(-200, 200, 200);
        this.camera.lookAt(0, 0, 0);

        // Scene & Light
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(Colors.BACKGROUND);

        const light1 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light1.position.set(-100, 100, 100);
        light1.lookAt(0, 0, 0);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light2.position.set(-100, 100, -100);
        light2.lookAt(0, 0, 0);
        this.scene.add(light2);

        const light3 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light3.position.set(100, 100, -100);
        light3.lookAt(0, 0, 0);
        this.scene.add(light3);

        const light4 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light4.position.set(100, 100, 100);
        light4.lookAt(0, 0, 0);
        this.scene.add(light4);

        const light5 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light5.position.set(-100, -100, 100);
        light5.lookAt(0, 0, 0);
        this.scene.add(light5);

        const light6 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light6.position.set(-100, -100, -100);
        light6.lookAt(0, 0, 0);
        this.scene.add(light6);

        const light7 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light7.position.set(100, -100, -100);
        light7.lookAt(0, 0, 0);
        this.scene.add(light7);

        const light8 = new THREE.DirectionalLight(Colors.WHITE, 3);
        light8.position.set(100, -100, 100);
        light8.lookAt(0, 0, 0);
        this.scene.add(light8);

        // Grid & Axes
        this.makeGridAndAxes();

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

        // Resize Handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private makeGridAndAxes() {
        // Bounding Grid
        const gridSize = 200;
        const gridGeometry = new BoxLineGeometry(gridSize, gridSize, gridSize);
        const gridMaterial = new THREE.LineBasicMaterial({color: Colors.WHITE, transparent: true, opacity: 0.05});
        const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        this.scene.add(grid);

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
}
