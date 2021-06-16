import * as THREE from 'three';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import { camera, scene, renderer, orbit,loadingManager,clock, scrinit, resize } from './utilities/scr';
import Helvetica from './../fonts/helvetiker_bold.typeface.json';
import matCap8 from './../images/matcaps/8.png';

let  cursor,material,text;

let fontLoader = new THREE.FontLoader();
let textureLoader = new THREE.TextureLoader();

let font = fontLoader.parse(Helvetica);
const textGeometry = new THREE.TextGeometry( 'Ajmal Mohad', {
	font: font,
	size: 0.5,
	height: 0.2,
	curveSegments: 5,
	bevelEnabled: true,
	bevelThickness: 0.03,
	bevelSize: 0.02,
	bevelOffset: 0,
	bevelSegments: 4
} );

let textMatCapTexture = textureLoader.load(matCap8);

init();
animate();

function init() {
	//Init Scene Camera Renderer with orbit controls.
	scrinit("controls");

	//Cursor
	cursor = { x: 0, y: 0 }

	//GUI
	const gui = new dat.GUI()

	//Mesh
	material = new THREE.MeshMatcapMaterial({
		matcap:textMatCapTexture
	});

	//Group
	let mainGroup = new THREE.Group();

	textGeometry.center();
	text = new THREE.Mesh(
		textGeometry,
		material
	)
	mainGroup.add(text);

	let donutgeometry = new THREE.TorusBufferGeometry(0.3,0.2,20,45);

	for (let i = 0; i < 200; i++) {
		let donut = new THREE.Mesh(
			donutgeometry,
			material
		);
		mainGroup.add(donut)
		donut.position.x = (Math.random() - 0.5)*40;
		donut.position.y = (Math.random() - 0.5)*20;
		donut.position.z = (Math.random() - 1.2)*10;
		donut.rotation.x = Math.PI*Math.random();
		donut.rotation.y = Math.PI*Math.random();
		const scale = Math.random() + 0.5;
		donut.scale.set(scale,scale,scale);
	}
	
	scene.add(mainGroup)
	gui.add(mainGroup.rotation,'x').min(0).max(Math.PI).step(0.01);
	gui.add(mainGroup.rotation,'y').min(0).max(Math.PI).step(0.01);
	gui.add(mainGroup.rotation,'z').min(0).max(Math.PI).step(0.01);
	gui.add(mainGroup.position,'x').min(-5).max(5).step(0.01);
	gui.add(mainGroup.position,'y').min(-5).max(5).step(0.01);
	gui.add(mainGroup.position,'z').min(-5).max(5).step(0.01);
}

function animate() {
	const elapsedTime = clock.getElapsedTime();
	orbit.update();


	//All Logic above this
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function handleMousemove(e) {
	cursor.x = e.clientX / window.innerWidth - 0.5;
	cursor.y = -(e.clientY / window.innerHeight - 0.5);
}

function fullScreenhandler() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.body.requestFullscreen();
	}
}

//Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', handleMousemove);
window.addEventListener('dblclick', fullScreenhandler);
