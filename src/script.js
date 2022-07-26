import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { MeshStandardMaterial } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(4, 4);
grassAmbientOcclusionTexture.repeat.set(4, 4);
grassNormalTexture.repeat.set(4, 4);
grassRoughnessTexture.repeat.set(4, 4);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
/**
 * House
 */
// House Group

const house = new THREE.Group();
scene.add(house);

// Walls
const wallWidth = 6;
const wallLength = 4;
const wallHeight = 2.5;

const wallMaterial = new MeshStandardMaterial({
  map: bricksColorTexture,
  aoMap: bricksAmbientOcclusionTexture,
  normalMap: bricksNormalTexture,
  roughnessMap: bricksRoughnessTexture,
});
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(wallLength, wallHeight, wallWidth),
  wallMaterial
);
wall.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
);
wall.position.y = 2.5 * 0.5;
house.add(wall);

// RoofTop
const roofTopGeometry = new THREE.CylinderGeometry(
  (Math.sqrt(3) / 3) * 4,
  (Math.sqrt(3) / 3) * 4,
  6,
  3,
  1,
  false
);
const roofTop = new THREE.Mesh(roofTopGeometry, wallMaterial);

roofTop.rotation.x = -Math.PI * 0.5;
roofTop.position.y = 2.5 + 4 / (2 * Math.sqrt(3));

const roofTopEdgeGeometry = new THREE.BoxGeometry(5.15, 0.5, 6.1);
const roofTopEdgeMaterial = new MeshStandardMaterial({
  color: "#b35f45",
  wireframe: false,
});
const roofTopEdgeLeft = new THREE.Mesh(
  roofTopEdgeGeometry,
  roofTopEdgeMaterial
);

roofTopEdgeLeft.position.y = 0.25;
roofTopEdgeLeft.position.x = 2;

const pivotLeft = new THREE.Object3D();
pivotLeft.position.x = -2;
pivotLeft.position.y = 2.5;

pivotLeft.add(roofTopEdgeLeft);
pivotLeft.rotation.z = Math.PI / 3;

//Right edge
const roofTopEdgeRight = new THREE.Mesh(
  roofTopEdgeGeometry,
  roofTopEdgeMaterial
);

roofTopEdgeRight.position.y = -0.25;
roofTopEdgeRight.position.x = 2;

const pivotRight = new THREE.Object3D();
pivotRight.position.x = 2;
pivotRight.position.y = 2.5;

pivotRight.add(roofTopEdgeRight);
pivotRight.rotation.z = 2 * (Math.PI / 3);
house.add(pivotRight, pivotLeft);
//

//RooftopPoint
const roofTopPoint = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.168,
    0.168,
    6.1,
    3,
    1,
    false,
    (Math.PI * 2) / 3 + Math.PI,
    (Math.PI * 2) / 3
  ),
  roofTopEdgeMaterial
);
roofTopPoint.rotation.x = -Math.PI * 0.5;
roofTopPoint.position.y = 6.63;
gui.add(roofTopPoint.position, "y").min(6).max(10).step(0.001);
house.add(roofTopPoint);

gui.add(roofTopEdgeLeft.position, "y").min(-5).max(10).step(0.001);
house.add(roofTop);
//Door
const doorLength = 2;
const doorHeight = 2;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorLength, doorHeight, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.z = wallWidth * 0.5 + 0.01;
door.position.y = doorHeight * 0.45;

house.add(door);

//Door Slab
const doorSlab = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 2, 3),
  wallMaterial
);
house.add(doorSlab);

doorSlab.position.z = wallWidth * 0.5;
doorSlab.position.y = wallHeight;
doorSlab.rotation.z = -Math.PI * 0.5;
//

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

//Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, wallHeight - 0.4, 3.1);
house.add(doorLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 6;
camera.position.z = 10;

gui.add(camera.position, "x").min(-5).max(100).step(0.001);
gui.add(camera.position, "y").min(-5).max(100).step(0.001);
gui.add(camera.position, "z").min(-5).max(100).step(0.001);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
