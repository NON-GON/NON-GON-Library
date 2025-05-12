import * as THREE from 'three';
import { Colors } from '../colors';
import { GeometryManager } from '../Geometries/GeometryManager';

export abstract class Base2DScene {
    protected geometryManager = new GeometryManager();
    protected renderer: THREE.WebGLRenderer;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;

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
        this.camera.position.set(0, 0, 200);
        this.camera.lookAt(0, 0, 0);

        // Scene & Light
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(Colors.BACKGROUND);

        const light = new THREE.DirectionalLight(Colors.WHITE, 3);
        light.position.set(0, 0, 200);
        light.lookAt(0, 0, 0);
        this.scene.add(light);

        // Grid & Axes
        this.makeAxes();

        // Resize Handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private makeAxes() {
        // Cartesian Axes
        const halfGridSize = 100;
        const xAxis = this.makeClippedAxis(new THREE.Vector3(1, 0, 0), halfGridSize, Colors.RED);
        const xAxisNeg = this.makeClippedAxis(new THREE.Vector3(-1, 0, 0), halfGridSize, Colors.RED);
        const yAxis = this.makeClippedAxis(new THREE.Vector3(0, 1, 0), halfGridSize, Colors.BLUE);
        const yAxisNeg = this.makeClippedAxis(new THREE.Vector3(0, -1, 0), halfGridSize, Colors.BLUE);
        this.scene.add(xAxis, xAxisNeg, yAxis, yAxisNeg);

        // Axes Arrowheads
        const arrowX = this.makeArrowCone(new THREE.Vector3(1, 0, 0), halfGridSize, Colors.RED);
        const arrowY = this.makeArrowCone(new THREE.Vector3(0, 1, 0), halfGridSize, Colors.BLUE);
        this.scene.add(arrowX, arrowY);
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

    private render = (): void => {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    protected abstract buildScene(): void;
}
