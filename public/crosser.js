/*
 *
 *		This is a rewriting/remastering/remediation of Crosser (2000 a.c.e.)
 *		there is an accompanying file called "about.js" that contains a dev log
 *
 */

 //
 // global variables
 //

// defines one unit of movement, which is 32 pixels
const ONE_UNIT = 32;
// width and height of screen in pixels
const WIDTH = 448;
const HEIGHT = 548;

var tierra; // sprite, will need 3 images each 448 x 448
var carlosmoreno; // sprite, player character, minimum of 9 images
var cadaver; // sprite will need 1 mexico side
var gato1; // sprite, will need 2 on US side
var gato2; // sprite, will need 2 on US side
var waterLog; // sprite, flotsam & jetsam will need 1 top edge touches border from Mexico side
var llanta; // sprite will need 1 top edge touches bank on US side
var migraMan1; // sprite will need 3 [tom, dick, harry,] walking on banks
var migraMan2; // sprite
var migraMan3; // sprite
var migraSUV; // sprite, will need 1 on center of lane [xlt, gto, exp] currently have wrong art. facing wrong direction. may not have art
var migraHelo1; // sprite, will need 2 [huey, bell, airwolf]
var migraHelo2; // sprite
var laMigra; // group, it may be better to call this opponents or hazards because they include flotsam
var visa; // sprite, goal

var img; // a temporary placeholder to preload images for sprites
var img1; // temp placeholder to preload images for sprites
var img2; // temp placeholder to preload images for sprites

var spriteCounter = 0; // used in draw loop, along with modulo, to update and draw one sprite per frame.
												// will give background image it's own turn since it is a sprite indexed 0
												//will potentiall cause draw loop to speed up as sprites are removed from list

var BUGGY = true; // boolean, debug flag, used for debug feature of P5.Play.JS

var START = false; // to use for button SNES maybe need a reSTART
//var SELECT = false; // use button for SNES
//var shoulderLeft = false; // unused button for SNES
//var shoulderRight = false; // unused button for SNES
//var GAMEOVER = false; // may not be best option because a gameover state isn't really what we do
var moveLeft = false; // boolean, used for player character interaction map to dPad
var moveRight = false; // boolean
var moveUp = false; // boolean
var moveDown = false; // boolean
var dPad; // sprite, container for d pad image, used for touch interaction
var start; // sprite, container for start button image

var gamestate = "startup"; // string variable should only contain 'startup','play','win','lose'

// queue to render things, they'll be drawn in this order so it's important
// to have the order we want. This order will be handled in preload
let renderQueue = [];

// this defines the time to spend on changing the animation and rendering for 
// each character, the fast this is, the faster the game will move
let renderTime = .25; 

// indicates where we are in the render queue
let currentIndex = null; 

// timestamp for our indexing into the queue
let timeStamp = 0;

/**
 * Calculates the new index from the current one
 * @param {The current index} idx 
 */
function getNextIndex(queue, idx, timing) {
	// get the time in seconds, with subsecond accuracy
	const seconds = millis() / 1000;
	const len = queue.length;
	
	if (seconds > timeStamp)
	{
		// first, update our timeStamp to be in the future
		timeStamp = seconds + timing; 
		if (len > 0) {
			return (idx + 1) % len;
		} else {
			console.error('queue length is 0, you probably forgot to add things to it');
			return idx;
		}
	} else {
		return idx;
	}
}

// this takes a rendering queue and updates positions based on how much
// time has elapsed at this point in the game
function updateRendering(queue, timing) {
	// calculate the next index
	const nextIdx = getNextIndex(queue, currentIndex, timing);

	// if the index hasn't changed, then we're really done at this point
	if (nextIdx !== currentIndex)
	{
		// update our index
		currentIndex = nextIdx;
		// now update the sprite
		updateSprite(queue[currentIndex])
	}
}

/**
 * updateSprite figures out which way a sprite is moving and where to draw it
 */
