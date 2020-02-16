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
// udpdateStatus(pad) has been moved to controller.js
// keyTyped() has been moved to controller.js
// function play( game ){}
