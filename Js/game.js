const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xc0c0c0, 1)

const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

// Global variables
let start_position = 3;
let end_position = -3;
let text = document.querySelector('#message');
const game_LIMIT = 15;
let gameStatus = 'loading';
let dollPositionBackward = true;

init()
// Initializing Doll
async function init() {
    await delay(800)
    text.innerText = 'All players in position'
    await delay(1000)
    text.innerText = 'Game starting in 3'
    await delay(1000)
    text.innerText = 'Game starting in 2'
    await delay(1000)
    text.innerText = 'Game starting in 1'
    await delay(300)
    text.innerText = 'Ready'
    await delay(800)
    text.innerHTML = `<p style='font-size: 25px'>Press the ArrowUp key to move player</p>`
    await delay(3300)
    text.innerHTML = `<p style='font-size: 25px'>Move only when the Doll is looking backward to avoid being eliminated</p>`
    await delay(3300)
    text.innerHTML = `<p style='font-size: 25px'>Move from the first end to the other end to qualify for the next game</p>`
    await delay(3300)
    text.innerText = 'You only have 10seconds!!!'
    await delay(900)
    text.innerText = 'Start!!!'
    startGame()
}

// Starting the game
function startGame() {
    gameStatus = 'started'
    let progress = cubeFunc({w: 5, h: .1, d: 1}, 0, 0, 0xffbaaf)
    progress.position.y = 3.4;
    gsap.to(progress.scale, {x: 0, duration: game_LIMIT, ease: 'none'});
    doll.startDoll();
    setTimeout(async()=> {
        if (gameStatus != 'over') {
            text.innerHTML = '<p style="color: red;">Time Up, Player Eliminated!!!</p>'
            gameStatus = 'over'
            await delay(3000)
            window.location.reload()
        }
    }, game_LIMIT * 1000)
}

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

// Set timer for doll functionality 
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
class Doll {
    constructor (){
    loader.load("../models/scene.gltf",(gltf)=> {
        scene.add( gltf.scene );
        gltf.scene.scale.set( .3, .3, .3 )
        gltf.scene.position.set(0, 0, 0)
        this.doll = gltf.scene;
    })
    }
    async startDoll() {
        this.turnBack()
        await delay((Math.random() * 1000) + 1300)
        this.turnFront()
        await delay((Math.random() * 1000) + 2000)
        this.startDoll()
    }
    turnBack() {
        gsap.to(this.doll.rotation, {y: 3.11, duration: 1.5})
        setTimeout(()=> dollPositionBackward = true, 500)
    }

    turnFront() {
        gsap.to(this.doll.rotation, {y: 0, duration: 1.5})
        setTimeout(()=> dollPositionBackward = false, 1000)
    }
}

function createTrack() {
    cubeFunc({w: start_position * 2 + .2, h: 1.5, d: 1}, 0, 0, 0xb7ffa2).position.z = -1;
    cubeFunc({w: .2, h: 1.5, d: 1}, start_position, -.35);
    cubeFunc({w: .2, h: 1.5, d: 1}, end_position, .35);
}
createTrack()

// Intializing a Doll class
let doll = new Doll()

// Player block
class Player{
    constructor() {
      loader.load("../playermodel/scene.gltf",(gltf)=> {
        scene.add( gltf.scene );
        gltf.scene.scale.set( .01, .0099, .01 )
        gltf.scene.position.x = start_position
        gltf.scene.position.y = -1.789
        gltf.scene.position.z = 1
        gltf.scene.rotation.y = -2.01234565
        this.player = gltf.scene
        this.playerInfo = {
            velocity: 0,
            positionX: start_position
        }
    })
    }
 // RUN functions 
    run() {
        this.playerInfo.velocity = .03
    }
    stop() {
        gsap.to(this.playerInfo, {velocity: 0, duration: 1})
    }
    async check() {
        if(this.playerInfo.velocity > 0 && !dollPositionBackward) {
            text.innerHTML = '<h1 style="color: red;">Player Eliminated!!!<h1>'
            gameStatus = 'over'
            await delay(3000)
            window.location.reload()
        }
        if(this.playerInfo.positionX < end_position) {
            text.innerHTML = '<h1 style="color: green;">Player Passed!!!<h1>'
            gameStatus = 'over'
            await delay(3000)
            window.location.reload()
        }
    }
    update() {
      if (this.playerInfo) {
        this.check()
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
      }
    }
}


let player = new Player()
function animate() {
    if (gameStatus == 'over') return
	renderer.render( scene, camera ); 
	requestAnimationFrame( animate );
    player.update()
}
animate();

// Control player movement with arrow up key
window.addEventListener('keydown', (e)=> {
    if (gameStatus != 'started') return
    if (e.key == 'ArrowUp'){
        player.run()
    }
})
window.addEventListener('keyup', (e)=> {
    if (gameStatus != 'started') return
    if (e.key == 'ArrowUp'){
        player.stop()
    }
})

window.addEventListener('resize', makeResponsive, false);

function makeResponsive () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