function updateSprite(sprite) {
	console.log('updating ' + sprite.name);

	switch (sprite.movementDir) {
		case 'left':
			sprite.position.x = sprite.position.x - sprite.speed;
			// wrap around on the x-axis
			if (sprite.position.x < 0) {
				sprite.position.x = WIDTH;
			}
			break;
		case 'right':
			// wrap on the x-axis
			sprite.position.x = sprite.position.x + sprite.speed;
			if (sprite.position.x > WIDTH) {
				sprite.position.x = 0;
			}
			break;
		case 'up':
			sprite.position.y = sprite.position.y - sprite.speed;
			break;
		case 'down':
			sprite.position.y = sprite.position.y + sprite.speed;
			break;
		default:
			console.error('movementDir is undefined as \'' + sprite.movementDir + '\'');
			break;
	}
}

function preload() {
	timeStamp = millis() / 1000 + renderTime;

	if (BUGGY){
	  img = loadImage('img/frontera-2grid.png'); // this image has a grid superimposed over the play field for development and debugging
	} else {
		img = loadImage('img/frontera-2.png');
	}
	img1 = loadImage('img/asarco.png'); // asarco.png is the splash/startup screen
	img2 = loadImage('img/the_end_2.png'); // the_end_2.png is the win screen
	tierra = createSprite(224,224); // tierra holds the background images
	tierra.addImage('frontera',img);
	tierra.addImage('asarco',img1);
	tierra.addImage('end',img2);
	

	img = loadImage('img/snes.png');
	dPad = createSprite(128,480); // dPad holds the image(s) that represent the game controller, used for mobile devices
	dPad.addImage(img);
/*
	img = loadImage ('img/start1.png');
	start = createSprite(180,500);
	start.addImage(img);
*/
	img = loadImage('img/carlos-moreno-3_09.png');
	carlosmoreno = createSprite(32*7+16,64*6+32); // carlosmoreno is the player character
	carlosmoreno.addImage('surprise',img);
	renderQueue.push(carlosmoreno); // add carlos to the queue, here we add the sprite
	carlosmoreno.name = 'carlosmoreno';

	img1 = loadImage('img/carlos-moreno-3_01.png');
	img2 = loadImage('img/carlos-moreno-3_02.png');
	carlosmoreno.addAnimation('walkdown',img1,img2); // may need to add or repeat anim frames for carlos
	//carlosmoreno.addImage('facedown',img1);

	img1 = loadImage('img/carlos-moreno-3_03.png');
	img2 = loadImage('img/carlos-moreno-3_04.png');
	carlosmoreno.addAnimation('walkup',img1,img2);
	//carlosmoreno.addImage('faceup',img1);

	img1 = loadImage('img/carlos-moreno-3_05.png');
	img2 = loadImage('img/carlos-moreno-3_06.png');
	carlosmoreno.addAnimation('walkright',img1,img2);
	//carlosmoreno.addImage('faceright',img1);

	img1 = loadImage('img/carlos-moreno-3_07.png');
	img2 = loadImage('img/carlos-moreno-3_08.png');
	carlosmoreno.addAnimation('walkleft',img1,img2);
	//carlosmoreno.addImage('faceleft',img1);

	img1 = loadImage('img/cadaverA.png');
	img2 = loadImage('img/cadaverB.png');
	cadaver = createSprite(32*1, 16*22);
	cadaver.addAnimation('float',img1,img1,img1,img2,img1,img2);
	cadaver.setDefaultCollider();
	cadaver.movementDir = 'right';
	cadaver.speed = 32;
	// add the cadaver to the queue
	renderQueue.push(cadaver);
	cadaver.name = 'cadaver';


	img1 = loadImage('img/waterlogA.png');
	img2 = loadImage('img/waterlogB.png');
	waterLog = createSprite(384,16*20+8);
	waterLog.addAnimation('float',img1,img1,img2,img2);
	waterLog.setCollider('rectangle',0,16,64,32);
	waterLog.movementDir = 'right';
	waterLog.speed = 32;
	// add waterlog to the queue
	renderQueue.push(waterLog);
	waterLog.name = 'waterlog';

	img1 = loadImage('img/gatoA.png');
	img2 = loadImage('img/gatoB.png');
	gato1 = createSprite(32*2+16,16*18);
	gato1.addAnimation('float',img1,img1,img2);
	gato1.setDefaultCollider();

	gato1.movementDir = 'right';
	gato1.speed = 32;
	// add gato1 to the queue
	renderQueue.push(gato1);
	gato1.name = 'gato1';

	gato2 = createSprite(32*7+16,16*18);
	gato2.addAnimation('float',img2,img2,img1);
	gato2.setDefaultCollider();
	gato2.movementDir = 'right';
	gato2.speed = 32;
	// add gato1 to the queue
	renderQueue.push(gato2);
	gato2.name = 'gato2';

	img1 = loadImage('img/waterlogA.png');
	img2 = loadImage('img/waterlogB.png');
	waterLog = createSprite(32*8,16*20+8);
	waterLog.addAnimation('float',img1,img1,img2,img2);
	waterLog.setCollider('rectangle',0,16,64,32);

	img1 = loadImage('img/llantaA.png');
	img2 = loadImage('img/llantaB.png');
	llanta = createSprite(64*3,16*18);
	llanta.addAnimation('float',img1,img1,img1,img2,img2,img2);
	llanta.movementDir = 'right';
	llanta.speed = 32;
	llanta.setDefaultCollider();
	// added the tire to the queue
	renderQueue.push(llanta);
	llanta.name = 'llanta';

	img1 = loadImage('img/migraman_1.png');
	img2 = loadImage('img/migraman_2.png');
	migraMan1 = createSprite(32*2+16,16*14);
	migraMan1.addAnimation('marchright',img1,img2,img2,img1);
	migraMan1.setDefaultCollider();

	migraMan1.movementDir = 'right';
	migraMan1.speed = 32;
	// migra hombre 1
	renderQueue.push(migraMan1);
	migraMan1.name = 'migraHombre1';

  migraMan2 = createSprite(32*7+16,16*14);  
  migraMan2.addAnimation('marchright',img1,img1,img2,img2);
	migraMan2.setDefaultCollider();
	migraMan2.movementDir = 'right';
	migraMan2.speed = 32;
	// migra hombre 2
	renderQueue.push(migraMan2);
	migraMan2.name = 'migraHombre2';

	migraMan3 = createSprite(32*9,16*14)
	migraMan3.addAnimation('marchright',img2,img2,img1,img1);
	migraMan3.setDefaultCollider();
	migraMan3.movementDir = 'right';
	migraMan3.speed = 32;
	// migra hombre 3
	renderQueue.push(migraMan3);
	migraMan3.name = 'migraHombre3';

	img1 = loadImage('img/migra_car-1.png');
	img2 = loadImage('img/migra_car-2.png');
	migraSUV = createSprite(64,32*5);
	migraSUV.addAnimation('drive',img1,img2,img1);
	migraSUV.mirrorX(-1);
	migraSUV.setDefaultCollider();
	migraSUV.movementDir = 'left';
	migraSUV.speed = 32;
	// added migra SUV to the queue
	renderQueue.push(migraSUV);
	migraSUV.name = 'migraSUV';

	img1 = loadImage('img/migra_helo-1.png');
	img2 = loadImage('img/migra_helo-2.png');
	migraHelo1 = createSprite(32*5,32*3);
	migraHelo1.addAnimation('fly',img1,img2,img2,img1,img2);
	migraHelo1.setDefaultCollider();

	migraHelo1.movementDir = 'left';
	migraHelo1.speed = 32;
	// added migra heli 1 to the queue
	renderQueue.push(migraHelo1);
	migraHelo1.name = 'migraHeli1';

	migraHelo2 = createSprite(32*9,32*3);
	migraHelo2.addAnimation('fly',img1,img2,img1,img2,img2);
	migraHelo2.setDefaultCollider();
	migraHelo2.movementDir = 'left';
	migraHelo2.speed = 32;
	// added migra heli 2 to the queue
	renderQueue.push(migraHelo2);
	migraHelo2.name = 'migraHeli2';
	
	img = loadImage('img/visa.png');
	visa = createSprite(32*5+16,16);
	visa.addImage('visa',img);
	visa.setDefaultCollider();
} // end preload

