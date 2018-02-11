let renderer, camera, scene, group;
const cameraRadius = 10;
let  mouseY = 0;
let particles = [];
let mouseX = 0;
let mouseXOnMouseDown = 0;

let targetRotation = 0;
let targetRotationOnMouseDown = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY  = window.innerHeight / 2;

const random = (min, max) => min + Math.random() * (max - min);
init();
animate();


function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  
  camera.position.z = 300;
  
  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  //create a light
  var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
  light.position.set( 0, 1, 0 );             //default; light shining from top
  light.castShadow = true;            // default false
  scene.add( light );

  //setup a shadow for the light
  
  light.shadow.mapSize.width = 512;  // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 500; 
  
  
  const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  
  for (let i = 0; i < boxGeometry.faces.length; i+=2) {
    let randomColor = Math.random() * 0xffffff;
    boxGeometry.faces[i].color.setHex( randomColor );
    boxGeometry.faces[i + 1].color.setHex(randomColor);
  }
  for(let i = 0; i < 800; i++) {
    let particle = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshBasicMaterial( { vertexColors : THREE.FaceColors, overdraw: 0.5 })
    );
    particle.castShadow = true;
    particle.recieveShadow = false;
    particle.position.x  = random(-800, 800);
    particle.position.y  = random(-800, 800);
    particle.position.z = random(-800 ,800);
    scene.add(particle);
    particles.push(particle);
  }
  
}

function render() {
  // camera.position.z += 2;
  // camera.position.x += 2;
  let cameraX = cameraRadius * Math.cos(Date.now() / 1000) * 100;
  let cameraY = cameraRadius * Math.sin(Date.now() / 1000) * 100;
 // console.log(cameraX, cameraY);
  camera.position.z = cameraX;
  camera.position.x = cameraY;
  
  particles.forEach(particle => {
    particle.position.x += cameraX * 0.004;
    particle.position.y += cameraY * 0.005;
    particle.rotation.y += cameraX * 0.00002;
    particle.rotation.x += cameraY * 0.00004;
    particle.rotation.z += cameraY * 0.00002;
    
  })
  
  
  
  
  camera.lookAt(scene.position);
  
  
  camera.rotation.y += targetRotation * 0.01
  //console.log(particle.position.x);
  
  
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  
}

function onMouseMove(event) {
  // do the roation calucation
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown) * 0.02;
  console.log(targetRotation);
}

function onMouseUp(event) {
  event.preventDefault();
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mousemove', onMouseMove);
}

function onMouseOut(event) {
  event.preventDefault();
  document.removeEventListener('mouseup', onMouseUp, false);
  document.removeEventListener('mousemove', onMouseMove, false);
  document.removeEventListener('mouseout', onMouseOut, false);
}
function onMouseDown(event) {
  // here we get the event
  event.preventDefault();
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mouseout', onMouseOut);
  mouseXOnMouseDown = event.clientX  - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
  
}
document.addEventListener('mousedown', onMouseDown);

