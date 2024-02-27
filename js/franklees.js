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

let imageUrl = 'franklees/avo.jpg'

let objToRender = 'underwear';

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

let currentModel = { modelName: 'underwear.gltf', objectName1: 'underwear_1', objectName2: 'underwear_2' };

document.getElementById('underwear').addEventListener('click', function() {
    loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2, true);
});

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

        loader.load(`franklees/${modelName}`, function (gltf) {
            if (object) {
                scene.remove(object);
            }

            object = gltf.scene;
            scene.add(object);

            try {
                if (selectedTexture) {
                    let texture = new THREE.TextureLoader().load(selectedTexture);
                    let material = new THREE.MeshStandardMaterial({map: texture});
                    material.metalness = 0.3;
                    material.roughness = 0.8;
                    object.getObjectByName(objectName2).material = material;
                }
            } catch (error) {
                console.error('Error setting material:', error);
            }

            document.getElementById('loading').style.display = 'none';
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }, function (error) {
            console.error('Error loading model:', error);
            document.getElementById('loading').style.display = 'none';
        });
    });
}

loadTextureAndModel(currentModel.modelName, currentModel.objectName1, currentModel.objectName2);



const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; 
slider.oninput = function() {
    output.innerHTML = this.value; 
    if (texture) {
        texture.repeat.set(this.value, this.value); 
    }
}

camera.position.z = objToRender === "underwear" ? 60 : 500;

const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(500, 500, 500); 
topLight.castShadow = true;
scene.add(topLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1); 
backLight.position.set(-500, -500, -500);
backLight.castShadow = true;
scene.add(backLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "underwear" ? 2 : 1);
scene.add(ambientLight);

if (objToRender === "underwear") {
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

var textures = ['franklees/animal.jpg','franklees/avo.jpg','franklees/blue.jpg','franklees/cammo.jpg','franklees/flamingo.jpg','franklees/pelican.jpg','franklees/pizzawine.jpg','franklees/print.jpg','franklees/zebra.jpg'];
var selectedTexture = null;

textures.forEach(function(texture) {
    var button = document.createElement("button");
    button.className = "texture-button";
    button.style.backgroundImage = `url(${texture})`;
    button.addEventListener("click", function() {
        selectTexture(texture);
    });
    document.getElementById("texture-buttons").appendChild(button);
});

// Add an event listener for the file input
document.getElementById('imageUpload').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var imageUrl = event.target.result;
        selectTexture(imageUrl);
    };
    reader.readAsDataURL(file);
});

function selectTexture(textureUrl) {
    selectedTexture = textureUrl;
    textureLoader.load(selectedTexture, function(loadedTexture) {
        texture = loadedTexture;
        texture.flipY = false;
        var scale = slider.value;
        texture.repeat.set(scale, scale);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        let material = new THREE.MeshStandardMaterial({map: texture});
        material.metalness = 0.3;
        material.roughness = 0.8;
        object.getObjectByName(currentModel.objectName2).material = material;
    });
}

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

  document.getElementById('toggleAnimation').addEventListener('click', function() {
    isAnimationEnabled = !isAnimationEnabled;
  
    if (isAnimationEnabled) {
      controls.enabled = false;
    } else {
      controls.enabled = true;
    }
  });