function setup() {
	createCanvas(448, 548);
	frameRate(20); // tried as slow as 1fps
	background(255);

	tierra.changeImage('frontera'); // this image should change to 'asarco' to default to gamestate='startup'

	carlosmoreno.debug = BUGGY;
	cadaver.debug = BUGGY;
	waterLog.debug = BUGGY;
	gato1.debug = BUGGY;
	gato2.debug = BUGGY;
	llanta.debug = BUGGY;
	migraMan1.debug = BUGGY;
	migraMan2.debug = BUGGY;
	migraMan3.debug = BUGGY;
	migraSUV.debug = BUGGY;
	migraHelo1.debug = BUGGY;
	migraHelo2.debug = BUGGY;
	visa.debug = BUGGY;

	/* 
	// Don't need velocity so we can implement chunky movement
	cadaver.setVelocity(0.25,0);
	waterLog.setVelocity(0.25,0);
	gato1.setVelocity(0.3,0);
	gato2.setVelocity(0.3,0);
	llanta.setVelocity(0.3,0);
	migraMan1.setVelocity(0.5,0);
	migraMan2.setVelocity(0.5,0);
	migraMan3.setVelocity(0.5,0);
	migraSUV.setVelocity(-0.5,0);
	migraHelo1.setVelocity(-0.75,0);
	migraHelo2.setVelocity(-0.75,0);
	*/

	laMigra = new Group();
	laMigra.add(cadaver);
	laMigra.add(waterLog);
	laMigra.add(gato1);
	laMigra.add(gato2);
	laMigra.add(llanta);
	laMigra.add(migraMan1);
	laMigra.add(migraMan2);
	laMigra.add(migraMan3);
	laMigra.add(migraSUV);
	laMigra.add(migraHelo1);
	laMigra.add(migraHelo2);

	//carlosmoreno.changeImage('facedown');
	noCursor(); // testing cursor manipulation
	// cursor(HAND); // HAND, ARROW, CROSS, MOVE, TEXT, WAIT
} // end setup

