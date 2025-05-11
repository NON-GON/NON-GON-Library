import * as THREE from 'three';
import { BaseScene } from './BaseScene';

export class Hyperboloid3DScene extends BaseScene {

  protected buildScene(): void {
    const radius = 2;
    const widthSegments = 16;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pointMesh = new THREE.Mesh(geometry, material);

    this.scene.add(pointMesh);
  }

  public start(): void {
    this.buildScene();
    this.renderLoop();
  }

  private renderLoop = (): void => {
    this.controls.update();
    this.render();
    requestAnimationFrame(this.renderLoop);
  }
}
