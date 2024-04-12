import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 1000);

let isAnimationEnabled = false;
let rotationSpeed = 0.01;

let object;
let controls;
let uploadedTexture;

let objToRender = 'shorts';

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Load the default texture
const defaultTexture = textureLoader.load('textures/white.jpeg');
defaultTexture.flipY = false;
defaultTexture.wrapS = THREE.RepeatWrapping;
defaultTexture.wrapT = THREE.RepeatWrapping;
defaultTexture.needsUpdate = true;

// Handle mouse interactions
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
}

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Update the position of the uploaded texture
  uploadedTexture.offset.x += deltaX / window.innerWidth;
  uploadedTexture.offset.y -= deltaY / window.innerHeight;

  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;

  // Reload the 3D model to apply the updated texture position
  loadTextureAndModel();
}

function onMouseUp() {
  isDragging = false;
}

function loadTextureAndModel() {
  // Use the uploaded texture if it exists, otherwise use the default texture
  const textureToUse = uploadedTexture || defaultTexture;

  // Load the 3D model 
  loader.load(
    `models/${objToRender}/shirt.gltf`,
    function (gltf) {
      if (object) {
        scene.remove(object);
      }
      object = gltf.scene;
      scene.add(object);

      // Assign the combined material to the shirt
      object.getObjectByName('shirt').material.map = textureToUse;
      object.getObjectByName('shirt').material.metalness = 0.3;
      object.getObjectByName('shirt').material.roughness = 0.8;

      // Hide loading indicator
      document.getElementById('loading').style.display = 'none';
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('Error loading model:', error);
      document.getElementById('loading').style.display = 'none';
    }
  );
}

// Initialize renderer, lights, camera

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = objToRender === "shorts" ? 50 : 500;

const topLight = new THREE.DirectionalLight(0xffffff, 0.8); 
topLight.position.set(500, 500, 500); 
topLight.castShadow = true;
scene.add(topLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.8); 
backLight.position.set(-500, -500, -500);
backLight.castShadow = true;
scene.add(backLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "shorts" ? 2 : 1);
scene.add(ambientLight);

if (objToRender === "shorts") {
  controls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  if (isAnimationEnabled && object) {
    object.rotation.y += rotationSpeed;
  }

  renderer.render(scene, camera);
  
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();
