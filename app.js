console.log("My app .js");
import * as THREE from "./libs/three/three.module.js";
console.log("THREE", THREE);
import { GLTFLoader } from "./libs/three/jsm/GLTFLoader.js";
console.log("GLTFLoader", GLTFLoader);
import { FBXLoader } from "./libs/three/jsm/FBXLoader.js";
console.log("FBXLoader", FBXLoader);
import { RGBELoader } from "./libs/three/jsm/RGBELoader.js";
console.log("RGBELoader", RGBELoader);
import { OrbitControls } from "./libs/three/jsm/OrbitControls.js";
console.log("Orbit controll", OrbitControls);
import { LoadingBar } from "./libs/LoadingBar.js";
console.log("LoadingBar", LoadingBar);

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
    this.camera.position.set(0, 10, 50);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    const ambient = new THREE.HemisphereLight(0xffffff, 0x666666, 0.3);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight();
    light.position.set(0.2, 1, 1.5);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.setEnvironment();
    container.appendChild(this.renderer.domElement);

    //Add code here

    this.loadingBar = new LoadingBar();
    this.loadGLTF();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 3.5, 0);
    this.controls.update();

    window.addEventListener("resize", this.resize.bind(this));
  }

  setEnvironment() {
    const loader = new RGBELoader().setDataType(THREE.UnsignedByteType);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load(
      "./assets/hdr/venice_sunset_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        self.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error("An error occurred setting the environment");
      }
    );
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

  loadFBX() {}

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.chair.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
