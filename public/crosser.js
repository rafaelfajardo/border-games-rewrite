'use strict';  // enforce some (more) sane behavior from javascript
/* * * * * * * * * * * * * * * *
*
*		This is a rewriting/remediation of Crosser (2000 a.c.e.)
*		there is an accompanying file called "about.txt" that contains a partial dev log
*    another partial dev log is found on gitHub
*    it has come to our attention that gitHub provides technology solutions to DHS and ICE
*    We DO NOT support ICE and feel trapped in our complicity because of the importance
*    of gitHub to the open source ecosystem.
*
*    This file depends upon P5.js, Play.P5.js, and JavaScript
*
*    This file is called by main.js
*
*    This file calls or may call:
*      contoller.js
*      touch.js
*
*    contributors to this version have been:
*      Rafael Fajardo
*      Chris GauthierDickey
*      Scott Leutenegger
*    on top of work that was originally crafted by
*      Rafael Fajardo
*      Francisco Ortega
*      Miguel Tarango
*      Ryan Mulloy
*      Marco Ortega
*      Carmen Escobar
*      Tomás Márquez
*
*/



//
//
// global variables
//

// defines one unit of movement, which is 32 pixels
const ONE_UNIT = 32;
// width and height of screen in pixels
const WIDTH = 448;
const HEIGHT = 448;

const FRAME_RATE = 30;
//
//
// counter to toggle between _crosser.html and _lamigra.html
// let ctr0 = 0; // used in main.js but not in crosser.js nor lamigra.js
//
/* ****
//
// url targets for invoking _crosser.html or _lamigra.html
// used by key strokes for 'select' and 'start'
// using absolute paths during development, and maybe during
// installation at DAM for ReVisión in 2021
let url  = "http://localhost:8080/index.html";
let url0 = "http://localhost:8080/_crosser.html";
let url1 = "http://localhost:8080/_lamigra.html";
*/
// url targets using relative paths
let url  = 'index.html';
let url0 = '_crosser.html';
let url1 = '_lamigra.html';

//
//
//  declare state variables
//
let gameState = "startup"; // string variable should only contain 'select, startup','play','win','lose'
let moveState = 'idle'; // can be invoked from keyPressed to let carlosmoreno movement be guided by updateSprite

//
//
//  declare sprites
//
let tierra; // sprite, will need 3 images each 448 x 448
let carlosmoreno; // sprite, player character, minimum of 9 images
let cadaver; // sprite will need 1 mexico side
let gato1; // sprite, will need 2 on US side
let gato2; // sprite, will need 2 on US side
let waterLog; // sprite, flotsam & jetsam will need 1 top edge touches border from Mexico side
let llanta; // sprite will need 1 top edge touches bank on US side
let migraMan2; // sprite will need 3 [tom, dick, harry,] walking on banks
let migraMan1; // sprite
let migraSUV; // sprite, will need 1 on center of lane [xlt, gto, exp] currently have wrong art. facing wrong direction. may not have art
let migraHelo1; // sprite, will need 2 [huey, bell, airwolf]
let visa; // sprite, goal
let migraHelo2; // sprite
let migraMan3; // sprite

let laMigra; // group, it may be better to call this opponents or hazards because they include flotsam

let img; // a temporary placeholder to preload images for sprites
let img1; // temp placeholder to preload images for sprites
let img2; // temp placeholder to preload images for sprites

const BUGGY = false; // boolean, debug flag, used for debug feature of P5.Play.JS
// turning on BUGGY will turn on DRAW_COLLIDER, otherwise it's the last value
const DRAW_COLLIDER = BUGGY ? BUGGY : true;

const COLLISIONS_OFF = true;

// queue to render things, they'll be drawn in this order so it's important
// to have the order we want. This order will be handled in preload. To deal
// with an object moving more than ONE_UNIT, we simply add the object multiple
// times to the queue
let renderQueue = [];

// this defines the time to spend on changing the animation and rendering for
// each character, the faster this is, the faster the game will move
let renderTime = .0909;

// indicates where we are in the render queue
let currentIndex = 0;

// timestamp for our indexing into the queue
let timeStamp = 0;




// create an input queue so we can store the last two inputs we received
let inputQueue = [];
let maxQueueSize = 2;
/**
 * Adds an input into our queue, which we can remove with dequeueInput
 * @param {The input queue (which should be an array) that we're using} inputQueue
 * @param {The next input to add} item
 */
