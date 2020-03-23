/*
 *
 * controller.js will contain code for html5gamepad
 * that can be encapsulated into a function
 * there is some mission critical code that has to live in the draw() loop
 * within the main.js because it has to check state every frame.
 *
 * documentation will be in the tail of this file.
 *
 */

/*
 * our canonical controller is the
 * USB,2-axis 8-button gamepad (STANDARD GAMEPAD Vendor: 0583 Product: 2060)
 * sold by Buffalo Inc. (iBuffalo?)
 * as the Buffalo Classic USB Gamepad
 * Model: BSGP810GY
 * S/N:A70911
 *
 * I have used the https://html5gamepad.com/ website
 * to test and map the buttons for the
 * Buffalo Classic USB Gamepad.
 *
 * The mapping is:
 * USB,2-axis 8-button gamepad (STANDARD GAMEPAD Vendor: 0583 Product: 2060)
 * NB. The axes are also mapped to buttons,
 * and the "Turbo" and "Clear" buttons are not recognized by -- or mapped by -- the html5 library
 *
 * The mapping of this device is considered STANDARD
 *
 *   d-pad
 *   Axis-0: 0.00392 to -1.00000 (x-axis leftward)
 *         also, mapped to button-14, 0 1
 *   Axis-0: 0.00392 to 1.00000 (x-axis in rightward)
 *         also, mapped to button-15, 0 1
 *   Axis-1: 0.00392 to -1.00000 (y-axis downward)
 *         also, mapped to button-13, 0 1
 *   Axis-1: 0.00392 to 1.00000 (y-axis upward)
 *         also, mapped to button-12, 0 1
 *
 *   buttons
 * B0: SNES B button 0 1
 * B1: SNES A button 0 1
 * B2: SNES Y button 0 1
 * B3: SNES X button 0 1
 * B4: SNES Left Shoulder button 0 1
 * B5: SNES Right Shoulder button 0 1
 * B6: SNES Left Shoulder button 0 1 (this is redundant circuit?)
 * B7: SNES Right Shoulder button 0 1 (redundant circuit?)
 * B8: SNES Select button 0 1
 * B9: SNES Start Button 0 1
 * B10: no mapping detected
 * B11: no mapping detected
 * B12: Axis-1, y-axis upward 0 1 (redundant? but useful)
 * B13: Axis-1, y-axis downward 0 1 (redundant? but useful)
 * B14: Axis-0, x-axis leftward 0 1 (redundant? but useful)
 * B15: Axis-0, x-axis rightward 0 1 (redundant? but useful)
 *
 * The d-pad is digital, not analog, on this device. (NB verify?)
 * The redundant mapping of the d-pad to buttons is useful for Crosser and La Migra
 * because the gamepad object value is simple 0 or 1 rather than a floating point.
 *
 * There is logic available to isolate a single button push
 * rather than return true for multiple frames because the cycles are so fast:
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
 * It creates a "newPress" boolean variable to execute new presses instead of press-and-hold situations.
 *
 * There is logic available for TURBO, also on:
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
 * which may let us disable this feature in software rather than hardware
 *
 // turbo code ***********
 if(gamepadAPI.turbo) {
  if(gamepadAPI.buttonPressed('A','hold')) {
    this.turbo_fire();
  }
  if(gamepadAPI.buttonPressed('B')) {
    this.managePause();
  }
}
 // end turbo code ***********
 */

/*
 // experimental code for gamepad
 // needs to be called every frame and is in draw loop
 // sourced from ...
 // https://editor.p5js.org/rafaelfajardo/sketches/AT6P-Ikrd4

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
*/


