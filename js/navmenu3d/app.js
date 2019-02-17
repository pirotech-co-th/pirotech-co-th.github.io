let currentTime = 0;
let oldTime = 0;
let deltaTime = 0;

let scene;
let camera;
let renderer;
let composer;

let trackballControl;

let edgeThickness = 0.8;
let nodeRadius = 4;
let frameRadius = 200;
let frameYPosition = 0;

let nodes = [];
let lables;

window.onload = function() {
	init ();

	lables = document.querySelector(".annotation").children;

	// var video = document.getElementById("myVideo");

	// // Get the button
	// var btn = document.getElementById("myBtn");

	// Pause and play the video, and change the button text
	// function myFunction() {
	// 	if (video.paused) {
	// 		video.play();
	// 		btn.innerHTML = "Pause";
	// 	} else {
	// 		video.pause();
	// 		btn.innerHTML = "Play";
	// 	}
	// }
};

function init () {

	oldTime = Date.now();

	createScene ();
	
	// document.addEventListener('mousemove', handleMouseMove, false);
	// window.addEventListener('deviceorientation', handleOrientation, true);

	requestAnimationFrame(loop);
}

function loop (timestamp, frame)
{
	currentTime =  Date.now();
	deltaTime = currentTime - oldTime;
	oldTime = currentTime;

	trackballControl.update();
	composer.render (0.01);
	
	for (let i = 0; i < nodes.length; i ++)
	{
		if (i == lables.length)
			break;

		let vector = nodes[i].position.clone().project (camera);
		
		projScreenMat = new THREE.Matrix4();
		projScreenMat.multiplyMatrices ( camera.projectionMatrix, nodes[i].matrixWorld );
		vector.applyMatrix4( projScreenMat );	

		vector.x = Math.round((0.5 + vector.x / 2) * (WIDTH));
		vector.y = Math.round((0.5 - vector.y / 2) * (HEIGHT));

		let annotation = lables[i];
		annotation.style.top = vector.y + 'px';
		annotation.style.left = vector.x + 'px';
	}

	requestAnimationFrame(loop);
}

function handleMouseMove(event)
{
	const tx = -1 + (event.clientX / WIDTH) * 2;
	const ty = 1 - (event.clientY / HEIGHT) * 2;
	mousePos = { x: tx, y: ty };
}

function handleWindowResize ()
{
	HEIGHT = document.getElementById ('container').clientHeight;
	WIDTH = document.getElementById ('container').clientWidth;

	renderer.setSize (WIDTH, HEIGHT);
	composer.setSize (WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix ();
}

function handleOrientation (evt)
{
	this.alpha = evt.alpha;
	this.beta = evt.beta;
	this.gamma = evt.gamma;

	const orientation =
	{
		alpha: evt.alpha,
		beta: evt.beta,
		gamma: evt.gamma,
	};
}

function createScene ()
{
	HEIGHT = document.getElementById ('container').clientHeight;
	WIDTH = document.getElementById ('container').clientWidth;

	renderer = new THREE.WebGLRenderer (
		{
			alpha: true,
			antialias: true
		}
	);

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera ( WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 1000 );
	
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 500;

	camera.lookAt(new THREE.Vector3(0, 0 ,0));

	scene.add (camera);

	// create Icosahedron
	//

	let frame = new THREE.Object3D ();

	let frameGeometry = new THREE.IcosahedronGeometry(frameRadius, 1);

	const frameMaterial = new THREE.MeshBasicMaterial ( {
		color: 0xffffff, opacity: 0.70
	} );

	frameMaterial.transparent = true;

	var edgesGeometry = new THREE.EdgesGeometry (frameGeometry);

	for (var i = 0; i < edgesGeometry.attributes.position.count - 1; i += 2)
	{
		var startPoint = new THREE.Vector3(
			edgesGeometry.attributes.position.array[i * 3 + 0],
			edgesGeometry.attributes.position.array[i * 3 + 1],
			edgesGeometry.attributes.position.array[i * 3 + 2]
		);

		var endPoint = new THREE.Vector3(
			edgesGeometry.attributes.position.array[i * 3 + 3],
			edgesGeometry.attributes.position.array[i * 3 + 4],
			edgesGeometry.attributes.position.array[i * 3 + 5]
		);

		var cylinderLength = new THREE.Vector3().subVectors(endPoint, startPoint).length();
		var cylinderGeom = new THREE.CylinderBufferGeometry(edgeThickness, edgeThickness, cylinderLength, 16);
		cylinderGeom.translate (0, cylinderLength / 2, 0);
		cylinderGeom.rotateX (Math.PI / 2);
		var cylinder = new THREE.Mesh (cylinderGeom, frameMaterial);
		cylinder.position.copy (startPoint);
		cylinder.lookAt (endPoint);
		frame.add(cylinder);
	}

	//
	//
	var geometry = new THREE.IcosahedronGeometry (frameRadius, 1);
	var material = new THREE.MeshBasicMaterial ({
		color: 0xff0000, opacity: 0.75
	});

	material.transparent = true;

	for (var i = 0, l = geometry.vertices.length; i < l; ++i)
	{
		let tmp = new THREE.Object3D().add ( 
			new THREE.Mesh(new THREE.IcosahedronGeometry(nodeRadius, 2), material)
		);
		
		tmp.position.copy(geometry.vertices[i]);
		frame.add(tmp);

		nodes.push (tmp);
	}

	frame.position.y = frameYPosition;

	scene.add (frame);

	// texture = new THREE.VideoTexture( video );

	renderer.setClearColor (0x000000, 0);  
	renderer.setSize (WIDTH, HEIGHT);
	  
	const renderPass = new THREE.RenderPass(scene, camera);
	
	const copyShader = new THREE.ShaderPass(THREE.CopyShader);
	copyShader.renderToScreen = true;

	composer = new THREE.EffectComposer(renderer);
	composer.addPass(renderPass);
	composer.addPass(copyShader);
  
	container = document.getElementById('container');
	container.appendChild(renderer.domElement);
  
	window.addEventListener('resize', handleWindowResize, false);

	trackballControl = new THREE.RotateControl (frame, renderer.domElement);
	trackballControl.noZoom = true;
	trackballControl.rotateSpeed = 1.0;
}