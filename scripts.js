import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 9);
camera.rotation.x = -Math.PI / 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow quality
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(5, 5, 5); // Position the light
light.castShadow = true; // Enable shadow casting from the light
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

// Bloom Effect
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.25, // Bloom strength
  1.2, // Bloom radius
  0.3 // Bloom threshold
);
composer.addPass(bloomPass);

const loader = new GLTFLoader();
let cube; // color: #7B7B7B
loader.load(
  "assets/cube.glb",
  (gltf) => {
    cube = gltf.scene;
    scene.add(cube);
    cube.rotation.y = 1.5 * Math.PI;
    // Make sure the model casts shadows
    cube.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

let cube2; // Store the loaded model to manipulate it later
setTimeout(() => {
  loader.load(
    "assets/cube2.glb",
    (gltf) => {
      cube2 = gltf.scene;
      scene.add(cube2);
      cube2.rotation.y = Math.PI / 4 - Math.PI / 2;

      // Make sure the model casts shadows
      cube2.traverse((child) => {
        if (child.isMesh) {
          // console.log(child.material.name);
          child.castShadow = true;
          if (child.material.name == "inner_mat") {
            child.material.emissive = new THREE.Color(0xbf502f);
            child.material.emissiveIntensity = 1; // Increase brightness
          }
        }
      });
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
}, 5900);

const groundGeometry = new THREE.PlaneGeometry(1500, 1500); // Large plane
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x171717 }); // Light gray material
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be flat on the ground
ground.position.y = -1; // Position it beneath the cube
ground.receiveShadow = true; // Enable shadow receiving
scene.add(ground);

let clock = new THREE.Clock();
let acceleration = 0;

const initCubeRot = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(0, Math.PI, 0)
);
const finalCubeRot = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(0, 10 * Math.PI + Math.PI / 4, 0)
);

const initCamPos = new THREE.Vector3(0, 8, 9);
const finalCamPos = new THREE.Vector3(0, 3, 4);
let lerpFactor = 0;

const initCamRot = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(-Math.PI / 3.75, 0, 0)
);
const finalCamRot = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(-Math.PI / 4.75, 0, 0)
);

function animate() {
  requestAnimationFrame(animate);

  let time = clock.getElapsedTime();

  if (cube && time < 3) {
    acceleration += 0.0075;
    let easeFactor = acceleration * acceleration;
    cube.quaternion.slerpQuaternions(initCubeRot, finalCubeRot, easeFactor);
  } else if (cube && time < 6 && acceleration > 0) {
    acceleration -= 0.0075;
    let easeFactor = acceleration * acceleration;
    cube.quaternion.slerpQuaternions(finalCubeRot, initCubeRot, easeFactor);
  }

  if (cube && time > 6 && cube.scale.x > 0) {
    cube.scale.x -= 0.025;
    cube.scale.y -= 0.025;
    cube.scale.z -= 0.025;
  } else if (cube && cube.scale.x <= 0) {
    cube.scale.set(0, 0, 0);
  }

  if (camera && time > 6 && lerpFactor < 1) {
    lerpFactor += 0.025;
    camera.position.lerpVectors(initCamPos, finalCamPos, lerpFactor);
    camera.quaternion.slerpQuaternions(initCamRot, finalCamRot, lerpFactor);
  }

  // renderer.render(scene, camera);
  composer.render(); // Use composer instead of renderer
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
