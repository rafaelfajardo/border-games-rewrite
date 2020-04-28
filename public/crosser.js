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
const HEIGHT = 448;

var tierra; // sprite, will need 3 images each 448 x 448
var carlosmoreno; // sprite, player character, minimum of 9 images
var cadaver; // sprite will need 1 mexico side
var gato1; // sprite, will need 2 on US side
var gato2; // sprite, will need 2 on US side
var waterLog; // sprite, flotsam & jetsam will need 1 top edge touches border from Mexico side
var llanta; // sprite will need 1 top edge touches bank on US side
var migraMan2; // sprite will need 3 [tom, dick, harry,] walking on banks
var migraMan1; // sprite
var migraSUV; // sprite, will need 1 on center of lane [xlt, gto, exp] currently have wrong art. facing wrong direction. may not have art
var migraHelo1; // sprite, will need 2 [huey, bell, airwolf]
var visa; // sprite, goal
var migraHelo2; // sprite
var migraMan3; // sprite

var laMigra; // group, it may be better to call this opponents or hazards because they include flotsam

var img; // a temporary placeholder to preload images for sprites
var img1; // temp placeholder to preload images for sprites
var img2; // temp placeholder to preload images for sprites

var spriteCounter = 0; // used in draw loop, along with modulo, to update and draw one sprite per frame.
												// will give background image it's own turn since it is a sprite indexed 0
												//will potentiall cause draw loop to speed up as sprites are removed from list

var BUGGY = false; // boolean, debug flag, used for debug feature of P5.Play.JS

var START = false; // to use for button SNES maybe need a reSTART
//var SELECT = false; // use button for SNES
//var shoulderLeft = false; // unused button for SNES
//var shoulderRight = false; // unused button for SNES
//var GAMEOVER = false; // may not be best option because a gameover state isn't really what we do
var moveLeft = false; // boolean, used for player character interaction map to dPad
var moveRight = false; // boolean
var moveUp = false; // boolean
var moveDown = false; // boolean
var moveIdle = true; // boolean, used for player character idle
//var dPad; // sprite, container for d pad image, used for touch interaction
//var start; // sprite, container for start button image

var gamestate = "startup"; // string variable should only contain 'startup','play','win','lose'

// queue to render things, they'll be drawn in this order so it's important
// to have the order we want. This order will be handled in preload. To deal
// with an object moving more than ONE_UNIT, we simply add the object multiple
// times to the queue
let renderQueue = [];

// this defines the time to spend on changing the animation and rendering for
// each character, the fast this is, the faster the game will move
let renderTime = .0909;

// indicates where we are in the render queue
let currentIndex = 0;

// timestamp for our indexing into the queue
let timeStamp = 0;

/**
 * Calculates the new index from the current one, based on
 * what our current index is, how many elements are in the queue
 * and how long each sprite gets to move
 * @param {The queue of sprites we'll be drawing} queue
 * @param {The current index we are testing} idx
 * @param {How long each sprite has to move} timing
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

/**
 * Calculates how long we have at each ONE_UNIT distance to hang
 * out before animating to a new spot, which is based really on
 * the speed of the sprite. If a sprite moves 4 units, for example,
 * we have timing/4 seconds to hang out before moving again
 * @param {The sprite that's moving} sprite
 * @param {The length of time each sprite has to move} timing
 */
function calculateSubtiming(sprite, timing)
{
	const total_units = sprite.speed / ONE_UNIT;
	return timing / total_units;
}


/**
 * this takes a rendering queue and updates positions based on how much
 * time has elapsed at this point in the game
 * @param {A queue of sprites to render} queue
 * @param {How long we spend at each sprite drawing} timing
 */
function updateRendering(queue, timing) {
	// calculate the next index
	const nextIdx = getNextIndex(queue, currentIndex, timing);

	// if the index hasn't changed, then we're really done at this point
	if (nextIdx !== currentIndex)
	{
		// stop the sprite animations
		if (currentIndex >= 0) {
			stopSprite(queue[currentIndex]);
		}
		// update our index
		currentIndex = nextIdx;
		// now update the sprite, which will cause it to move if its movement
		// speed is something > 0

		updateSprite(queue[currentIndex])
	}
}

function stopSprite(sprite) {
	console.log('stopping ' + sprite.name);
	if (sprite.animation) {
		sprite.animation.stop();
	}
}
/**
 * updateSprite figures out which way a sprite is moving and where to draw it
 */