function draw() {
	background(255);

	/*
	if (cadaver.position.x > 448){ // using absolute width of 448. will be good to change to abstract "width" for remastering at higher resolutions
		cadaver.position.x = 0;
	}
	if (waterLog.position.x > 448){
		waterLog.position.x = 0;
	}
	if (gato1.position.x > 448){
		gato1.position.x = 0;
	}
	if (gato2.position.x > 448){
		gato2.position.x = 0;
	}
	if (llanta.position.x > 448){
		llanta.position.x = 0;
	}
	if (migraMan1.position.x > 448){
		migraMan1.position.x = 0;
	}
	if (migraMan2.position.x > 448){
		migraMan2.position.x = 0;
	}
	if (migraMan3.position.x > 448){
		migraMan3.position.x = 0;
	}
	if (migraSUV.position.x  < 0){
		migraSUV.position.x = 448;
	}
	if (migraHelo1.position.x < 0){
		migraHelo1.position.x = 448;
	}
	if (migraHelo2.position.x < 0){
		migraHelo2.position.x = 448;
	}
	*/

	if (moveUp){
		carlosmoreno.changeAnimation ('walkup');
		//carlosmoreno.velocity.y = -1;
		carlosmoreno.position.y = carlosmoreno.position.y - 32;
		moveUp = false;
		//carlosmoreno.changeImage ('faceup');
	}
	else if (moveDown){
		carlosmoreno.changeAnimation ('walkdown');
		//carlosmoreno.velocity.y = 1;
		carlosmoreno.position.y = carlosmoreno.position.y + 32;
		moveDown = false;
		//carlosmoreno.changeImage ('facedown');
	}
	else if (moveLeft){
		carlosmoreno.changeAnimation ('walkleft');
		//carlosmoreno.velocity.x = -1;
		carlosmoreno.position.x = carlosmoreno.position.x - 32;
		moveLeft = false;
		//carlosmoreno.changeImage ('faceleft');
	}
	else if (moveRight){
		carlosmoreno.changeAnimation ('walkright');
		//carlosmoreno.velocity.x = 1;
		carlosmoreno.position.x = carlosmoreno.position.x + 32;
		moveRight = false;
		//carlosmoreno.changeImage ('faceright');
	}
	//else {
		//carlosmoreno.changeAnimation ('facedown');
		//carlosmoreno.velocity.x = 0;
		//carlosmoreno.velocity.y = 0;
	//}

	if (carlosmoreno.overlap(laMigra)){ // am setting la migra group members velocity to 0 as a temporary response
		migraMan1.velocity.x = 0;
		migraMan2.velocity.x = 0;
		migraMan3.velocity.x = 0;
		migraSUV.velocity.x = 0;
		migraHelo1.velocity.x = 0;
		migraHelo2.velocity.x = 0;
		cadaver.velocity.x = 0;
		waterLog.velocity.x = 0;
		gato1.velocity.x = 0;
		gato2.velocity.x = 0;
		llanta.velocity.x = 0;
		// laMigra.velocity.x = 0; // this doesn't work
		carlosmoreno.changeAnimation ('surprise');
		carlosmoreno.position.x = 224+16; // next lines added to create a 'startup' condition
		carlosmoreno.position.y = 64*6+32;
/*		carlosmoreno.changeAnimation ('walkdown'); // this happens too fast
		migraMan1.setVelocity(0.5,0);
		migraMan2.setVelocity(0.5,0);
		migraMan3.setVelocity(0.5,0);
		migraSUV.setVelocity(-0.5,0);
		migraHelo1.setVelocity(-0.75,0);
		migraHelo2.setVelocity(-0.75,0);
		cadaver.setVelocity(0.25,0);
		waterLog.setVelocity(0.25,0);
		gato1.setVelocity(0.3,0);
		gato2.setVelocity(0.3,0);
		llanta.setVelocity(0.3,0); */

	}
	if (carlosmoreno.overlap(visa)){ // make all the moving sprites disappear
		cadaver.visible = false;
		waterLog.visible = false;
		gato1.visible = false;
		gato2.visible = false;
		llanta.visible = false;
		migraMan1.visible = false;
		migraMan2.visible = false;
		migraMan3.visible = false;
		migraSUV.visible = false;
		migraHelo1.visible = false;
		migraHelo2.visible = false;
		visa.visible = false;
		carlosmoreno.visible = false;
		tierra.changeImage('end');
	}
	/* experimental update single sprite at a time
	for(var i = 0; i<allSprites.size(); i++)
  {
    allSprites.get(i).update();
		// some delay function here
		allSprites.get(i).drawSprite;
  }
	*/
	/* // experimental code not working 2019 06 14
	// experimental code based on surfacing above snippet which is a part of P5JS Play library
	let i = spriteCounter%allSprites.length
	allSprites[i].update();
	allSprites[i].draw();
	spriteCounter = spriteCounter + 1;
	// end experimental code
	*/

	// experimental code for gamepad
	let pads = navigator.getGamepads(); // this samples the gamepad once per frame and is core HTML5/JavaScript
	let pad0 = pads[0]; // limit to first pad connected
	if (pad0) { // this is an unfamiliar construction I think it test that pad0 is not null
		updateStatus(pad0); // will need an updateStatus() function
	} else { // what to do if pad0 is null, which is to say there is no gamepad connected
		// use keyboard
		// or use touches

	}

	// update what we're rendering and how frequently
	updateRendering(renderQueue, renderTime);
	drawSprites();
} // end draw loop

