const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xc0c0c0, 1)

const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

// Global variables to set background
let start_position = 3;
let end_position = -3;

// Cube Function
function cubeFunc (dimension, positionX, rotateY, color = 0x00ff00) {
  const geometry = new THREE.BoxGeometry(dimension.w, dimension.h, dimension.d);
  const material = new THREE.MeshBasicMaterial( { color: color } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.x = positionX;
  cube.rotation.y = rotateY;
  scene.add( cube );
  return cube;
}

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

class Doll {
    constructor (){
    loader.load("../models/scene.gltf",(gltf)=> {
        scene.add( gltf.scene );
        gltf.scene.scale.set( .35, .35, .35 )
        gltf.scene.position.set(0, -1, 0)
        this.doll = gltf.scene;
    })
    }
    turnBack() {
        gsap.to(this.doll.rotation, {y: 3.11, duration: 1.5})
    }

    turnFront() {
        gsap.to(this.doll.rotation, {y: 0, duration: 1.5})
    }
}

function createTrack() {
    cubeFunc({w: start_position * 2 + .2, h: 1.5, d: 1}, 0, 0, 0xb7ffa2).position.z = -1;
    cubeFunc({w: .2, h: 1.5, d: 1}, start_position, -.35);
    cubeFunc({w: .2, h: 1.5, d: 1}, end_position, .35);
}
createTrack()

let doll = new Doll()
setTimeout(()=> {
    doll.turnBack()
}, 1000)

// Player block
class Player{
    constructor() {
      loader.load("../playermodel/scene.gltf",(gltf)=> {
        scene.add( gltf.scene );
        gltf.scene.scale.set( .01, .0099, .01 )
        gltf.scene.position.set(-4, -1, 1)
    })
    }
}

let player = new Player()
function animate() {
	renderer.render( scene, camera ); 
	requestAnimationFrame( animate );
}
animate();

window.addEventListener('resize', makeResponsive, false);

function makeResponsive () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}