function updateSprite(sprite) {
	console.log('updating ' + sprite.name);
	if (sprite.animation) {
		sprite.animation.play();
	}

	switch (sprite.movementDir) {
		case 'left':
			sprite.position.x = sprite.position.x - sprite.speed;
			// wrap around on the x-axis
			if (sprite.position.x < 0) {
				// we calculate the new position as such so that
				// the sprite wraps around the screen correctly,
				// in essence doing a modulo on its position
				sprite.position.x = WIDTH + sprite.position.x;
			}
			break;
		case 'right':
			// wrap on the x-axis
			sprite.position.x = sprite.position.x + sprite.speed;
			if (sprite.position.x > WIDTH) {
				// we calculate the new position as such so that
				// the sprite wraps around the screen correctly,
				// in essence doing a modulo on its position
				sprite.position.x = sprite.position.x - WIDTH;
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

/**
 * This function animates the sprite to move from its current position
 * to the next position, so that we "smoothly" jump between UNITS of 32 pixels
 * until it gets to its next destination. It also allows us to control which
 * animation frame is being used.
 * @param {The sprite we're animating} sprite
 */
function animateSprite(sprite, timing, distance)
{
	// get the subtiming of this sprite
	const subtiming = calculateSubtiming(sprite, timing);
	// grab elapsed time
	const seconds = millis() / 1000;

	if (seconds > subTimestamp) {
		// slap a new subtimestamp down
		subTimestamp = seconds + subtiming;
		return sprite.position.x + distance;
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

	// load images and create sprite for player character Carlos Moreno
	img = loadImage('img/carlos-moreno-3_09.png');
	carlosmoreno = createSprite(32*7+16,64*6+32); // carlosmoreno is the player character
	carlosmoreno.addImage('surprise',img);
	renderQueue.push(carlosmoreno); // add carlos to the queue, here we add the sprite
	carlosmoreno.name = 'carlosmoreno';

	img1 = loadImage('img/carlos-moreno-3_01.png');
	img2 = loadImage('img/carlos-moreno-3_02.png');
	carlosmoreno.addAnimation('walkdown',img1,img2); // may need to add or repeat anim frames for carlos

	img1 = loadImage('img/carlos-moreno-3_03.png');
	img2 = loadImage('img/carlos-moreno-3_04.png');
	carlosmoreno.addAnimation('walkup',img1,img2);

	img1 = loadImage('img/carlos-moreno-3_05.png');
	img2 = loadImage('img/carlos-moreno-3_06.png');
	carlosmoreno.addAnimation('walkright',img1,img2);

	img1 = loadImage('img/carlos-moreno-3_07.png');
	img2 = loadImage('img/carlos-moreno-3_08.png');
	carlosmoreno.addAnimation('walkleft',img1,img2);
	// end load images for player character Carlos Moreno

	// load and create cadaver
	img1 = loadImage('img/cadaverA.png');
	img2 = loadImage('img/cadaverB.png');
	cadaver = createSprite(32*1, 32*11);
	cadaver.addAnimation('float',img1,img1,img1,img2,img1,img2);
	cadaver.setDefaultCollider();
	cadaver.animation.playing = false;
	cadaver.movementDir = 'right';
	cadaver.speed = 32;
	// add the cadaver to the queue
	renderQueue.push(cadaver);
	cadaver.name = 'cadaver';
	// end load and create cadaver

	// load and create gato1
	img1 = loadImage('img/gatoA.png');
	img2 = loadImage('img/gatoB.png');
	gato1 = createSprite(32*2+16,32*9);
	gato1.addAnimation('float',img1,img1,img2);
	gato1.setDefaultCollider();
	gato1.animation.playing = false;
	gato1.movementDir = 'right';
	//gato1.speed = 32*2;
	gato1.speed = ONE_UNIT;
	// add gato1 to the queue
	renderQueue.push(gato1);
	renderQueue.push(gato1);
	gato1.name = 'gato1';
	// end load and create gato1

	// load and create gato2
	img1 = loadImage('img/gatoA.png');
	img2 = loadImage('img/gatoB.png');
	gato2 = createSprite(32*7+16,32*9);
	gato2.addAnimation('float',img2,img2,img1);
	gato2.animation.playing = false;
	gato2.setDefaultCollider();
	gato2.movementDir = 'right';
	//gato2.speed = 32*2;
	gato2.speed = ONE_UNIT;
	// add gato1 to the queue
	renderQueue.push(gato2);
	renderQueue.push(gato2);
	gato2.name = 'gato2';
	// end load and create gato2

	// load and create waterLog
	img1 = loadImage('img/waterlogA.png');
	img2 = loadImage('img/waterlogB.png');
	waterLog = createSprite(32*8,32*11);
	waterLog.addAnimation('float',img1,img1,img2,img2);
	waterLog.setCollider('rectangle',0,16,64,32);
	waterLog.animation.playing = false;
	waterLog.movementDir = 'right';
	waterLog.speed = 32;
	// add waterlog to the queue
	renderQueue.push(waterLog);
	waterLog.name = 'waterlog';
	// end load and create waterLog

	// load and create llanta
	img1 = loadImage('img/llantaA.png');
	img2 = loadImage('img/llantaB.png');
	llanta = createSprite(32*12,32*9);
	llanta.addAnimation('float',img1,img1,img1,img2,img2,img2);
	llanta.animation.playing = false;
	llanta.movementDir = 'right';
	//llanta.speed = 32*2;
	llanta.speed = ONE_UNIT;
	llanta.setDefaultCollider();
	// added the tire to the queue
	renderQueue.push(llanta);
	renderQueue.push(llanta);
	llanta.name = 'llanta';
	// end load and create llanta

	// load and create migraMan2
	img1 = loadImage('img/migraman_1.png');
	img2 = loadImage('img/migraman_2.png');
	migraMan2 = createSprite(32*7+16,32*7);
	migraMan2.addAnimation('marchright',img1,img1,img2,img2);
	migraMan2.animation.playing = false;
	migraMan2.setDefaultCollider();
	migraMan2.movementDir = 'right';
	migraMan2.speed = 32;
	// migra hombre 2
	renderQueue.push(migraMan2);
	migraMan2.name = 'migraHombre2';
	// end load and create migraman2

	// load and create migraMan1
	img1 = loadImage('img/migraman_1.png');
	img2 = loadImage('img/migraman_2.png');
	migraMan1 = createSprite(32*2+16,32*7);
	migraMan1.addAnimation('marchright',img1,img2,img2,img1);
	migraMan1.animation.playing = false;
	migraMan1.setDefaultCollider();
	migraMan1.movementDir = 'right';
	migraMan1.speed = 32;
	// migra hombre 1
	renderQueue.push(migraMan1);
	migraMan1.name = 'migraHombre1';
	// end load and create migraMan1

	// load and create migraSUV
	img1 = loadImage('img/migra_car-1.png');
	img2 = loadImage('img/migra_car-2.png');
	migraSUV = createSprite(64,32*5);
	migraSUV.addAnimation('drive',img1,img2,img1);
	migraSUV.animation.playing = false;
	// migraSUV.mirrorX(-1); // this line is no longer needed, art has been corrected
	migraSUV.setDefaultCollider(); // with corrected art this should be 64x64
	migraSUV.movementDir = 'left';
	//migraSUV.speed = 32*3;
	migraSUV.speed = ONE_UNIT;
	// added migra SUV to the queue
	renderQueue.push(migraSUV);
	renderQueue.push(migraSUV);
	renderQueue.push(migraSUV);
	migraSUV.name = 'migraSUV';
	// end load and create migraSUV

	// load and create migraHelo1
	img1 = loadImage('img/migra_helo-1.png');
	img2 = loadImage('img/migra_helo-2.png');
	migraHelo1 = createSprite(32*5,32*3);
	migraHelo1.addAnimation('fly',img1,img2,img2,img1,img2);
	migraHelo1.animation.playing = false;
	migraHelo1.setDefaultCollider();
	migraHelo1.movementDir = 'left';
	//migraHelo1.speed = 32*4;
	migraHelo1.speed = ONE_UNIT;
	// added migra heli 1 to the queue
	renderQueue.push(migraHelo1);
	renderQueue.push(migraHelo1);
	renderQueue.push(migraHelo1);
	renderQueue.push(migraHelo1);
	migraHelo1.name = 'migraHeli1';
	// end load and create migraHelo1

	// load and create visa
	img = loadImage('img/visa.png');
	visa = createSprite(32*5+16,16);
	visa.addImage('visa',img);
	visa.setDefaultCollider();
	// end load and create visa

	// load and create migraHelo2
	img1 = loadImage('img/migra_helo-1.png');
	img2 = loadImage('img/migra_helo-2.png');
	migraHelo2 = createSprite(32*10,32*3);
	migraHelo2.addAnimation('fly',img1,img2,img1,img2,img2);
	migraHelo2.animation.playing = false;
	migraHelo2.setDefaultCollider();
	migraHelo2.movementDir = 'left';
	//migraHelo2.speed = 32*4;
	migraHelo2.speed = ONE_UNIT;
	// added migra heli 2 to the queue
	renderQueue.push(migraHelo2);
	renderQueue.push(migraHelo2);
	renderQueue.push(migraHelo2);
	renderQueue.push(migraHelo2);
	migraHelo2.name = 'migraHeli2';
	// end load and create migraHelo2

	// load and create migraMan3
	img1 = loadImage('img/migraman_1.png');
	img2 = loadImage('img/migraman_2.png');
	migraMan3 = createSprite(32*12+16,32*7)
	migraMan3.addAnimation('marchright',img2,img2,img1,img1);
	migraMan3.animation.playing = false;
	migraMan3.setDefaultCollider();
	migraMan3.movementDir = 'right';
	migraMan3.speed = 32;
	// migra hombre 3
	renderQueue.push(migraMan3);
	migraMan3.name = 'migraHombre3';
	// end load and create migraMan3

	// carlosmoreno should go here, will it feel different if he doesn't?

} // end preload

function setup() {
	//createCanvas(448, 548);
  let canvas = createCanvas(448, 448); // suggested by p5js.org reference for parent()
  canvas.parent('canvas-column'); // place the sketch canvas within the div named canvas-column within index.html
  noCursor(); // testing cursor manipulation
	// cursor(HAND); // HAND, ARROW, CROSS, MOVE, TEXT, WAIT
	frameRate(30); // tried as slow as 1fps
	background(255);

	tierra.changeImage('frontera'); // this image should change to 'asarco' to default to gamestate='startup'

	carlosmoreno.debug = BUGGY;
	cadaver.debug = BUGGY;
	gato1.debug = BUGGY;
	gato2.debug = BUGGY;
	waterLog.debug = BUGGY;
	llanta.debug = BUGGY;
	migraMan2.debug = BUGGY;
	migraMan1.debug = BUGGY;
	migraSUV.debug = BUGGY;
	migraHelo1.debug = BUGGY;
	visa.debug = BUGGY;
	migraHelo2.debug = BUGGY;
	migraMan3.debug = BUGGY;


	// I've reordered the adds to match the render queue order
	laMigra = new Group();
	laMigra.add(cadaver);
	laMigra.add(gato1);
	laMigra.add(gato2);
	laMigra.add(waterLog);
	laMigra.add(llanta);
	laMigra.add(migraMan2);
	laMigra.add(migraMan1);
	laMigra.add(migraSUV);
	laMigra.add(migraHelo1);
	laMigra.add(migraHelo2);
	laMigra.add(migraMan3);

	//carlosmoreno.changeImage('facedown');
	noCursor(); // testing cursor manipulation
	// cursor(HAND); // HAND, ARROW, CROSS, MOVE, TEXT, WAIT

} // end setup

function draw() {
	background(255);

	if (moveUp){
		carlosmoreno.changeAnimation ('walkup');
		carlosmoreno.position.y = carlosmoreno.position.y - 32;
		if (carlosmoreno.position.y - 32 < 0) {
			// bound the mvoement of carlos
			carlosmoreno.position.y += 32;
		}
		moveUp = false;
		//carlosmoreno.changeImage ('faceup');
	}
	else if (moveDown){
		carlosmoreno.changeAnimation ('walkdown');
		carlosmoreno.position.y = carlosmoreno.position.y + 32;
		if (carlosmoreno.position.y + 32 > HEIGHT) {
			// bound the mvoement of carlos
			carlosmoreno.position.y -= 32;
		}
		moveDown = false;
		//carlosmoreno.changeImage ('facedown');
	}
	else if (moveLeft){
		carlosmoreno.changeAnimation ('walkleft');
		carlosmoreno.position.x = carlosmoreno.position.x - 32;
		// bound the movement of carlos
		if (carlosmoreno.position.x < 0) {
			carlosmoreno.position.x += 32;
		}
		moveLeft = false;
		//carlosmoreno.changeImage ('faceleft');
	}
	else if (moveRight){
		carlosmoreno.changeAnimation ('walkright');
		carlosmoreno.position.x = carlosmoreno.position.x + 32;
		// bound the movement of carlos
		if (carlosmoreno.position.x > WIDTH) {
			carlosmoreno.position.x -= 32;
		}
		moveRight = false;
		//carlosmoreno.changeImage ('faceright');
	}
	//else {
		//carlosmoreno.changeAnimation ('facedown');
	//}

	if (carlosmoreno.overlap(laMigra)){ // am setting la migra group members velocity to 0 as a temporary response
		carlosmoreno.changeAnimation ('surprise');
		carlosmoreno.position.x = 224+16; // next lines added to create a 'startup' condition
		carlosmoreno.position.y = 64*6+32;

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