function updateStatus(pad){ // tested once per frame
	if (pad.axes[0] === -1){ moveLeft = true;} else { moveLeft = false; }
	if (pad.axes[0] ===  1){ moveRight = true;} else { moveRight = false; }
	if (pad.axes[1] === -1){ moveUp = true;} else { moveUp = false; }
	if (pad.axes[1] ===  1){ moveDown = true;} else { moveDown = false; }
	if (pad.buttons[0].value > 0){}
	if (pad.buttons[0].value < 1){ console.log(pad.buttons); print('NES B button pressed'); }
	if (pad.buttons[1].value > 0){}
	if (pad.buttons[1].value < 1){ print('NES A button pressed'); }
	if (pad.buttons[8].value > 0){}
	if (pad.buttons[8].value < 1){ print('NES Select pressed'); }
	if (pad.buttons[9].value > 0){}
	if (pad.buttons[9].value < 1){ print('NES Start pressed'); }
	return;
}

function keyTyped(){ // tested once per frame, triggered on keystroke
	if        (keyCode === '38' || //keyDown(UP_ARROW) || // arrow keys are not responding, also poorly documented
		         key === 'w'          ||
		         key === 'W'          ||
		         key === 'i'          ||
		         key === 'I') {
		print('key up');
		moveUp = true;
	} else if (keyCode === '40' || //keyCode === 'ArrowDown'  ||
		         key === 's'            ||
		         key === 'S'            ||
		         key === 'k'            ||
		         key === 'K') {
    print('key down');
		moveDown = true;
	} else if (keyCode === '37' || //key === 'ArrowLeft'  ||
	           key === 'a'            ||
		         key === 'A'            ||
		         key === 'j'            ||
		         key === 'J') {
		print('key left');
		moveLeft = true;
	} else if (keyCode === '39' || //key === 'ArrowRight'  ||
		         key === 'd'             ||
		         key === 'D'             ||
		         key === 'l'             ||
		         key === 'L') {
		print('key right');
		moveRight = true;
	} else if (key === 't'  ||
						 key === 'T') {
	  print('t');
		START = true;
	} else if (key === 'y') {
		print('y');
	}
	return false;

} // end keyTyped

