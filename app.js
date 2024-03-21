console.log("My app .js");
import * as THREE from "./libs/three/three.module.js";
// console.log("THREE", THREE);
import { GLTFLoader } from "./libs/three/jsm/GLTFLoader.js";
// console.log("GLTFLoader", GLTFLoader);
import { FBXLoader } from "./libs/three/jsm/FBXLoader.js";
// console.log("FBXLoader", FBXLoader);
import { RGBELoader } from "./libs/three/jsm/RGBELoader.js";
// console.log("RGBELoader", RGBELoader);
import { OrbitControls } from "./libs/three/jsm/OrbitControls.js";
// console.log("Orbit controll", OrbitControls);
import { LoadingBar } from "./libs/LoadingBar.js";
// console.log("LoadingBar", LoadingBar);
import { Stats } from "./libs/stats.module.js";
console.log("Stats", Stats);
import { ARButton } from "./libs/ARButton.js";
console.log("ARButton", ARButton);

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.set(0, 10, 50);

    this.scene = new THREE.Scene();

    this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(this.renderer.domElement);

    this.loadingBar = new LoadingBar();
    this.loadGLTF();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 3.5, 0);
    this.controls.update();

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.initScene();
    this.setupXR();

    window.addEventListener("resize", this.resize.bind(this));
  }

  initScene() {
    this.geometry = new THREE.BoxBufferGeometry(0.06, 0.06, 0.06);
    this.meshes = [];
  }

  setupXR() {
    this.renderer.xr.enabled = true;

    const self = this;
    let controller;

    function onSelect() {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff * Math.random(),
      });
      const mesh = new THREE.Mesh(self.geometry, material);
      mesh.position.set(0, 0, -0.3).applyMatrix4(controller.matrixWorld);
      mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
      self.scene.add(mesh);
      self.scene.push(mesh);
    }
    const btn = new ARButton(this.renderer);

    controller = this.renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    this.scene.add(controller);

    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  loadGLTF() {
    const loader = new GLTFLoader().setPath("./assets/");
    const self = this;

    // Load a glTF resource
    loader.load(
      // resource URL
      "WindMill.gltf",
      // called when the resource is loaded
      function (gltf) {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        console.log(
          `min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(
            2
          )},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(
            2
          )},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`
        );

        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.metalness = 0.2;
          }
        });
        self.chair = gltf.scene;

        self.scene.add(gltf.scene);

        self.loadingBar.visible = false;

        self.renderer.setAnimationLoop(self.render.bind(self));
      },
      // called while loading is progressing
      function (xhr) {
        self.loadingBar.progress = xhr.loaded / xhr.total;
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.stats.update();
    this.meshes.forEach((mesh) => {
      mesh.rotateY(0.01);
    });
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
