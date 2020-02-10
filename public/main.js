/*
 *
 *  main.js should contain logic for selecting which game to play
 *  it will use P5.JS and P5.Play.JS
 *
 */

// declare global variables

// preload
function preload(){

}

// setup
function setup(){
  createCanvas(448, 548);
  frameRate(20); // tried as slow as 1fps
  background(128);
  noCursor(); // testing cursor manipulation
	// cursor(HAND); // HAND, ARROW, CROSS, MOVE, TEXT, WAIT


}

// draw
function draw(){
  // if not playing then show selection UI
    // if selecting to play Crosser then show Crosser and hide others
    // if selecting to play La Migra then show La Migra and hide others

    // experimental code for gamepad
  	let pads = navigator.getGamepads(); // this samples the gamepad once per frame and is core HTML5/JavaScript
  	let pad0 = pads[0]; // limit to first pad connected
  	if (pad0) { // this is an unfamiliar construction I think it test that pad0 is not null
  		updateStatus(pad0); // will need an updateStatus() function
  	} else { // what to do if pad0 is null, which is to say there is no gamepad connected
  		// use keyboard
  		// or use touches
      //console.log(pads);
  	}

}

// key or controller interface
function updateStatus(pad){ // tested once per frame

	if (pad.axes[0] === -1){ print('NES dpad left');}//{ moveLeft = true;} else { moveLeft = false; }
	if (pad.axes[0] ===  1){ print('NES dpad right');}//{ moveRight = true;} else { moveRight = false; }
	if (pad.axes[1] === -1){print('NES dpad up');}//{ moveUp = true;} else { moveUp = false; }
	if (pad.axes[1] ===  1){print('NES dpad down')}//{ moveDown = true;} else { moveDown = false; }
	//if (pad.buttons[0].value === 0){ print('NES B button inactive')}
	if (pad.buttons[0].value === 1){ print('NES B button pressed'); }
	//if (pad.buttons[1].value === 0){}
	if (pad.buttons[1].value === 1){ print('NES A button pressed'); }
	//if (pad.buttons[8].value > 0){}
	if (pad.buttons[8].value === 1){ print('NES Select pressed'); }
	//if (pad.buttons[9].value > 0){}
	if (pad.buttons[9].value === 1){ print('NES Start pressed'); }
	return;
}


function keyTyped(){
  /*
  if keyCode(71){ // keyCode for 'g' use for 'select' on controller
    // toggle between Crosser and La Migra highlight selection
    // can use a counter and modulo and set up an odd or even case
    // counter+=
    // if counter%(2) === 0 then do the following
    // else do the following

  }

  if keyCode(72){ // keyCode for 'h' use for 'start' on controller
    // start the highlighted selection
  }
*/
}

// function play( game ){}