function touchStarted(){

	// touch controller
	// poorly documented overview says touchX and touchY are analagous to mouseX and mouseY
	// buried in a github page, not the friendly public facing p5js.org
	// test on openprocessing yields an error treating touchX and touchY as undefined variables
	// touch functionality seems to have broken on 2019 06 04 after adding cadaver and other assets
	/*
	d pad sprite is currently 96 x 96 pixels. 3 x 32 X 3 x 32
	sprite center will be 48 x 48
	controller origin top left corner (conX,conY)
	d pad button edges can be a multiple of the offsets offX and offY
	*/
	let conX = 0;
	let conY = 448;
	let offX = 32;
	let offY = 32;
	print('touch started');
	if ( conX + offX < mouseX && mouseX < conX + 2 * offX && conY < mouseY && mouseY < conY + offY ){
	//if ( 32 < mouseX && mouseX < 64 && 0 < mouseY && mouseY < 32 ){
	//if ( 32 < touchX && touchX < 64 && 0 < touchY && touchY < 32 ){
		print('touch up');
		moveUp = true;
	}
	if ( conX + offX < mouseX && mouseX < conX + 2 * offX && conY + 2 * offY < mouseY && mouseY < conY + 3 * offY ){
	//if ( 32 < mouseX && mouseX < 64 && 64 < mouseY && mouseY < 96 ){
		print('touch down');
		moveDown = true;
	}
	if ( conX < mouseX && mouseX < conX + offX && conY + offY < mouseY && mouseY < conY + 2 * offY ){
	//if ( 0 < mouseX && mouseX < 32 && 32 < mouseY && mouseY < 64 ){
		print('touch left');
		moveLeft = true;
	}
	if ( conX + 2 * offX < mouseX && mouseX < conX + 3 * offX && conY + offY < mouseY && mouseY < conY + 2 * offY ){
	//if ( 64 < mouseX && mouseX < 96 && 32 < mouseY && mouseY < 64 ){
		print('touch right');
		moveRight = true;
	}
	return false;
} // end touchStarted
