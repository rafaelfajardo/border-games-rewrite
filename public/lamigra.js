/* * * * * * * * * * * * * * * *
 *
 *		This is a rewriting/remediation of Crosser (2000 a.c.e.)
 *		there is an accompanying file called "about.js" that contains a dev log
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
const WIDTH = 512;
const HEIGHT = 544;
// counter to toggle between _crosser.html and _lamigra.html
let ctr0 = 1;
// url targets for invoking _crosser.html or _lamigra.html
let url  = "http://localhost:8080/index.html";
let url0 = "http://localhost:8080/_crosser.html";
let url1 = "http://localhost:8080/_lamigra.html";
//
//
//  define state variables
//
let gamestate = "startup"; // variable container should hold string labels "startup", "play", "win", "lose"
let moveState = 'idle'; // container for player character move states can contain 'idle', 'left', 'right'
let flingEsposas = false; // a boolean for launching handcuffs maybe this needs to be a function?
let cuffs; // group container for new esposas which will be newSprites
//
//
//  define background sprites
//
let tierra; // sprite container for the background images
let pipa0; // sprite container for a drain pipe
let pipa1; // sprite container for a drain pipe
let pipa2; // sprite container for a drain pipe
let pipa3; // sprite container for a drain pipe
let pipas; // will be a group of drain pipe sprites
//
//
//  define player character sprites - migra, esposas, bala
//
let migra; // sprite container for player character La Migra SUV
let esposas; // sprite container for handcuffs that animate like Argentine bolas
let bala; // sprite container for lethal projectile. existed in original but has been kept quiet.
//
//
//  define score-counter sprites
//
let avisocontador; // sprite container for counter UI of folks who have crossed and should be located lower left
let avisocounter; // sprite container for counter UI of folks sent back and should be located lower right
//
//
//  define non-player character sprites
//
let maluciadepieles; // sprite container for non-player character
let nitamoreno; // sprite container for non-player character
let linodepieles; // sprite container for non-player character
let carlosmoreno; // sprite container for non-player character who moves in cardinal directions
let marcia; // sprite container for non-player character
let patricialamachona; // sprite container for non-player character
let puercoespin; // sprite container for non-player character
let xrodar; // sprite container for non-player character
//
//  define a collection or group identity for non-player character sprites
let cacahuates; // will be a group of sprites non-player characters
//
//
//  define other set pieces that will be in the foreground
//
let deportacioncenter; // sprite container for environment set piece
let repatriationcenter; // sprite container for environment set piece
let sombra0; // sprite container for environment set piece
let sombra1; // sprite container for environment set piece
let sombra2; // sprite container for environment set piece
//
//
//  define a boolean to set play.p5.js library debug function state
//
let BUGGY = false; // boolean, debug flag, used for debug feature of P5.Play.JS
//
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
/**********
 * this takes a sprite in the renderQueue[] that is
 * also a member of cacahuates [] (a play.p5.js group entity)
 * and sets its movementDir attribute according to a random scheme
 * @param {The sprite to set movementDir for} sprite
 */
 function setPeanutMovementDir(sprite){
   // take the random movement code that was added to updateSprite earlier and paste it here
   // choose a number between 0 and 5 as an index that will yield a direction
   let movementIndex = floor(random(6));
   // map the index to a movementDir
   switch (movementIndex) {
     case 0:
       sprite.movementDir = 'idle';
       sprite.speed = 0;
       break;
     case 1:
       sprite.movementDir = 'left';
       sprite.speed = ONE_UNIT;
       break;
     case 2:
       sprite.movementDir = 'right';
       sprite.speed = ONE_UNIT;
       break;
     case 3:
       sprite.movementDir = 'up';
       sprite.speed = ONE_UNIT;
       break;
     case 4:
     case 5:
       sprite.movementDir = 'down';
       sprite.speed = ONE_UNIT;
       break;
     default:
       console.error('movementIndex is out of range');
       break;
   }
 }

/**********
 * this takes a sprite in the renderQueue[]
 * and checks to see if it is a member of cacahuates []
 * and calls setPeanutMovementDir() if so
 * cacahuate is spanish/nahuatl for peanut
 * @param {The sprite to be checked} sprite
 */