function addInput(inputQueue, item) {
	if (inputQueue.length < maxQueueSize) {
		inputQueue.push(item);
	} else {
		inputQueue.shift();
		inputQueue.push(item);
	}
}

/**
 * This function removes the next item (i.e., the oldest) in the queue
 * @param {The input queue we're using (which should be an array)} inputQueue
 * @returns {The item we just removed from the queue}
 */
function dequeueInput(inputQueue) {
	return inputQueue.shift();
}

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


/*******************************************************************
 * is called from the draw() loop
 * this takes/receives a rendering queue and a timing
 * and updates positions based on how much
 * time has elapsed at this point in the game
 * it calls upon updateSprite() and stopSprite()
 * @param {A queue of sprites to render} queue
 * @param {How long we spend at each sprite drawing} timing
 */
function updateRendering(queue, timing) {
	// calculate the next index
	const nextIdx = getNextIndex(queue, currentIndex, timing);

	// if the index has changed, then we need to update the sprite
	if (nextIdx !== currentIndex)
	{
		// we want to move the sprite at the end of its time frame,
		// so it animates in place first, then moves
		updateSprite(queue[currentIndex]);
		// after updating, the sprite has moved so it's no longer moved
		queue[currentIndex].hasMoved = false;
		// stop the sprite animations
		if (currentIndex >= 0) {
			// only stop the sprite (animation) if the next index is
			// not this sprite, since we duplicate them
			if (queue[currentIndex] !== queue[nextIdx]) {
				stopSprite(queue[currentIndex]);
			}
		}

		// update our index
		currentIndex = nextIdx;
		const sprite = queue[currentIndex];

		// now start the animation of this next sprite
		if (sprite.animation) {
			//sprite.animation.goToFrame(0);
			if (sprite.isPlayer)
			{
				//sprite.animation.play();
				// if there's input, then animate
				if (inputQueue.length > 0)
					manuallyAnimate(sprite);
			}
			else {
				manuallyAnimate(sprite);
			}
		}
	} else {
		// in this case, we can do things to the current sprite since
		// which resides in queue[currentIndex]
		manuallyAnimate(queue[currentIndex]);
	}
}

/**
 * Manually animates the sprite by moving to the next frame
 * @param {The sprite we're animating} sprite 
 */
function manuallyAnimate(sprite, looping) {
	// first, test if it's the player, if it's not, just animate it
	if (sprite.isPlayer) {
		// now if the player has moved, we'll run the animation
		if (sprite.hasMoved || inputQueue.length > 0)
		{
			sprite.animation.nextFrame();
		} else {
			sprite.animation.goToFrame(0);
		}
	} else {
		sprite.animation.nextFrame();
	}
}

/**
 * Turns off the animations on the sprite and rewinds them to the first frame
 * @param {The sprite we're working with} sprite
 */
function stopSprite(sprite) {
	//console.log('stopping ' + sprite.name);
	if (sprite.animation) {
		sprite.animation.stop();
		sprite.animation.rewind();
	}
}
/***********************************************************************
 *
 * is called by updateRendering() and receives a sprite in the render queue
 * updateSprite figures out which way a sprite is moving and where to draw it
 */
function updateSprite(sprite) {
	// console.log('updating ' + sprite.name);
	// if (sprite.animation) {
	// 	sprite.animation.play();
	// }

	// here we check to see if the sprite is actually the player that we're updating
	if (sprite.isPlayer == true)
	{
		// if so, get the next movement that's been queued up
		let dir = dequeueInput(inputQueue)
		if (dir)
		{
			sprite.movementDir = dir;
			sprite.animation.goToFrame(0);
			sprite.hasMoved = true;
			//sprite.animation.play();
		} else {
			// and if there's no movement, then just be idle
			sprite.movementDir = 'idle';
			//sprite.animation.stop();
		}

		// now we'll update the direction that Carlos is facing based on the next movement
		updateCarlosDirection(sprite);
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
			if (sprite.position.y > 0 + ONE_UNIT) {
				sprite.position.y = sprite.position.y - sprite.speed;
				sprite.position.depth -= 1;
			}
			break;
		case 'down':
			if (sprite.position.y < HEIGHT - ONE_UNIT) {
				sprite.position.y = sprite.position.y + sprite.speed;
				sprite.position.depth += 1;
			}
			break;
		case 'idle':
			break;
		default:
			console.log('movementDir of ' + sprite.name + ' is undefined as \'' + sprite.movementDir + '\'');
			break;
	}
}


