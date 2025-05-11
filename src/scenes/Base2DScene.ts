import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry';

const DARK_BACKGROUND = 0x2F3336;
const WHITE = 0xFFFFFF;
const RED = 0xA32545;
const GREEN = 0x5D803D;
const BLUE = 0x6BA7C7;

export abstract class Base2DScene {
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
        this.camera.position.set(0, 0, 300);
        this.camera.lookAt(0, 0, 0);

        // Scene & Light
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(DARK_BACKGROUND);
        const light = new THREE.DirectionalLight(WHITE, 3);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        // Grid & Axes
        this.makeGridAndAxes();

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.minDistance = 10;
        this.controls.maxDistance = 300;

        // Resize Handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private makeGridAndAxes() {
        // Bounding Grid
        const gridSize = 200;
        const segments = 100;
        const gridGeometry = new BoxLineGeometry(gridSize, gridSize, gridSize, segments, segments, segments);
        const gridMaterial = new THREE.LineBasicMaterial({color: WHITE, transparent: true, opacity: 0.05});
        const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        this.scene.add(grid)

        // Cartesian Axes
        const halfGridSize = gridSize / 2;
        const xAxis = this.makeClippedAxis(new THREE.Vector3(1, 0, 0), halfGridSize, RED);
        const xAxisNeg = this.makeClippedAxis(new THREE.Vector3(-1, 0, 0), halfGridSize, RED)        
        const yAxis = this.makeClippedAxis(new THREE.Vector3(0, 1, 0), halfGridSize, BLUE);
        const yAxisNeg = this.makeClippedAxis(new THREE.Vector3(0, -1, 0), halfGridSize, BLUE)       
        const zAxis = this.makeClippedAxis(new THREE.Vector3(0, 0, 1), halfGridSize, GREEN);
        const zAxisNeg = this.makeClippedAxis(new THREE.Vector3(0, 0, -1), halfGridSize, GREEN)      
        this.scene.add(xAxis, xAxisNeg, yAxis, yAxisNeg, zAxis, zAxisNeg)

        // Axes Arrowheads
        const arrowX = this.makeArrowCone(new THREE.Vector3(1, 0, 0), halfGridSize, RED);
        const arrowY = this.makeArrowCone(new THREE.Vector3(0, 1, 0), halfGridSize, BLUE);
        const arrowZ = this.makeArrowCone(new THREE.Vector3(0, 0, 1), halfGridSize, GREEN);
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

    public start(): void {
        this.buildScene();
        this.render();
    }

    private render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    protected abstract buildScene(): void;
}
