import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x061b38); // deep blue ocean

// === CAMERA ===
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === LIGHTS ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

// === TEXTURES ===
const textureLoader = new THREE.TextureLoader();
const waterNormals = textureLoader.load('/textures/waternormals.jpg');
waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

const causticsTex = textureLoader.load('/textures/caustics.jpg');
causticsTex.wrapS = causticsTex.wrapT = THREE.RepeatWrapping;

// === LOAD MODEL ===
const loader = new GLTFLoader();
loader.load('/models/water.glb', (gltf) => {
  const island = gltf.scene;
  island.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Find the object named "Third"
  const thirdObject = island.getObjectByName('Third');
  if (thirdObject) {
    const originalMat = thirdObject.material;

    // Custom ShaderMaterial with caustic effect overlay
    const causticMat = new THREE.MeshPhongMaterial({
      map: originalMat.map || null,
      color: 0xffffff,
      emissive: 0x111111,
      shininess: 30,
      transparent: true,
      opacity: 1.0,
    });

    // Animate caustic effect
    thirdObject.material = causticMat;
    thirdObject.userData.isCaustic = true;
  }

  island.scale.set(1.2, 1.2, 1.2);
  island.position.set(0, -0.3, 0);
  scene.add(island);
});

// === BUBBLES ===
const bubbleGeometry = new THREE.SphereGeometry(0.03, 16, 16);
const bubbleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x99ccff,
  transparent: true,
  opacity: 0.4,
  roughness: 0,
  metalness: 0,
  transmission: 1,
  ior: 1.1,
});
const bubbles = [];

for (let i = 0; i < 25; i++) {
  const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
  bubble.position.set(
    (Math.random() - 0.5) * 3,
    Math.random() * 1.5,
    (Math.random() - 0.5) * 3
  );
  bubbles.push(bubble);
  scene.add(bubble);
}

// === POSTPROCESSING ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.4,
  0.4,
  0.85
);
composer.addPass(bloomPass);

// === ANIMATION ===
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // Animate caustic texture offset
  causticsTex.offset.x = Math.sin(time * 0.1) * 0.1;
  causticsTex.offset.y += 0.005;
  waterNormals.offset.x += 0.002;
  waterNormals.offset.y += 0.001;

  // Animate bubbles
  bubbles.forEach((b) => {
    b.position.y += 0.004;
    b.position.x += Math.sin(time + b.position.y) * 0.0005;
    if (b.position.y > 1.8) b.position.y = -0.2;
  });

  // Apply moving caustics to "Third"
  scene.traverse((obj) => {
    if (obj.userData.isCaustic && obj.material) {
      obj.material.emissiveMap = causticsTex;
      obj.material.emissiveIntensity = 1.5;
      obj.material.needsUpdate = true;
    }
  });

  controls.update();
  composer.render();
}

animate();

// === HANDLE RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