// key or controller interface
function updateStatus(pad){ // tested once per frame, should be called from draw() in p5.js, or a function that updates with that frequency in JavaScript
//if (pad.id === "USB,2-axis 8-button gamepad (STANDARD GAMEPAD Vendor: 0583 Product: 2060)"){ // this line would test which controller ID is connected
    if (pad.buttons[0].value === 1){ print('SNES B-button pressed');}
    if (pad.buttons[1].value === 1){ print('SNES A-button pressed');}
    if (pad.buttons[2].value === 1){ print('SNES Y-button pressed');}
    if (pad.buttons[3].value === 1){ print('SNES X-button pressed');}
    if (pad.buttons[4].value === 1){ print('SNES L-button pressed');}
    if (pad.buttons[5].value === 1){ print('SNES R-button pressed');}
    if (pad.buttons[6].value === 1){ print('SNES L-button pressed');} // redundant mapping
    if (pad.buttons[7].value === 1){ print('SNES R-button pressed');} // redundant mapping
    if (pad.buttons[8].value === 1){ print('SNES SELECT button pressed');}
    if (pad.buttons[9].value === 1){ print('SNES START button pressed');}
    if (pad.buttons[10].value === 1){ print('unmapped button 10');} // I haven't found a signal on this button[index]
    if (pad.buttons[11].value === 1){ print('unmapped button 11');} // I haven't found a signal on this button[index]
    if (pad.buttons[12].value === 1){ print('SNES D-pad up pressed');} // redundant with axes 1 (Y-value)
    if (pad.buttons[13].value === 1){ print('SNES D-pad down pressed');} // redundant with axes 1 (Y-value)
    if (pad.buttons[14].value === 1){ print('SNES D-pad left pressed');} // redundant with axes 0 (X-value)
    if (pad.buttons[15].value === 1){ print('SNES D-pad right pressed');} // redundant with axes 0 (X-value)
/*
}  elseif (pad.id === ""){ // the following is a mapping for the NES USB controller in the studio
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
} */
return;
}

/* commenting out keyTyped() becasue ui.js is experimenting with similar use.
// keyTyped was copied from crosser.js
// keyboard mapping W,A,S,D; I,J,K,L; T,Y; as actionable
// will likely have to pass the values of moveUp, moveDown, moveLeft, moveRight for this to work.
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
	} else if (key === 't'  ||  // this bit is a little crufty
						 key === 'T') {
	  print('t');
		START = true;
	} else if (key === 'y') {  // this bit is a little crufty too
		print('y');
	}
//
  // another option for mapping start and select functions
//  if keyCode(71){ // keyCode for 'g' use for 'select' on controller
   // toggle between Crosser and La Migra highlight selection
   // can use a counter and modulo and set up an odd or even case
   // counter+=
   // if counter%(2) === 0 then do the following
   // else do the following
//  }
//  if keyCode(72){ // keyCode for 'h' use for 'start' on controller
   // start the highlighted selection
//  }
//
//	return false;

} // end keyTyped
*/

/* commented out touch UI which may be revisited at a later time
// touchStarted was copied from crosser.js
function touchStarted(){
	// touch controller
	// poorly documented overview says touchX and touchY are analagous to mouseX and mouseY
	// buried in a github page, not the friendly public facing p5js.org
	// test on openprocessing yields an error treating touchX and touchY as undefined variables
	// touch functionality seems to have broken on 2019 06 04 after adding cadaver and other assets
	// /*
	d pad sprite is currently 96 x 96 pixels. 3 x 32 X 3 x 32
	sprite center will be 48 x 48
	controller origin top left corner (conX,conY)
	d pad button edges can be a multiple of the offsets offX and offY
 */
  /*
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
	//return false; // this statement is being called an illegal return by console on chrome
} // end touchStarted
*/




/* a useful website for testing controllers is:
 * https://html5gamepad.com/
 *
 * the Mozilla gamepad API for html5 is found:
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
 *
 * a proof that the html5gamepad API works with p5.js is found:
 * https://www.openprocessing.org/sketch/814482
 * and
 * https://editor.p5js.org/rafaelfajardo/sketches/AT6P-Ikrd4
 * these are currently coded for PS3 controllers
 * but could be remapped with the appropriate inputs for other controllers
 *
 * another PS3 controller map example exists at:
 * https://editor.p5js.org/rafaelfajardo/sketches/kW5PrOqu6
 *
 */

 /* the mappings for the other controllers in the studio are:
  *
  generic USB NES gamepad:
  usb gamepad (Vendor: 0810 Product: e501)
  Axis 0 (x axis)  values -1 -0.00392 1 so digital
  Axis 1 (y axis)  values -1 up  -0.00392 1 down
  B0 is the B button values 0 1
  B1 is the A button values 0 1
  B8 is the SELECT button values 0 1
  B9 is the START button values 0 1

  *
  *

  Exlene USB SNES gamepad:
  Axis 0 (x axis) unresponsive lists a value as -0.99216
  Axis 1 (y axis) values -1 up -0.00392 1 down
  B0 is the A button values 0 1
  B1 is the B button values 0 1
  B2 is the X button values 0 1
  B3 is the Y button values 0 1

  B4 is the left shoulder
  B5 is the right shoulder

  B8 is the SELECT
  B9 is the START

  *
  */
