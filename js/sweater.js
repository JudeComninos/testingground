import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 1000);

let isAnimationEnabled = false; 
let rotationSpeed = 0.01; 



let object;
let controls;
let texture;

let objToRender = 'shorts';

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

let imageUrl = 'textures/white.jpeg'; 

let currentModel = {
  modelName: 'spikey.gltf',
  objectName1: 'spikey_1',
  objectName2: 'spikey_2'
};

document.getElementById('Curly').addEventListener('click', function() {
  currentModel = {
    modelName: 'sweatNEW.gltf',
    objectName1: 'curlyNew_1',
    objectName2: 'curlyNew_2'
  };
  loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2, true);
});

document.getElementById('Spikey').addEventListener('click', function() {
  currentModel = {
    modelName: 'spikey.gltf',
    objectName1: 'spikey_1',
    objectName2: 'spikey_2'
  };
  loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2, true);
});


loadTextureAndModel('spikey.gltf', 'spikey_1', 'spikey_2');

function loadTextureAndModel(modelName, objectName1, objectName2, isLoadingNewModel = false) {
  if (isLoadingNewModel) {
    document.getElementById('loading').style.display = 'block';
  }
  textureLoader.load(imageUrl, function(loadedTexture) {
    texture = loadedTexture;
    texture.flipY = false;

    texture.repeat.set(2, 2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    loader.load(
      `models/${objToRender}/${modelName}`,
      function (gltf) {
        if (object) {
          scene.remove(object); 
        }
        object = gltf.scene;
        scene.add(object);
        console.log(object);

       try {
          if (selectedColors[0]) {
            let colorHex = colorNameToHex(selectedColors[0]);
            let material = new THREE.MeshStandardMaterial({color: colorHex});
            material.metalness = 0.3; 
            material.roughness = 0.8; 
            object.getObjectByName(objectName1).material = material;
          }

          if (selectedColors[1]) {
            let colorHex = colorNameToHex(selectedColors[1]);
            let material = new THREE.MeshStandardMaterial({color: colorHex});
            material.metalness = 0.3; 
            material.roughness = 0.8; 
            object.getObjectByName(objectName2).material = material;
          }
        } catch (error) {
          console.error('Error setting material:', error);
        }

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
  });
}
loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = objToRender === "shorts" ? 60 : 500;

const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(500, 500, 500); 
topLight.castShadow = true;
scene.add(topLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1); 
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

animate();




var colors = ["Tomato", "DarkOliveGreen", "SteelBlue", "Black", "White", "Orange", "HotPink", "SaddleBrown", "Gray"];
        var selectedColors = [null, null];

        colors.forEach(function(color) {
            var button = document.createElement("button");
            button.className = "color-button";
            button.style.backgroundColor = color;
            button.addEventListener("click", function() {
                selectColor(button, color);
            });
            document.getElementById("color-buttons").appendChild(button);
        });

        function selectColor(button, color) {
          if (button.classList.contains("selected-1") || button.classList.contains("selected-2")) {
              deselectColor(button, color);
          } else if (selectedColors[0] === null) {
              button.classList.add("selected-1");
              selectedColors[0] = color;
          } else if (selectedColors[1] === null) {
              button.classList.add("selected-2");
              selectedColors[1] = color;
          }
          loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2);
      }
      
      function deselectColor(button, color) {
          if (button.classList.contains("selected-1")) {
              button.classList.remove("selected-1");
              selectedColors[0] = selectedColors[1];
              selectedColors[1] = null;
              var secondButton = document.querySelector(".selected-2");
              if (secondButton) {
                  secondButton.classList.remove("selected-2");
                  secondButton.classList.add("selected-1");
              }
          } else if (button.classList.contains("selected-2")) {
              button.classList.remove("selected-2");
              selectedColors[1] = null;
          }
          loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2);
      }
        function colorNameToHex(color) {
          var colors = {
              "Tomato": "#FF6347",
              "DarkOliveGreen": "#556B2F",
              "SteelBlue": "#4682B4",
              "Black": "#292929",
              "White": "#FFFFFF",
              "Orange": "#FFA500",
              "HotPink": "#FF69B4",
              "SaddleBrown": "#402e28",
              "Gray": "#808080"
          };
          return colors[color];
      }
      document.getElementById('toggleAnimation').addEventListener('click', function() {
        isAnimationEnabled = !isAnimationEnabled;
      
        if (isAnimationEnabled) {
          controls.enabled = false;
        } else {
          controls.enabled = true;
        }
      });

      document.getElementById('newContainer3').addEventListener('click', function() {
        var popup = document.getElementById('popup');
        popup.style.display = 'block';
        popup.style.transform = 'translateY(100%)';
        setTimeout(function() {
            popup.style.transition = 'transform 0.3s ease-out';
            popup.style.transform = 'translateY(0)';
        }, 100);
    });