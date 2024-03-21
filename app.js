console.log("My app .js");
import * as THREE from "./libs/three/three.module.js";
console.log("THREE", THREE);
import { OrbitControls } from "./libs/three/jsm/OrbitControls.js";
console.log("Orbit controll", OrbitControls);

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    //Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 4);

    //Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    //Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.render.bind(this));

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {}

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
