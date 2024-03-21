console.log("My app .js");
import * as THREE from "./libs/three/three.module.js";
console.log("THREE", THREE);
import { OrbitControls } from "./libs/three/jsm/OrbitControls.js";
console.log("Orbit controll", OrbitControls);

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {}

  render() {}
}

export { App };