/**
 * This function changes the direction that Carlos is facing and is
 * called by updateSprite whenever the player (Carlos) is being drawn
 * @param {A Sprite (play.p5) that has animations for Carlos} carlos
 */
function updateCarlosDirection(carlos)
{
	switch (carlos.movementDir)
	{
		case 'left':
			carlos.changeAnimation('walkleft');
			break;
		case 'right':
			carlos.changeAnimation('walkright');
			break;
		case 'up':
			carlos.changeAnimation('walkup');
			carlos.depth -= 1;
			break;
		case 'down':
			carlos.changeAnimation('walkdown');
			carlos.depth += 1;
			break;
		case 'surprise':
			carlos.changeAnimation('surprise');
			break;
		default:
			// do nothing in the default state so the last animation remains
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

const ANIM_DELAY = 1;
/**
 *
 * PRELOAD function
 */
function preload() {
	//timeStamp = millis() / 1000 + renderTime;

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
	// changed the order only so that idle is the starting image
	carlosmoreno.addImage('idle', loadImage('img/carlos-moreno-3_01.png'));
	carlosmoreno.addImage('surprise',img);

	//renderQueue.push(carlosmoreno); // add carlos to the queue, here we add the sprite
	carlosmoreno.name = 'carlosmoreno';
	carlosmoreno.animation.playing = false;
	carlosmoreno.movementDir = 'idle';
	carlosmoreno.speed = 32;
	carlosmoreno.setCollider('rectangle',0,-16,28,30)
	carlosmoreno.depth = 16;
	// added an isPlayer field so we can easily detect when we're working with the player
	// sprite--this is needed to handle the input queue
	carlosmoreno.isPlayer = true;
	carlosmoreno.hasMoved = false;
	
	img1 = loadImage('img/carlos-moreno-3_01.png');
	img2 = loadImage('img/carlos-moreno-3_02.png');
	let anim = carlosmoreno.addAnimation('walkdown',img1,img2); // may need to add or repeat anim frames for carlos
	anim.looping = false;
	anim.frameDelay = ANIM_DELAY;

	img1 = loadImage('img/carlos-moreno-3_03.png');
	img2 = loadImage('img/carlos-moreno-3_04.png');
	anim = carlosmoreno.addAnimation('walkup',img1,img2);
	anim.looping = false;
	anim.frameDelay = ANIM_DELAY;

	img1 = loadImage('img/carlos-moreno-3_05.png');
	img2 = loadImage('img/carlos-moreno-3_06.png');
	anim = carlosmoreno.addAnimation('walkright',img1,img2);
	anim.looping = false;
	anim.frameDelay = ANIM_DELAY;

	img1 = loadImage('img/carlos-moreno-3_07.png');
	img2 = loadImage('img/carlos-moreno-3_08.png');
	anim = carlosmoreno.addAnimation('walkleft',img2,img1);
	anim.looping = false;
	anim.frameDelay = ANIM_DELAY;
	// end load images for player character Carlos Moreno

	carlosmoreno.addAnimation('surprise', 'img/carlos-moreno-3_09.png');

	// load and create cadaver
	img1 = loadImage('img/cadaverA.png');
	img2 = loadImage('img/cadaverB.png');
	cadaver = createSprite(32*1, 32*11);
	cadaver.addAnimation('float',img1,img1,img1,img2,img1,img2);
	cadaver.setCollider('rectangle',0,0,62,62);
	cadaver.animation.playing = false;
	cadaver.movementDir = 'right';
	cadaver.speed = ONE_UNIT;
	cadaver.depth = 15;
	// add the cadaver to the queue
	renderQueue.push(cadaver);
	cadaver.name = 'cadaver';
	// end load and create cadaver

	// load and create gato1
	img1 = loadImage('img/gatoA.png');
	img2 = loadImage('img/gatoB.png');
	//gato1 = createSprite(32*2+16,32*8+24);
	// createSprite takes the initial x, y position and the width height
	gato1 = createSprite(32 * 2 + 16, 32 * 9, 32, 64);
	gato1.addAnimation('float',img1,img2,img1,img2,img1,img2);
	gato1.setCollider('rectangle',0,-16,30,30);
	gato1.animation.playing = false;
	gato1.movementDir = 'right';
	gato1.depth = 12;
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
	gato2.setCollider('rectangle',0,-16,30,30);
	gato2.movementDir = 'right';
	gato2.depth = 12;
	//gato2.speed = 32*2;
	gato2.speed = ONE_UNIT;
	// add gato1 to the queue twice so that it moves two units
	renderQueue.push(gato2);
	renderQueue.push(gato2);
	gato2.name = 'gato2';
	// end load and create gato2

	// load and create waterLog
	img1 = loadImage('img/waterlogA.png');
	img2 = loadImage('img/waterlogB.png');
	waterLog = createSprite(32*8,32*11);
	waterLog.addAnimation('float',img1,img1,img2,img2);
	waterLog.setCollider('rectangle',0,-16,60,28);
	waterLog.animation.playing = false;
	waterLog.movementDir = 'right';
	waterLog.speed = ONE_UNIT;
	// add waterlog to the queue
	renderQueue.push(waterLog);
	waterLog.name = 'waterlog';
	waterLog.depth = 15;
	// end load and create waterLog

	// load and create llanta
	img1 = loadImage('img/llantaA.png');
	img2 = loadImage('img/llantaB.png');
	llanta = createSprite(32*12,32*9-2);
	llanta.addAnimation('float',img1,img2,img1,img2,img1,img2);
	llanta.animation.playing = false;
	llanta.movementDir = 'right';
	llanta.depth = 12;
	//llanta.speed = 32*2;
	llanta.speed = ONE_UNIT;
	llanta.setCollider('rectangle',0,-14,60,28);
	// added the tire to the queue, we add it twice so it moves twice in a row
	renderQueue.push(llanta);
	renderQueue.push(llanta);
	llanta.name = 'llanta';
	// end load and create llanta

	// load and create migraMan2
	img1 = loadImage('img/migraman_1.png');
	img2 = loadImage('img/migraman_2.png');
	migraMan2 = createSprite(32*7+16,32*7);
	migraMan2.addAnimation('marchright',img1,img2,img1,img2,img1,img2);
	migraMan2.animation.playing = false;
	migraMan2.setCollider('rectangle',0,-16,30,30);
	migraMan2.movementDir = 'right';
	migraMan2.depth = 10;
	migraMan2.speed = ONE_UNIT;
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
	migraMan1.setCollider('rectangle',0,-16,30,30);
	migraMan1.movementDir = 'right';
	migraMan1.depth = 10;
	migraMan1.speed = ONE_UNIT;
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
	migraSUV.setCollider('rectangle', 0,0,64,48); // with corrected art this should be 64x64
	migraSUV.movementDir = 'left';
	migraSUV.depth = 8;
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
	migraHelo1.setCollider('rectangle', 0,-16,62,30);
	migraHelo1.movementDir = 'left';
	migraHelo1.depth = 6;
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
	migraHelo2.setCollider('rectangle', 0,-16,60,30);
	migraHelo2.movementDir = 'left';
	migraHelo2.depth = 6;
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
	migraMan3.setCollider('rectangle',0,-16,30,30);
	migraMan3.movementDir = 'right';
	migraMan3.depth = 10;
	migraMan3.speed = ONE_UNIT;
	// migra hombre 3
	renderQueue.push(migraMan3);
	migraMan3.name = 'migraHombre3';
	// end load and create migraMan3

	// carlosmoreno should go here, will it feel different if he doesn't?
  	renderQueue.push(carlosmoreno); // add carlos to the queue, here we add the sprite

} // end preload

// this is the input delay for reading input--during this delay, we stop reading input, after it's
// elapsed, we'll start reading input again. The delay should only be set after some input has been
// read
const INPUT_DELAY = .5;
let readInputAfter = 0;

/**
 * SETUP function
 */
function setup() {
	//createCanvas(448, 548);
	let canvas = createCanvas(448, 448); // suggested by p5js.org reference for parent()
	canvas.parent('canvas-column'); // place the sketch canvas within the div named canvas-column within index.html
	//
	//
	// cursor is useful for desktop and web served games
	// cursor is not useful for installation with gamepad
	// it may be crucial for installation with Leap Motion Controller
	// we seem to have to provide solutions for both
	// noCursor(); // testing cursor manipulation
	cursor(HAND); // params = HAND, ARROW, CROSS, MOVE, TEXT, WAIT
	//
	frameRate(FRAME_RATE); // tried as slow as 1fps
	background(255);

	tierra.changeImage('asarco'); // this image should change to 'asarco' to default to gamestate='startup'


	carlosmoreno.debug = DRAW_COLLIDER;
	cadaver.debug = DRAW_COLLIDER;
	gato1.debug = DRAW_COLLIDER;
	gato2.debug = DRAW_COLLIDER;
	waterLog.debug = DRAW_COLLIDER;
	llanta.debug = DRAW_COLLIDER;
	migraMan2.debug = DRAW_COLLIDER;
	migraMan1.debug = DRAW_COLLIDER;
	migraSUV.debug = DRAW_COLLIDER;
	migraHelo1.debug = DRAW_COLLIDER;
	visa.debug = DRAW_COLLIDER;
	migraHelo2.debug = DRAW_COLLIDER;
	migraMan3.debug = DRAW_COLLIDER;


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

	// now set up the time to delay before reading so that we don't start reading immediately
	readInputAfter = (millis() / 1000) + 1;


  	gameState = 'startup';
} // end setup


/**
 * DRAW function
 */
function draw() {
	background(255);

	/*
	* I have commented out the switch statement during the early part of coding
	*/
	switch (gameState)
  	{ 	// switch is not documented in P5.JS but is part of Javascript
    	// select, startup','play','win','lose
		//case "select": //will not use this case since it is handled in keyReleased() and updateStatus(pad)
		// statements that display select condition, called by keyReleased() 'g'
		// statements that may alter gameState label and condition
		// statements that may reload this game
		// statements that may launch the other game
		//break;
		case "startup":
			// statements to display the startup condition
			tierra.changeImage('asarco');
			tierra.depth = 100;
			//laMigra.visible = false;
			// statements that may alter gamestate label and condition
			break;
		case "play":
			tierra.changeImage('frontera');
			tierra.depth = 0;
			// statements that display gameplay
			break;
		case "lose":
			// statements that display loss condition
			carlosmoreno.changeAnimation ('surprise');
			carlosmoreno.depth = 16;
			carlosmoreno.position.x = 224+16; // next lines added to create a 'startup' condition
			carlosmoreno.position.y = 64*6+32;
      gameState = 'play'; // change gameState or carlos gets stuck
			break;
		case "win":
			// statements that display win condition
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
			break;
		default:
			// statements that catch and redirect in case none of the above is true
			break; // is there a 'break' after 'default'? I forget
	} // end gameState switch/case statements


	if (!COLLISIONS_OFF && carlosmoreno.overlap(laMigra)){ // am setting la migra group members velocity to 0 as a temporary response
    	gameState = 'lose';
	}
	if (carlosmoreno.overlap(visa)){ // make all the moving sprites disappear
    	gameState = 'win';
	}

	// get the current time so we can decide if it's time to read input, and in particular, the controller
	const currentTime = millis() / 1000;

	// if the time is after our readInputAfter timestamp, we'll process input from the controller
	if (currentTime > readInputAfter) {
		// scan the game pads to see which ones are active
		scanGamePads();
		// grab controller 0, since that's all we'll have
		let pad0 = controllers[0];
		// test that pad0 is not null or undefined (i.e., it exists)
		if (pad0) {
			// just log it so we know
			console.log('pad0 is active');
			// now update the game with the status of the game pad
			updateStatus(pad0); // will need an updateStatus() function
		} else { // what to do if pad0 is null, which is to say there is no gamepad connected
			// use keyboard
			// or use touches
			//console.log("did not find gamepad (probably need to click it so it wakes up)")
		}
	}

	// update what we're rendering and how frequently
	updateRendering(renderQueue, renderTime);

	// now tell p5.play to draw all the sprites it knows about
	drawSprites();

	if (gameState === 'startup') {
		strokeWeight(5);
  		fill(128 + sin(frameCount*0.1) * 128);
  		textSize(14);
  		text('Press START to play', 2*width/3, 4*height/5);
	}

	// returns carlosmoreno to idle state after an update
	// effectively slows down carlos and makes him take his turn in the queue
	if (!keyIsPressed){carlosmoreno.movementDir = 'idle';}

} // end draw loop

let firstIgnored = false;
async function updateStatus(pad){ // tested once per frame

	const currentTime = millis() / 1000;
	/**
	*  This bit is specific to an NES style controller,
	*  usb gamepad (Vendor: 0810 Product: e501)
	*  axis default values are -0.00392 so can test for greater and less than that.
	*  need a test to enclose it
	*/

	/*
	* Regular expressions to search the ID string given to us by the manufacturer
	* so that we can identify which controller is which and behave accordingly.
	*/
	let nintendoId = /Vendor\: 0810 Product\: e501/; // this is our canonical NES controller/gamepad
	let standardID = /Vendor\: 0583 Product\: 2060/; // this is the iBuffalo SNES controller/gamepad

	if (pad.id.match(nintendoId)) { // this matches against the nintendo controller

		if (pad.axes[0] === -1.00000)
		{	// check that we're in play state
			if (gameState === 'play') {
				readInputAfter = currentTime + INPUT_DELAY;
				addInput(inputQueue, 'left');
			}
		}
		if (pad.axes[0] ===  1.00000)
		{  // check that we're in play state
			if (gameState === 'play') {
				readInputAfter = currentTime + INPUT_DELAY;
				addInput(inputQueue, 'right');
			}
		}
		if (pad.axes[1] === -1.00000)
		{
			// check that we're in play state
			if (gameState === 'play') {
				readInputAfter = currentTime + INPUT_DELAY;
				addInput(inputQueue, 'up');
			}
		}
		if (pad.axes[1] ===  1.00000)
		{
			// check that we're in play state
			if (gameState === 'play') {
				readInputAfter = currentTime + INPUT_DELAY;
				addInput(inputQueue, 'down');
			}
		}
		if (pad.buttons[0].value === 1.00){ console.log(pad.buttons); print('NES B button pressed'); } // NES B button
		if (pad.buttons[1].value === 1.00){ print('NES A button pressed'); } // NES A button
		// does not have buttons 2-7 inclusive
		if (isButtonReleased(0, 8)) {
			print('NES Select pressed and released');
			window.open(url, "_self");
		}

		if (isButtonReleased(0, 9)) {
			print('NES Start pressed and released');
			// now behave differently depending on where we are
			if (gameState === 'startup')
			{
				gameState = 'play';
			} else {
				window.open(url0, "_self");
			}
		}
	}

	/**
	*  This bit is specific to the Buffalo SNES style controller,
	*  USB,2-axis 8-button gamepad (STANDARD GAMEPAD Vendor: 0583 Product: 2060)
	*  need a test to enclose it. Axis defaults are 0.00392 (positive values)
	*/
  /*
	if (pad.id.match(standardID)) { // this matches the id against the controller ID value
		if (pad.axes[0] === -1.00000){carlosmoreno.movementDir = 'left'; print('Buffalo SNES d-pad left pressed');} // SNES d-pad leftward
		if (pad.axes[0] ===  1.00000){carlosmoreno.movementDir = 'right'; print('Buffalo SNES d-pad right pressed');} // SNES d-pad leftward
		if (pad.axes[1] === -1.00000){carlosmoreno.movementDir = 'up'; print('Buffalo SNES d-pad up pressed');} // SNES d-pad leftward
		if (pad.axes[1] ===  1.00000){carlosmoreno.movementDir = 'down'; print('Buffalo SNES d-pad down pressed');} // SNES d-pad leftward
		if (pad.buttons[0].value === 1){ print('SNES B-button pressed');}
		if (pad.buttons[1].value === 1){ print('SNES A-button pressed');}
		if (pad.buttons[2].value === 1){ print('SNES Y-button pressed');}
		if (pad.buttons[3].value === 1){ print('SNES X-button pressed');}
		if (pad.buttons[4].value === 1){ print('SNES L-button pressed');}
		if (pad.buttons[5].value === 1){ print('SNES R-button pressed');}
		if (pad.buttons[6].value === 1){ print('SNES L-button pressed');} // redundant mapping
		if (pad.buttons[7].value === 1){ print('SNES R-button pressed');} // redundant mapping
		if (pad.buttons[8].value === 1){ window.open(url, "_self"); print('SNES SELECT button pressed');}
		if (pad.buttons[9].value === 1){ window.open(url0, '_self'); print('SNES START button pressed');}
		if (pad.buttons[10].value === 1){ print('unmapped button 10');} // I haven't found a signal on this button[index]
		if (pad.buttons[11].value === 1){ print('unmapped button 11');} // I haven't found a signal on this button[index]
		if (pad.buttons[12].value === 1){ print('SNES D-pad up pressed');} // redundant with axes 1 (Y-value)
		if (pad.buttons[13].value === 1){ print('SNES D-pad down pressed');} // redundant with axes 1 (Y-value)
		if (pad.buttons[14].value === 1){ print('SNES D-pad left pressed');} // redundant with axes 0 (X-value)
		if (pad.buttons[15].value === 1){ print('SNES D-pad right pressed');} // redundant with axes 0 (X-value)
	}
  */

	/**
	*  This bit is specific to the Exlene SNES style controller,
	*  USB Gamepad (Vendor: 0079 Product: 0011)
	*  The Exlene controller worked on older MacOS X and Mac Mini, with middleware. Is not working here.
	*/
	/**
	let exlene = /Vendor\: 0079 Product\: 0011/; // this is the Exlene SNES gamepad
	if (pad.id.match(exlene) ){
		if (pad.axis[0] === -1.0000){carlosmoreno.movementDir = 'left';} // this axis is not registering at present
		if (pad.axis[0] ===  1.0000){carlosmoreno.movementDir = 'right';} // this axis is not registering at present
		if (pad.axis[1] === -1.0000){carlosmoreno.movementDir = 'up';}
		if (pad.axis[1] ===  1.0000){carlosmoreno.movementDir = 'down';}
		if (pad.buttons[0] === 1.000){carlosmoreno.movementDir = 'right';} // SNES A button
		if (pad.buttons[1] === 1.000){carlosmoreno.movementDir = 'down';} // SNES B button
		if (pad.buttons[2] === 1.000){carlosmoreno.movementDir = 'up';} // SNES X button
		if (pad.buttons[3] === 1.000){carlosmoreno.movementDir = 'left';} // SNES Y button
		if (pad.buttons[4] === 1.000){carlosmoreno.movementDir = '';} // SNES left shoulder button
		if (pad.buttons[5] === 1.000){carlosmoreno.movementDir = '';} // SNES right shoulder button
		//     if (pad.buttons[6] === 1.000){carlosmoreno.movementDir = '';} // not mapped
		//     if (pad.buttons[7] === 1.000){carlosmoreno.movementDir = '';} // not mapped
		if (pad.buttons[8] === 1.000){carlosmoreno.movementDir = '';} // SNES select button
		if (pad.buttons[9] === 1.000){carlosmoreno.movementDir = '';} // SNES start button
	}
	*/

	/**
	* This bit is specific to the Sony PS3 contoller,
	* PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)
	* it also uses 8 for select and 9 for start code 054c_0268
	*/
	if (pad.id ==='PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)'){
		// add code for playstation buttons
	}
	return;
}

/*******************************************************
*
*  keyboard player/user input
*
*/

/**
*  keyReleased was tested in /public/ui to afford selecting and changing games
*  depends on global var ctr0 which is a counter
*  depends on global var url0 and url1 which are targets
*/

function keyReleased() {
	if ((key === 'g') || (key === 'G')){ // g on most keyboards using here as a select or highlight
		//may need to add here a test for if gamestate === playing (either) then load index.html
		// open the Select url which should be index.html
		window.open(url, "_self");
	}
	if ((key === 'h') || (key === 'H')){ // h on most keyboards using here as start the selected choice
		// Start key will reload and hence restart this window
		// window.open(url0, '_self');
	}
} // end keyReleased(). pad0 buttons[8] and buttons[9] will also use above



function keyPressed() { // tested once per frame, triggered on keystroke
	// get the current time
	const time = millis() / 1000;

	// don't get keyboard input while we're waiting
	if (time <  readInputAfter)
	return;

	if        (
	key === 'w'          ||
	key === 'W'          ||
	key === 'i'          ||
	key === 'I') {
		print('key up');
		addInput(inputQueue, 'up')
		 readInputAfter = time + INPUT_DELAY;

	} else if (
	key === 's'          ||
	key === 'S'          ||
	key === 'k'          ||
	key === 'K') {
		print('key down');
		addInput(inputQueue, 'down')
		 readInputAfter = time + INPUT_DELAY;

	} else if (
	key === 'a'          ||
	key === 'A'          ||
	key === 'j'          ||
	key === 'J') {
		print('key left');
		addInput(inputQueue, 'left')
		 readInputAfter = time + INPUT_DELAY;

	} else if (
	key === 'd'          ||
	key === 'D'          ||
	key === 'l'          ||
	key === 'L') {
		print('key right');
		addInput(inputQueue, 'right')
		 readInputAfter = time + INPUT_DELAY;

	} else {
		carlosmoreno.movementDir = 'idle'; // create an idle state for carlos
	}
	return false;

} // end keyPressed


// Code to deal with game pads
let lastControllers = []
let controllers = []

/**
 * checks two things: controllers and lastControllers, if the button was
 * pressed in lastControllers, but not in controllers, we have a "release" event
 * in essence, which we can check here--note this happens only once per press
 * @param {Index of the controller} ctrlId
 * @param {Index of the button} buttonId
 */
function isButtonReleased(ctrlId, buttonId)
{
	if (lastControllers[ctrlId] && lastControllers[ctrlId].buttons[buttonId]) {
		let val = controllers[ctrlId].buttons[buttonId].value;
		let lastVal = lastControllers[ctrlId].buttons[buttonId].value;
		// console.log('controller ' + ctrlId + ', button ' + buttonId + ', value ' + val);
		// console.log('lastController ' + ctrlId + ', button ' + buttonId + ', value ' + lastVal);
		// if the current val is 0, the button is no longer pressed, and if the last value is
		// 1, then it was pressed during the last read--this lets us know that it was a released button
		if (val === 0.0 && lastVal === 1.0) {
			console.log('key released: ' + buttonId)
			return true
		} else {
			return false
		}
	}

	return false
}

/** Called by the web page whenever a new controller is connected (or wakes up) */
function connectionHandler(e) {
	// just add it
	addGamePad(e.gamepad)
}

/** Called by the web page whenever a game controller is disconnected */
function disconnectHandler(e) {
	// just remove it
	removeGamePad(e.gamepad)
}

/**
 * Called whenever we need to add a gamepad to our list of gamepads. The parameter
 * is of the GamePad object type, so it has an index, etc.
 * @param {The gamepad we're adding} gamepad
 */
function addGamePad(gamepad) {
	console.log('gamepad connected on ' + gamepad.index)
	controllers[gamepad.index] = gamepad
	console.log('controllers.length ' + controllers.length)
}

/**
 * Used to remove a given gamepad from our array of GamePad objects.
 * @param {The gamepad we're removing} gamepad
 */
function removeGamePad(gamepad) {
	console.log('gamepad disconnected on ' + gamepad.index)
	// i.e., set it to undefined at that given index
	delete controllers[gamepad.index];
}

/**
 * This does a partial copy of the information we want from a gamepad, and
 * in particular, the button states. It doesn't copy anything else! Javascript
 * requires this because it only has referential copies
 * @param {The GamePad we're copying} pad
 * @returns
 */
function copyPad(pad) {
	var p = {};
	p.buttons = [];
	for (var i = 0; i < pad.buttons.length; i++)
	{
		p.buttons.push({})
		p.buttons[i].value = pad.buttons[i].value;
	}
	return p;
}

/**
 * Copies our controllers to lastControllers by doing a slightly deep copy of
 * the button states so that we can look for button releases later
 */
function copyControllers() {
	lastControllers = [];
	lastControllers.length = controllers.length;
	for (var i = 0; i < controllers.length; i++)
	{
		if (controllers[i]) {
		    lastControllers[i] = copyPad(controllers[i]);
		}
	}
}

/**
 * Used to get the latest set of gamepads from the browser. On Chrome,
 * we have to do this every time we want new state, because it's an entirely
 * new object.
 */
function scanGamePads() {
	// try to get the gamepads, on some browsers, we have to use webkit
	var gamepads = navigator.getGamepads ? navigator.getGamepads() :
	  (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

	// make sure our controllers object has a length property
    controllers.length = gamepads.length;
	// now do the slightly deep copy of the set of controllers
	copyControllers();
	for (var i = 0; i < gamepads.length; i++)
	{
		if (gamepads[i])
	  	{
			if (gamepads[i].index in controllers) {
		  		controllers[gamepads[i].index] = gamepads[i];
			} else {
				addGamePad(gamepads[i]);
			}
		}
	}
}

// add event listeners for game pad connections
window.addEventListener("gamepadconnected", connectionHandler)
window.addEventListener("gamepaddisconnected", removeGamePad)