function checkForPeanutSprite(sprite){
  if (cacahuates.length > 0){
    for (let cIdx =0; cIdx < cacahuates.length; cIdx++){
      if (sprite === cacahuates[cIdx]){
        console.log(sprite.name+' is in cacahuates');
        setPeanutMovementDir(sprite);
        //return true;
      }
    }
  }
  //return false;
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

    // can we test queue[currentIndex] us also part of cacahuates group?
    // and then pass queue[currentIndex] to a function that
    // randomizes its direction for the next cycle?
//    If (checkForPeanutSprite(queue[currentIndex])) // if current sprite is in cacahuates
//      setPeanutMovementDir(queue[currentIndex]); // set the movement direction for said sprite
    checkForPeanutSprite(queue[currentIndex]);
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
  // how a sprite moves if it is a non-player character
	switch (sprite.movementDir) {
		case 'left':
			sprite.position.x = sprite.position.x - sprite.speed;
			// bound the x-axis at 0
			if (sprite.position.x < 0) {
				// we calculate the new position as such so that
				// the sprite x position cannot be below 0,
				// we may want to be sure that x should be 32 instead of 16
				sprite.position.x += 32;
			}
			break;
		case 'right':
			// bound the x-axis at the shadows under the bridge
			sprite.position.x = sprite.position.x + sprite.speed;
			if (sprite.position.x > WIDTH-32) {
				// we calculate the new position as such so that
				// the sprite x value can never be more than width-32,
				// in essence bounding the position
				sprite.position.x -= 32;
			}
			break;
		case 'up':
      // bound the y-axis at 32
			sprite.position.y = sprite.position.y - sprite.speed;
      if (sprite.position.y < 0) {
        // calculate the new position as such so that
        // the sprite y position can never be less than 0
        // the sprites are 64 pixels tall and so their center is 32
        sprite.position.y += 32;
      }
			break;
		case 'down':
      // bound the lower y-axis at height-32
			sprite.position.y = sprite.position.y + sprite.speed;
        if (sprite.position.y > HEIGHT-32){
          // the y position of the sprite should never exceed height-32
          sprite.position.y -= 32;
        }
			break;
    case 'idle':
      sprite.position.x = sprite.position.x;
      sprite.position.y = sprite.position.y;
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

/*********************************************************
 *
 *  preload() necessary to load images into sprites
 *
 */
function preload(){
  /*
   *  load images for tierra and set default background
   */
  let img0; // img0 - img9 will be placeholders that only exist within preload function
  let img1;
  let img2;
  let img3;
  let img4;
  let img5;
  let img6;
  let img7;
  let img8;
  let img9;

  timeStamp = millis() / 1000 + renderTime;

  /*
   * load and create tierra
   */
  img0 = loadImage ('img-lamigra/la-migra_masthead.png'); // title screen image
  if (BUGGY){
    img1 = loadImage ('img-lamigra/frontera02_grid.png');  // this is the game play field and is 512 x 544 pixels with a grid
  } else {
    img1 = loadImage ('img-lamigra/frontera02.png');  // this is the game play field and is 512 x 544 pixels without a grid
  }
  img2 = loadImage ('img-lamigra/la-migra_cold_one_017.png');
  img3 = loadImage ('img-lamigra/la-migra_cold_one_018.png');
  tierra = createSprite (256,272); // 256,256 presumes a 512 x 512 background. this is not true, actually 512 x 544. fixed to 256 x 272
  tierra.addImage ('masthead',img0); // title screen
  tierra.addImage ('mapa', img1); // gameplay screen
  tierra.addImage ('pierdes', img2); // loss screen
  tierra.addImage ('ganas',img3); // victory screen
  tierra.changeImage('mapa'); // set the background to mapa while we develop, will need to change later
  tierra.debug = BUGGY; // set the debug flag

  /*
   *  load images for drain pipe set piece along bottom of screen
   */
  img0 = loadImage ('img-lamigra/pipeA.png'); // is the resting state for a pipe sprite
  img1 = loadImage ('img-lamigra/pipeB.png'); // is the illuminated, activated state for a pipe sprite
  pipa0 = createSprite (2*32+16, 16*32+16, 32, 32);
  pipa0.addImage ('pipa', img0);
  pipa0.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa0.changeAnimation('pipa activated'); // will need to change this state later
  pipa0.debug = BUGGY; // set the debug flag
  //renderQueue.push(pipa0); // add pipa0 to renderQueue []
  //pipa0.name = 'pipa0';
  //pipa0.animation.playing = false;
  //pipa0.movementDir = 'idle';
  //pipa0.speed = 0;

  pipa1 = createSprite (32*5+16, 16*32+16, 32, 32);
  pipa1.addImage ('pipa', img0);
  pipa1.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa1.changeAnimation('pipa activated'); // will need to change this state later
  pipa1.debug = BUGGY; // set the debug flag
  //renderQueue.push(pipa1); // add pipa1 to renderQueue []
  //pipa1.name = 'pipa1';
  //pipa1.animation.playing = false;
  //pipa1.movementDir = 'idle';
  //pipa1.speed = 0;

  pipa2 = createSprite (32*8+16, 16*32+16, 32, 32);
  pipa2.addImage ('pipa', img0);
  pipa2.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa2.changeAnimation('pipa activated'); // will need to change this state later
  pipa2.debug = BUGGY; // set the debug flag
  //renderQueue.push(pipa2); // add pipa2 to renderQueue []
  //pipa2.name = 'pipa2';
  //pipa2.animation.playing = false;
  //pipa2.movementDir = 'idle';
  //pipa2.speed = 0;

  pipa3 = createSprite (32*11+16, 16*32+16, 32, 32);
  pipa3.addImage ('pipa', img0);
  pipa3.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa3.changeAnimation('pipa activated'); // will need to change this state later
  pipa3.debug = BUGGY; // set the debug flag
  //renderQueue.push(pipa3); // add pipa3 to renderQueue []
  //pipa3.name ='pipa3';
  //pipa3.animation.playing = false;
  //pipa3.movementDir = 'idle';
  //pipa3.speed = 0;

  pipas = new Group(); // the group of drain pipes, should allow for testing collision with group
  pipas.add (pipa0); // push pipa0 onto pipas group which acts like an array
  pipas.add (pipa1);
  pipas.add (pipa2);
  pipas.add (pipa3);

  /*
   * load images for migra, player character
   */
  img0 = loadImage('img-lamigra/migra_car-1.png');
  img1 = loadImage('img-lamigra/migra_car-2.png');
  migra = createSprite (8*32, 13*32+16, 64, 32); // verify the size of images for this sprite
  migra.addAnimation('move', img0,img0,img0,img0,img1,img1,img0,img0);
  migra.addAnimation('stay',img0,img0);
  migra.changeAnimation ('stay');
  migra.debug = BUGGY; // set the debug flag
  renderQueue.push(migra); // add migra to renderQueue []
  migra.name = 'migra';
  migra.animation.playing = false;
  migra.movementDir = 'idle';
  migra.speed = 32;

  /*
   * load images for esposas sprite
   */
  img0 = loadImage('img-lamigra/esposas_0.png');
  img1 = loadImage('img-lamigra/esposas_1.png');
  img2 = loadImage('img-lamigra/esposas_2.png');
  img3 = loadImage('img-lamigra/esposas_3.png');
  esposas = createSprite (8*32+16, 12*32+16, 32, 32,); // the esposas launch from the front of the vehicle, and so will need to refer to migra.x-position.
  esposas.addAnimation('lanzar',img0,img0,img1,img1,img2,img2,img3,img3); // this will change later, here for testing purposes
  esposas.debug = BUGGY; // set the debug flag
  renderQueue.push(esposas); // add esposas to renderQueue []
  esposas.name = 'esposas';
  esposas.animation.playing = true;
  esposas.movementDir = 'up';
  esposas.speed = 32;

  /*
   *  to do: load images for bala(s) (or not)
   */

   /*
    * load imgages for avisocontador sprite, should be yellow sign
    */
   img0 = loadImage('img-lamigra/counter-2-0.png');
   img1 = loadImage('img-lamigra/counter-2-1.png');
   img2 = loadImage('img-lamigra/counter-2-2.png');
   img3 = loadImage('img-lamigra/counter-2-3.png');
   img4 = loadImage('img-lamigra/counter-2-4.png');
   img5 = loadImage('img-lamigra/counter-2-5.png');
   img6 = loadImage('img-lamigra/counter-2-6.png');
   img7 = loadImage('img-lamigra/counter-2-7.png');
   img8 = loadImage('img-lamigra/counter-2-8.png');
   img9 = loadImage('img-lamigra/counter-2-9.png');
   avisocontador = createSprite (16, 32*14+16, 32, 32);
   avisocontador.addAnimation('test',img0,img1,img2,img3,img4,img5,img6,img7,img8,img9);
   avisocontador.debug = BUGGY; // set the debug flag

  /*
   * load images for avisocounter sprite, should be pale blue sign
   */
  img0 = loadImage('img-lamigra/counter-3-0.png');
  img1 = loadImage('img-lamigra/counter-3-1.png');
  img2 = loadImage('img-lamigra/counter-3-2.png');
  img3 = loadImage('img-lamigra/counter-3-3.png');
  img4 = loadImage('img-lamigra/counter-3-4.png');
  img5 = loadImage('img-lamigra/counter-3-5.png');
  img6 = loadImage('img-lamigra/counter-3-6.png');
  img7 = loadImage('img-lamigra/counter-3-7.png');
  img8 = loadImage('img-lamigra/counter-3-8.png');
  img9 = loadImage('img-lamigra/counter-3-9.png');
  avisocounter = createSprite (14*32+16, 16*32+16, 32, 32);
  avisocounter.addAnimation('test',img0,img1,img2,img3,img4,img5,img6,img7,img8,img9);
  avisocounter.debug = BUGGY; // set the debug flag

  /*
   *  load images for MariaLucia De Pieles non-player character sprite
   */
  maluciadepieles = createSprite (4*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/marialucia-2_01.png');
  img1 = loadImage('img-lamigra/marialucia-2_02.png');
  maluciadepieles.addAnimation('down', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marialucia-2_03.png');
  img1 = loadImage('img-lamigra/marialucia-2_04.png');
  maluciadepieles.addAnimation('right', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marialucia-2_05.png');
  img1 = loadImage('img-lamigra/marialucia-2_06.png');
  maluciadepieles.addAnimation('left', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marialucia-2_07.png');
  img1 = loadImage('img-lamigra/marialucia-2_08.png');
  maluciadepieles.addAnimation('up', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marialucia-2_11.png');
  img1 = loadImage('img-lamigra/marialucia-2_12.png');
  maluciadepieles.addAnimation('caught down', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marialucia-2_12.png');
  img1 = loadImage('img-lamigra/marialucia-2_13.png');
  maluciadepieles.addAnimation('caught right', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marialucia-2_09.png');
  maluciadepieles.addAnimation('caught jump', img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/marialucia-2_10.png');
  maluciadepieles.addAnimation('muerto', img1,img1,img1,img1);
  maluciadepieles.changeAnimation('down');
  maluciadepieles.debug = BUGGY; // set the debug flag
  renderQueue.push(maluciadepieles); // add maluciadepieles to renderQueue []
  maluciadepieles.name = 'maluciadepieles';
  maluciadepieles.animation.playing = false;
  maluciadepieles.movementDir = 'idle';
  maluciadepieles.speed = 32;

  /*
   * load images for Nita Moreno non-player character
   */
  nitamoreno = createSprite (8*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/nita-2_01.png');
  img1 = loadImage('img-lamigra/nita-2_02.png');
  nitamoreno.addAnimation('down', img0,img0,img1,img1); // resolved - something wrong here
  img0 = loadImage('img-lamigra/nita-2_03.png');
  img1 = loadImage('img-lamigra/nita-2_04.png');
  nitamoreno.addAnimation('right', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/nita-2_05.png');
  img1 = loadImage('img-lamigra/nita-2_06.png');
  nitamoreno.addAnimation('left', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/nita-2_07.png');
  img1 = loadImage('img-lamigra/nita-2_08.png');
  nitamoreno.addAnimation('up', img0,img0,img1,img1); // resolved - something wrong here
  img0 = loadImage('img-lamigra/nita-2_11.png');
  img1 = loadImage('img-lamigra/nita-2_12.png');
  nitamoreno.addAnimation('caught down', img0,img0,img1,img1);
  img2 = loadImage('img-lamigra/nita-2_13.png');
  nitamoreno.addAnimation('caught right', img1,img1,img2,img2);
  img0 = loadImage('img-lamigra/nita-2_09.png');
  nitamoreno.addAnimation('caught jump', img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/nita-2_10.png');
  nitamoreno.addAnimation('muerto', img1,img1,img1,img1);
  nitamoreno.changeAnimation('down');
  nitamoreno.debug = BUGGY; // set the debug flag
  renderQueue.push(nitamoreno); // add nitamoreno to renderQueue []
  nitamoreno.name = 'nitamoreno';
  nitamoreno.animation.playing = false;
  nitamoreno.movementDir = 'idle';
  nitamoreno.speed = 32;

  /*
   *  load images for Lino De Pieles non-player character sprite
   */
  linodepieles = createSprite (2*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/lino-2_01.png');
  img1 = loadImage('img-lamigra/lino-2_02.png');
  linodepieles.addAnimation('down', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/lino-2_03.png');
  img1 = loadImage('img-lamigra/lino-2_04.png');
  linodepieles.addAnimation('left', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/lino-2_05.png');
  img1 = loadImage('img-lamigra/lino-2_06.png');
  linodepieles.addAnimation('up', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/lino-2_07.png');
  img1 = loadImage('img-lamigra/lino-2_08.png');
  linodepieles.addAnimation('right', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/lino-2_11.png');
  img1 = loadImage('img-lamigra/lino-2_12.png');
  linodepieles.addAnimation('caught down', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/lino-2_12.png');
  img1 = loadImage('img-lamigra/lino-2_13.png');
  linodepieles.addAnimation('caught right', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/lino-2_09.png');
  linodepieles.addAnimation('caught jump', img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/lino-2_10.png');
  linodepieles.addAnimation('muerto', img1,img1,img1,img1);
  linodepieles.changeAnimation('down');
  linodepieles.debug = BUGGY; // set the debug flag
  renderQueue.push(linodepieles);
  linodepieles.name = 'linodepieles';
  linodepieles.animation.playing = false;
  linodepieles.movementDir = 'idle';
  linodepieles.speed = 32;

  /*
   * add imgages for Carlos Moreno non-player character
   */
  carlosmoreno = createSprite (16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/Carlos-Moreno-3_01.png');
  img1 = loadImage('img-lamigra/Carlos-Moreno-3_02.png');
  carlosmoreno.addAnimation('down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/Carlos-Moreno-3_03.png');
  img1 = loadImage('img-lamigra/Carlos-Moreno-3_04.png');
  carlosmoreno.addAnimation('up', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/Carlos-Moreno-3_05.png');
  img1 = loadImage('img-lamigra/Carlos-Moreno-3_06.png');
  carlosmoreno.addAnimation('right', img0,img0,img1,img1);
  img1 = loadImage('img-lamigra/Carlos-Moreno-3_07.png');
  img0 = loadImage('img-lamigra/Carlos-Moreno-3_08.png');
  carlosmoreno.addAnimation('left', img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/Carlos-Moreno-3_11.png');
  img1 = loadImage('img-lamigra/Carlos-Moreno-3_12.png');
  carlosmoreno.addAnimation('caught down', img0,img0,img1,img1);
  img2 = loadImage('img-lamigra/Carlos-Moreno-3_13.png');
  carlosmoreno.addAnimation('caught right', img1,img1,img2,img2);
  img0 = loadImage('img-lamigra/Carlos-Moreno-3_14.png');
  carlosmoreno.addAnimation('caught jump', img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/Carlos-Moreno-3_15.png');
  carlosmoreno.addAnimation('muerto', img1,img1,img1,img1);
  carlosmoreno.changeAnimation('down');
  carlosmoreno.debug = BUGGY; // set the debug flag
  renderQueue.push(carlosmoreno); // add carlosmoreno to renderQueue []
  carlosmoreno.name = 'carlosmoreno';
  carlosmoreno.animation.playing = false;
  carlosmoreno.movementDir = 'idle';
  carlosmoreno.speed = 32;

  /*
   *  load images for Marcia non-player character sprite
   */
  marcia = createSprite(6*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/marcia-3_01.png');
  img1 = loadImage('img-lamigra/marcia-3_02.png');
  marcia.addAnimation('down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marcia-3_03.png');
  img1 = loadImage('img-lamigra/marcia-3_04.png');
  marcia.addAnimation('up',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marcia-3_05.png');
  img1 = loadImage('img-lamigra/marcia-3_06.png');
  marcia.addAnimation('right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marcia-3_07.png');
  img1 = loadImage('img-lamigra/marcia-3_08.png');
  marcia.addAnimation('left',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marcia-3_11.png');
  img1 = loadImage('img-lamigra/marcia-3_12.png');
  marcia.addAnimation('caught down',img0,img0,img1,img1); // resolved - one of these frames is not transparent
  img0 = loadImage('img-lamigra/marcia-3_12.png');
  img1 = loadImage('img-lamigra/marcia-3_13.png');
  marcia.addAnimation('caught right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/marcia-3_09.png');
  marcia.addAnimation('caught jump',img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/marcia-3_10.png');
  marcia.addAnimation('muerto',img1,img1,img1,img1);
  marcia.changeAnimation('down');
  marcia.debug = BUGGY; // set the debug flag
  renderQueue.push(marcia); // add marcia to renderQueue []
  marcia.name = 'marcia';
  marcia.animation.playing = false;
  marcia.movementDir = 'idle';
  marcia.speed = 32;

  /*
   * load images for Patricia La Machona non-player character sprite
   */
  patricialamachona = createSprite (10*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/patricia-2_01.png');
  img1 = loadImage('img-lamigra/patricia-2_02.png');
  patricialamachona.addAnimation('down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/patricia-2_03.png');
  img1 = loadImage('img-lamigra/patricia-2_04.png');
  patricialamachona.addAnimation('right',img1,img1,img0,img0);
  img0 = loadImage('img-lamigra/patricia-2_05.png');
  img1 = loadImage('img-lamigra/patricia-2_06.png');
  patricialamachona.addAnimation('up',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/patricia-2_07.png');
  img1 = loadImage('img-lamigra/patricia-2_08.png');
  patricialamachona.addAnimation('left',img1,img1,img0,img0);
  img0 = loadImage('img-lamigra/patricia-2_11.png');
  img1 = loadImage('img-lamigra/patricia-2_12.png');
  patricialamachona.addAnimation('caught down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/patricia-2_12.png');
  img1 = loadImage('img-lamigra/patricia-2_13.png');
  patricialamachona.addAnimation('caught right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/patricia-2_09.png');
  patricialamachona.addAnimation('caught jump',img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/patricia-2_10.png');
  patricialamachona.addAnimation('muerto',img1,img1,img1,img1);
  patricialamachona.changeAnimation('down');
  patricialamachona.debug = BUGGY; // set the debug flag
  renderQueue.push(patricialamachona); // add patricialamachona to renderQueue []
  patricialamachona.name = 'patricialamachona';
  patricialamachona.animation.playing = false;
  patricialamachona.movementDir ='idle';
  patricialamachona.speed = 32;

  /*
   *  load imgaes for Puercoespin non-player character sprite
   */
  puercoespin = createSprite (12*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/porcupine_01.png');
  img1 = loadImage('img-lamigra/porcupine_02.png');
  puercoespin.addAnimation('down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/porcupine_03.png');
  img1 = loadImage('img-lamigra/porcupine_04.png');
  puercoespin.addAnimation('right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/porcupine_05.png');
  img1 = loadImage('img-lamigra/porcupine_06.png');
  puercoespin.addAnimation('left',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/porcupine_07.png');
  img1 = loadImage('img-lamigra/porcupine_08.png');
  puercoespin.addAnimation('up',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/porcupine_16.png');
  img1 = loadImage('img-lamigra/porcupine_15.png');
  puercoespin.addAnimation('caught down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/porcupine_15.png');
  img1 = loadImage('img-lamigra/porcupine_17.png');
  puercoespin.addAnimation('caught right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/porcupine_13.png');
  puercoespin.addAnimation('caught jump',img0,img0,img0,img0);
  img1 = loadImage('img-lamigra/porcupine_14.png');
  puercoespin.addAnimation('muerto',img1,img1,img1,img1);
  puercoespin.changeAnimation('down');
  puercoespin.debug = BUGGY; // set the debug flag
  renderQueue.push(puercoespin); // add puercoespin to renderQueue []
  puercoespin.name = 'puercoespin';
  puercoespin.animation.playing = false;
  puercoespin.movementDir = 'idle';
  puercoespin.speed = 32;

  /*
   *  load images for X-rodar non-player character sprite
   */
  xrodar = createSprite(14*32+16, 2*32, 32, 64);
  img0 = loadImage('img-lamigra/X-rodar-3_01.png');
  img1 = loadImage('img-lamigra/X-rodar-3_02.png');
  xrodar.addAnimation('down',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/X-rodar-3_03.png');
  img1 = loadImage('img-lamigra/X-rodar-3_04.png');
  xrodar.addAnimation('right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/X-rodar-3_05.png');
  img1 = loadImage('img-lamigra/X-rodar-3_06.png');
  xrodar.addAnimation('left',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/X-rodar-3_07.png');
  img1 = loadImage('img-lamigra/X-rodar-3_08.png');
  xrodar.addAnimation('up',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/X-rodar-3_11.png');
  img1 = loadImage('img-lamigra/X-rodar-3_12.png');
  xrodar.addAnimation('caught down',img0,img0,img1,img1); // resolved - one frame has white pixels
  img0 = loadImage('img-lamigra/X-rodar-3_12.png');
  img1 = loadImage('img-lamigra/X-rodar-3_13.png');
  xrodar.addAnimation('caught right',img0,img0,img1,img1);
  img0 = loadImage('img-lamigra/X-rodar-3_09.png');
  xrodar.addAnimation('caught jump',img0,img0,img0,img0); // resolved - image is not transparent
  img1 = loadImage('img-lamigra/X-rodar-3_10-copy-b.png');
  xrodar.addAnimation('muerto',img1,img1,img1,img1); // resolved - image is not transparent
  xrodar.changeAnimation('down');
  xrodar.debug = BUGGY; // set the debug flag
  renderQueue.push(xrodar); // add xrodar to renderQueue []
  xrodar.name = 'xrodar';
  xrodar.animation.playing = false;
  xrodar.movementDir = 'idle';
  xrodar.speed = 32;

  /*
   *  create a group for non-player characters
   */
  cacahuates = new Group();
  cacahuates.add(maluciadepieles);
  cacahuates.add(nitamoreno);
  cacahuates.add(linodepieles);
  cacahuates.add(carlosmoreno);
  cacahuates.add(marcia);
  cacahuates.add(patricialamachona);
  cacahuates.add(puercoespin);
  cacahuates.add(xrodar);

  /*
   *  load image for deportation center
   */
  deportacioncenter = createSprite (15*32+16, 15*32+16, 32, 96);
  img0 = loadImage('img-lamigra/gates3A.png');
  img1 = loadImage('img-lamigra/gates3B.png');
  deportacioncenter.addImage('gate', img0);
  deportacioncenter.addAnimation('gate activated', img0, img1,img1,img1,img1, img0);
  deportacioncenter.changeAnimation('gate activated'); // will change, activated for testing purposes during development
  deportacioncenter.debug = BUGGY; // set the debug flag

  /*
   *  load image for repatriation center
   */
   repatriationcenter = createSprite (15*32+16, 32+16, 32, 96);
   img0 = loadImage('img-lamigra/porton3A.png');
   img1 = loadImage('img-lamigra/porton3B.png');
   repatriationcenter.addImage('gate', img0);
   repatriationcenter.addAnimation('gate activated', img0, img1,img1,img1,img1, img0);
   repatriationcenter.changeAnimation('gate activated'); // will change,
   repatriationcenter.debug = BUGGY; // set the debug flag

   /*
    * load image for shadows along right hand side of screen
    */
    sombra0 = createSprite (15*32+16, 4*32+16, 32, 96); // will contain shadowB.png
    sombra1 = createSprite (15*32+16, 8*32, 32, 128); // will contain shadowC.png
    sombra2 = createSprite (15*32+16, 12*32, 32, 128); // will contain shadowC.png
    img0 = loadImage('img-lamigra/shadowC.png'); // used twice, mid right, lower right
    img1 = loadImage('img-lamigra/shadowB.png'); // used once, upper right
    sombra0.addImage('sombra', img1);
    sombra1.addImage('sombra', img0);
    sombra2.addImage('sombra', img0);
    sombra0.debug = BUGGY; // set the debug flag
    sombra1.debug = BUGGY; // set the debug flag
    sombra2.debug = BUGGY; // set the debug flag

} // end preload()

/***********************************************************
 *
 *
 *
 */
function setup() {
  // put setup code here
  //createCanvas(512,544); // La Migra default canvas size
  //createCanvas(448, 548); // Crosser default canvas size
  let canvas = createCanvas(512, 544); // suggested by p5js.org reference for parent()
  canvas.parent('canvas-column'); // place the sketch canvas within the div named canvas-column within index.html
  noCursor(); // testing cursor manipulation
	// cursor(HAND); // HAND, ARROW, CROSS, MOVE, TEXT, WAIT
  frameRate(30);
  background(128);
  cuffs = new Group(); // a group of esposas-like sprites

}

function draw() {
  // put drawing code here
  background(128);

  /*
   * I have commented out the switch statement during the early part of coding
   *
  switch (gamestate) { // switch is not documented in P5.JS but is part of Javascript
    case "startup":
      // statements to display the startup condition
      // statements that may alter gamestate label and condition
      break;
    case "play":
      // statements that display gameplay
      break;
    case "lose":
      // statements that display loss condition
      break;
    case "win":
      // statements that display win condition
      break;
    default:
      // statements that catch and redirect in case none of the above is true
  } */

  // sketch to fling cuffs -- esposas in spanish -- upward
  if (flingEsposas){
    let newSprite = createSprite(migra.position.x+16, migra.position.y,32,32);
    newSprite.addAnimation('lanzar', 'img-lamigra/esposas_0.png',
                                     'img-lamigra/esposas_1.png',
                                     'img-lamigra/esposas_2.png',
                                     'img-lamigra/esposas_3.png');
    cuffs.add(newSprite); // add new sprite to group cuffs
    flingEsposas = false;
    renderQueue.push(newSprite);
    newSprite.name = 'cuffs['+cuffs.length+']';
    newSprite.animation.playing = 'true';
    newSprite.movementDir = 'up';
    newSprite.speed = 32;
    /*
    let cuffsIndex = cuffs.length + 1;
    cuffs[cuffsIndex] = esposas;
    cuffs[cuffsIndex].position.x = migra.position.x + 16;
    cuffs[cuffsIndex].position.y = migra.position.y - 32;
    cuffs[cuffsIndex].changeAnimation('lanzar');
    cuffs[cuffsIndex].animation.play();
    */
    //createCuff();

  }
/*
  // sketch to move cuffs
  if (cuffs.length > 0){
    for (let i = 0; i < cuffs.length; i++){
      let oldX = cuffs[i].position.x;
      let oldY = cuffs[i].position.y;
      cuffs[i].position.y = oldY-32;
      if (oldY - 32 < 7*32){
        cuffs[i].remove();
      }
    }
  }
  */
  // sketch to move player character
  if (moveState === 'left'){
    migra.changeAnimation ('move');
    migra.animation.play();
    migra.position.x = migra.position.x - 32;
    if (migra.position.x-32 < 0){
      migra.position.x += 32; // create bounds on movement
    }
    moveState = 'idle'
    migra.animation.stop();
  } else if (moveState === 'right'){
    migra.changeAnimation ('move');
    migra.animation.play();
    migra.position.x = migra.position.x + 32;
    if (migra.position.x+32 > WIDTH){
      migra.position.x -= 32;
    }
    moveState = 'idle'
    migra.animation.stop();
  } else {
    moveState = 'idle';
    //migra.position.x = migra.position.x;
  }
  updateRendering(renderQueue, renderTime);
  drawSprites();
}


/*******************************************************
 *
 *  keyboard player/user input
 *
 */

/* *******************
 *  redundant chunk?
function keyPressed (){
  if (keyCode === 68){
    migra.changeAnimation('move');
  }
  return false;
}

function keyReleased (){
  if (keyCode === 68){
    migra.changeAnimation('stay');
  }
  return false;
}
//********************
*/


function keyTyped(){ // tested once per frame, triggered on keystroke
	if        (keyCode === '38'     || //keyDown(UP_ARROW) || // arrow keys are not responding, also poorly documented
		         key === 'w'          ||
		         key === 'W'          ||
		         key === 'i'          ||
		         key === 'I') {
		print('upward key pressed');
    flingEsposas = true;

	} else if (keyCode === '40' || //keyCode === 'ArrowDown'  ||
		         key === 's'            ||
		         key === 'S'            ||
		         key === 'k'            ||
		         key === 'K') {
    print('downward key pressed');

	} else if (//keyCode === '37' || //key === 'ArrowLeft'  ||
	           key === 'a'            ||
		         key === 'A'            ||
		         key === 'j'            ||
		         key === 'J') {
		print('leftward key pressed');
    moveState = 'left';

	} else if (keyCode === '39' || //key === 'ArrowRight'  ||
		         key === 'd'             ||
		         key === 'D'             ||
		         key === 'l'             ||
		         key === 'L') {
		print('rightward key pressed');
    moveState = 'right';

	} else if (key === 't'  ||
						 key === 'T') {
	  print('t key pressed');
		//START = true;
	} else if (key === 'y'   ||
             key === 'Y') {
		print('y key pressed');

  } else if (key === 'g'  ||
             key === 'G'){
    print('g key pressed');

	} else if (key === 'h'  ||
             key === 'H'){
    print('h key pressed');
  } else {
    moveState = 'idle'; // create an idle state for player character
  }
	return false;

} // end keyTyped
