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

const imageUpload = document.getElementById('imageUpload');
let imageUrl = 'textures/white.jpeg'; 

let defaultTexture;
let uploadedTexture;


// Load the default texture
textureLoader.load('textures/white.jpeg', function(loadedTexture) {
  defaultTexture = loadedTexture;
  defaultTexture.flipY = false;
  defaultTexture.wrapS = THREE.RepeatWrapping;
  defaultTexture.wrapT = THREE.RepeatWrapping;
  defaultTexture.needsUpdate = true;
  
  
});

imageUpload.addEventListener('change', function() {
  const file = this.files[0];
  imageUrl = URL.createObjectURL(file);

  // Update the image source
  document.querySelector('label[for="imageUpload"] img').src = imageUrl;

  // Load the uploaded texture
  textureLoader.load(imageUrl, function(loadedTexture) {
    uploadedTexture = loadedTexture;
    uploadedTexture.flipY = false;
    uploadedTexture.repeat.set(sliderValue, sliderValue);
    uploadedTexture.wrapS = THREE.RepeatWrapping;
    uploadedTexture.wrapT = THREE.RepeatWrapping;
    uploadedTexture.needsUpdate = true;

    // Reload the 3D model
    loadTextureAndModel();
  });
});



function loadTextureAndModel() {
  // Use the uploaded texture if it exists, otherwise use the default texture
  let textureToUse = uploadedTexture || defaultTexture;

  // Load the 3D model
  loader.load(
    `models/${objToRender}/shorts3.gltf`,
    function (gltf) {
        if (object) {
          scene.remove(object);
        }
        object = gltf.scene;
        scene.add(object);
        console.log(object);
    
        // Apply texture to shorts_1
        object.getObjectByName('pressedshorts_1').material.map = textureToUse;
        object.getObjectByName('pressedshorts_1').material.metalness = 0.3;
        object.getObjectByName('pressedshorts_1').material.roughness = 0.8;
    
        // Add color picker functionality to shorts_2
        try {
          if (selectedColor) {
            let colorHex = colorNameToHex(selectedColor);
            let material = new THREE.MeshStandardMaterial({color: colorHex});
            material.metalness = 0.3;
            material.roughness = 0.8;
            object.getObjectByName('pressedshorts_2').material = material;
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
}



loadTextureAndModel();


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

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

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; 


let sliderValue = slider.value; // Store the initial slider value

slider.oninput = function() {
  output.innerHTML = this.value / 100;
  sliderValue = this.value; // Update the slider value when it changes

  if (uploadedTexture) {
    uploadedTexture.repeat.set(this.value, this.value);
  }
}

var colors = ["Tomato", "DarkOliveGreen", "SteelBlue", "Black", "White", "Orange", "HotPink", "SaddleBrown", "Gray"];
var selectedColor = null; // Only one color will be selected
var selectedButton = null; // Keep track of the selected button

colors.forEach(function(color) {
    var button = document.createElement("button");
    button.className = "color-button";
    button.style.backgroundColor = color;
    button.addEventListener("click", function() {
        selectColor(button, color);
    });
    
    document.getElementById("color-buttons").appendChild(button); // change the id to the id of the container for the shorts color buttons
});

function selectColor(button, color) {
  // If there's a previously selected color, deselect it
  if (selectedButton) {
    deselectColor(selectedButton, selectedColor);
  }

  button.classList.add("selected");
  selectedColor = color;
  selectedButton = button; // Update the selected button

  slider.value = sliderValue; // Set the slider value to the stored value
  output.innerHTML = sliderValue / 100; // Update the output

  loadTextureAndModel();
}

function deselectColor(button, color) {
  button.classList.remove("selected");
  selectedColor = null;
  selectedButton = null; // Reset the selected button

  slider.value = sliderValue; // Set the slider value to the stored value
  output.innerHTML = sliderValue / 100; // Update the output

  loadTextureAndModel();
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

document.getElementById('container3D').addEventListener('click', function() {
  var popup = document.getElementById('popup');
  // Check if the popup is visible
  if (popup.style.display === 'block') {
      // If so, collapse it
      popup.style.transform = 'translateY(100%)';
      setTimeout(function() {
          popup.style.display = 'none';
      }, 300);  // Wait for the transition to finish before hiding the popup
  }
});

document.getElementById('down_arrow').addEventListener('click', function() {
  var popup = document.getElementById('popup');
  // Check if the popup is visible
  if (popup.style.display === 'block') {
      // If so, collapse it
      popup.style.transform = 'translateY(100%)';
      setTimeout(function() {
          popup.style.display = 'none';
      }, 300);  // Wait for the transition to finish before hiding the popup
  }
});