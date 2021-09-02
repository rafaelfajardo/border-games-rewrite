/* * * * * * * * * * * * * * * *
 *
 *  main.js should contain logic for selecting which game to play
 *  it will depend on P5.JS and P5.Play.JS
 *
 *  it will invoke:
 *  controller.js
 *  touch.js
 *
 *  it will launch:
 *  _crosser.html
 *  _lamigra.html
 *
 *  contributors to main.js are:
 *  Rafael Fajardo
 *  Chris GauthierDickey
 *  Scott Leutenegger
 *
 */

// declare global variables
let ground; // sprite container for background animation cycle
let btn1; // sprite container for button art
let btn2; // sprite container for button art
// let img1; // temporary container to preload an image
// let img2; // temporary container to preload an image
let url;  // container for a target url
let url0; // container for a target url
let url1; // container for a target url
let ctr0; // container for a counter

// preload
function preload(){
  //let img0  = loadImage('assets/ground00.png');
  let img1  = loadImage('assets/ground0001.png');
  let img2  = loadImage('assets/ground0002.png');
  let img3  = loadImage('assets/ground0003.png');
  let img4  = loadImage('assets/ground0004.png');
  let img5  = loadImage('assets/ground0005.png');
  let img6  = loadImage('assets/ground0006.png');
  let img7  = loadImage('assets/ground0007.png');
  let img8  = loadImage('assets/ground0008.png');
  let img9  = loadImage('assets/ground0009.png');
  let img10 = loadImage('assets/ground0010.png');
  let img11 = loadImage('assets/ground0011.png');
  let img12 = loadImage('assets/ground0012.png');
  //let img13 = loadImage('assets/ground13.png');
  //let img14 = loadImage('assets/ground14.png');
  //let img15 = loadImage('assets/ground15.png');
  //let img16 = loadImage('assets/ground16.png');
  //let img17 = loadImage('assets/ground17.png');
  ground = createSprite(224, 274, 448, 548);
  ground.depth = 0;
  ground.addAnimation('loop',img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12);//,img13,img14,img15,img16,img17);



  img1 = loadImage('assets/CrosserButton1.gif'); // load dimmed crosser button image
  img2 = loadImage('assets/CrosserButton4.gif'); // load bright crosser button image
  img3 = loadImage('assets/CrosserButton2.gif'); // load dimmed crosser button image eyes to one side
  img4 = loadImage('assets/CrosserButton3.gif'); // load dimmed crosser button image eyes to the other side
  btn1 = createSprite(224, 160, 180, 180);
  btn1.addImage('off1', img1);
  btn1.addImage('on1', img2);
  btn1.addAnimation('off', img1,img1,img1,img1,img1,img1,img1,img1,img1,
                           img3,img3,
                           img1,img1,img1,img1,img1,img1,img1,img1,img1,
                           img4,img4);
  btn1.addAnimation('select', img2);
  btn1.addAnimation('blink', img1,img2,img2,img1);
  btn1.changeAnimation('select');
  btn1.depth = 1;

  img1 = loadImage('assets/LaMigraButton1.gif'); // load dimmed la migra button image
  img2 = loadImage('assets/LaMigraButton3.gif'); // load bright la migra button image
  img3 = loadImage('assets/LaMigraButton2.gif');
  btn2 = createSprite(224, 390, 180, 180);
  btn2.addImage('off2', img1);
  btn2.addImage('on2', img2);
  btn2.addAnimation('off', img1,img1,img1,img1,img3,img3,img3,img3);
  btn2.addAnimation('select', img2);
  btn2.addAnimation('blink', img1,img2,img2,img1);
  btn2.changeAnimation('off');
  btn2.depth = 2;

/*  // these paths are for dev and for DAM
  url = 'http://localhost:8080/index.html'; // these urls have to reflect the files in /public
  url0 = 'http://localhost:8080/_crosser.html';
  url1 = 'http://localhost:8080/_lamigra.html';
*/
  // these paths are for web serving for Ars Electronica - Garden del Rio Grande
  url  = 'index.html'; // trying to make this with relative path
  url0 = '_crosser.html';
  url1 = '_lamigra.html';
}

// setup
function setup(){
  let canvas = createCanvas(448, 548); // suggested by p5js.org reference for parent()
  // next line relies on p5.dom.js be added to the dependencies in lib
  canvas.parent('canvas-column'); // place the sketch canvas within the div named canvas-column within index.html
  frameRate(20); // tried as slow as 1fps
  background(128);
  //
  //
  // cursor is useful for desktop and web served games
  // cursor is not useful for installation with gamepad
  // it may be crucial for installation with Leap Motion Controller
  // we seem to have to provide solutions for both
// noCursor(); // testing cursor manipulation
  cursor(HAND); // params = HAND, ARROW, CROSS, MOVE, TEXT, WAIT
  //
  ctr0 = 0; // initialize counter

}


const INPUT_DELAY = .1;
let nextInputAfter = 0;
// draw
function draw(){
  background(128); // overwrite last frame
  // if not playing then show selection UI
    // if selecting to play Crosser then show Crosser and hide others
    // if selecting to play La Migra then show La Migra and hide others

    // add a delay to how frequently we poll input
    const currentTime = millis() / 1000;
    if (currentTime >= nextInputAfter) {
      //console.log('scanning input');
      // experimental code for gamepad
      scanGamePads();
      //let pads = navigator.getGamepads(); // this samples the gamepad once per frame and is core HTML5/JavaScript
      let pad0 = controllers[0]; // limit to first pad connected
      if (pad0) { // this is an unfamiliar construction I think it test that pad0 is not null
        console.log('pad0 is active');
        updateStatus(pad0); // will need an updateStatus() function
      } else { // what to do if pad0 is null, which is to say there is no gamepad connected
        // use keyboard
        // or use touches
        console.log("did not find gamepad (probably need to click it so it wakes up)")
      }

      // now reset the time when we check for input again
      nextInputAfter = currentTime + INPUT_DELAY;
    }

    /* * * *
     * This test is necessary for DAM installation for ReVisión in 2021
     */
//    let browser = navigator.vendor; // window.navigator.vendor may be correct syntax
//    if (browser !== 'Google Inc.'){
//      console.log('warning, wrong browser')
//    }


    drawSprites();
} // end draw

/*
//  Deprecate mouse clickable UI
//  implementing button clickable UI in index.html + main.js
//  it's not working yet
function mouseClicked(){
  if (mouseX > 224-90 && mouseX < 224+90 && mouseY > 160-90 && mouseY < 160-90) {
    btn1.changeAnimation('blink');
    window.open(url0,"_self");
  } else {
    btn1.changeAnimation('off');
  }
  if (mouseX > 224-90 && mouseX < 224+90 && mouseY > 370-90 && mouseY < 370-90){
    btn2.changeAnimation('blink');
    window.open(url1,"_self");
  } else {
    btn2.changeAnimation('off');
  }
  return false;
}
*/


const nintendoId = /Vendor\: 0810 Product\: e501/;
const suilyId = /Vender\: 0079 Product\: 0011/;
const buffaloID = /Vendor\: 0583 Product\: 2060/;
const exleneID = /Vendor\: 0079 Product\: 0011/;
const innextID = /Vendor\: 0079 Product\: 0011/;
  
function updateStatus(pad) {  // tested once per frame

    // list out the buttons
    console.log('pad name is: ' + pad.id);
    listButtons(pad);
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
  

	// if (pad.id.match(nintendoId)) { // this matches against the nintendo controller
    //   	if (pad.axes[0] === -1.00000){}// print('NES d-pad left pressed'); } // NES d-pad left
    //   	if (pad.axes[0] ===  1.00000){}//print('NES d-pad right pressed'); } // NES d-pad right
    //   	if (pad.axes[1] === -1.00000){}//print('NES d-pad up pressed'); } // NES d-pad up
    //   	if (pad.axes[1] ===  1.00000){}//print('NES d-pad down pressed'); } // NES d-pad down
    //   	if (pad.buttons[0].value === 1.00){}//print('NES B button pressed'); } // NES B button
    //   	if (pad.buttons[1].value === 1.00){}// print('NES A button pressed'); } // NES A button
    //     // does not have buttons 2-7 inclusive

    if (isButtonReleased(pad.index, BUTTON_SELECT)) {
        if (ctr0 % 2 === 0){
            btn1.changeAnimation('off');
            btn2.changeAnimation('select');
        } else if (ctr0 % 2 === 1) {
            btn1.changeAnimation('select');
            btn2.changeAnimation('off');
        }
        ctr0 = ctr0 +1;
        print('NES Select pressed'); 
    } // NES Select button
    if (isButtonReleased(pad.index, BUTTON_START)) {
        if (ctr0 % 2 === 0){
            btn1.changeAnimation('off');
            btn2.changeAnimation('blink');
            window.open(url0, "_self"); // loadJSON(url0, draw); // httpGet(url0);
        }
        else if (ctr0 % 2 === 1){
            btn1.changeAnimation('blink');
            btn2.changeAnimation('off');
            window.open(url1, "_self"); // loadJSON(url1, draw); // httpGet(url1)
        }
        print('NES Start pressed'); 
    } // NES Start button

  /*
   *  This bit is specific to the Buffalo SNES style controller,
   *  USB,2-axis 8-button gamepad (STANDARD GAMEPAD Vendor: 0583 Product: 2060)
   *  need a test to enclose it. Axis defaults are 0.00392 (positive values)
   */
  /*
   if (pad.id.match(standardID)) { // this matches the id against the controller ID value
       if (pad.axes[0] === -1.00000){print('Buffalo SNES d-pad left pressed');} // SNES d-pad leftward
       if (pad.axes[0] ===  1.00000){print('Buffalo SNES d-pad right pressed');} // SNES d-pad leftward
       if (pad.axes[1] === -1.00000){print('Buffalo SNES d-pad up pressed');} // SNES d-pad leftward
       if (pad.axes[1] ===  1.00000){print('Buffalo SNES d-pad down pressed');} // SNES d-pad leftward
       if (pad.buttons[0].value === 1){ print('Buffalo SNES B-button pressed');}
       if (pad.buttons[1].value === 1){ print('Buffalo SNES A-button pressed');}
       if (pad.buttons[2].value === 1){ print('Buffalo SNES Y-button pressed');}
       if (pad.buttons[3].value === 1){ print('Buffalo SNES X-button pressed');}
       if (pad.buttons[4].value === 1){ print('Buffalo SNES L-button pressed');}
       if (pad.buttons[5].value === 1){ print('Buffalo SNES R-button pressed');}
       if (pad.buttons[6].value === 1){ print('Buffalo SNES L-button pressed');} // redundant mapping
       if (pad.buttons[7].value === 1){ print('Buffalo SNES R-button pressed');} // redundant mapping
       if (pad.buttons[8].value === 1)
       {
          if (ctr0 % 2 === 0)
          {
            btn1.changeAnimation('off');
            btn2.changeAnimation('select');
          } else if (ctr0 % 2 === 1) {
           btn1.changeAnimation('select');
           btn2.changeAnimation('off');
          }
          ctr0 = ctr0 +1;
          print('Buffalo SNES SELECT button pressed');
      }
      if (pad.buttons[9].value === 1){
        if (ctr0 % 2 === 0){
          btn1.changeAnimation('off');
          btn2.changeAnimation('blink');
          window.open(url0, "_self"); // loadJSON(url0, draw); // httpGet(url0);
        } else if (ctr0 % 2 === 1) {
          btn1.changeAnimation('blink');
          btn2.changeAnimation('off');
          window.open(url1, "_self"); // loadJSON(url1, draw); // httpGet(url1)
        }
        print('Buffalo SNES START button pressed');
      }
       if (pad.buttons[10].value === 1){ print('Buffalo unmapped button 10');} // I haven't found a signal on this button[index]
       if (pad.buttons[11].value === 1){ print('Buffalo unmapped button 11');} // I haven't found a signal on this button[index]
       if (pad.buttons[12].value === 1){ print('Buffalo SNES D-pad up pressed');} // redundant with axes 1 (Y-value)
       if (pad.buttons[13].value === 1){ print('Buffalo SNES D-pad down pressed');} // redundant with axes 1 (Y-value)
       if (pad.buttons[14].value === 1){ print('Buffalo SNES D-pad left pressed');} // redundant with axes 0 (X-value)
       if (pad.buttons[15].value === 1){ print('Buffalo SNES D-pad right pressed');} // redundant with axes 0 (X-value)
    }
    */

    /*
     *  This bit is specific to the Exlene SNES style controller,
     *  USB Gamepad (Vendor: 0079 Product: 0011)
     *  The Exlene controller worked on older MacOS X and Mac Mini, with middleware.
     *  Is not working here.
     *  axes 0: -0.9921568632125854 by default in this controller
     *  instead of  a value closer to 0
     *  it may be that we have to evaluate for a value < -1 for 'left'
     *  and some value > -0.99 for 'right'
     *  well that didn't work. going to leave Exlene commented out
     */
  /*
     if (pad.id.match(exleneID) ){
       if (pad.axes[0] < -1.0000){print('Exlene SNES D-pad left pressed');} // this axis is not registering at present
       if (pad.axes[0] > -0.992){print('Exlene SNES D-pad right pressed');} // this axis is not registering at present
       if (pad.axes[1] === -1.0000){print('Exlene SNES D-pad up pressed');}
       if (pad.axes[1] ===  1.0000){print('Exlene SNES D-pad down pressed');}
       if (pad.buttons[0].value === 1){print('Exlene SNES A-button pressed');} // SNES A button
       if (pad.buttons[1].value === 1){print('Exlene SNES B-button pressed');} // SNES B button
       if (pad.buttons[2].value === 1){print('Exlene SNES X-button pressed');} // SNES X button
       if (pad.buttons[3].value === 1){print('Exlene SNES Y-button pressed');} // SNES Y button
       if (pad.buttons[4].value === 1){print('Exlene SNES L-button pressed');} // SNES left shoulder button
       if (pad.buttons[5].value === 1){print('Exlene SNES R-button pressed');} // SNES right shoulder button
       if (pad.buttons[6].value === 1){print('Exlene unmapped button 6 pressed');} // not mapped
       if (pad.buttons[7].value === 1){print('Exlene unmapped button 7 pressed');} // not mapped
       if (pad.buttons[8].value === 1){
         if (ctr0 % 2 === 0){
           btn1.changeAnimation('off');
           btn2.changeAnimation('select');
         } else if (ctr0 % 2 === 1) {
           btn1.changeAnimation('select');
           btn2.changeAnimation('off');
         }
         ctr0 = ctr0 +1;
         print('Exlene SNES Select button pressed');
        } // SNES select button
       if (pad.buttons[9].value === 1){
         if (ctr0 % 2 === 0){
           btn1.changeAnimation('off');
           btn2.changeAnimation('blink');
           window.open(url0, "_self"); // loadJSON(url0, draw); // httpGet(url0);
         }
         else if (ctr0 % 2 === 1){
           btn1.changeAnimation('blink');
           btn2.changeAnimation('off');
           window.open(url1, "_self"); // loadJSON(url1, draw); // httpGet(url1)
         }
         print('Exlene SNES Start button pressed');
        } // SNES start button
     }
  */

   /*
    * This bit is specific to the Sony PS3 contoller,
    * PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)
    * it also uses 8 for select and 9 for start code 054c_0268
    */
  /*
  if (pad.id ==='PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)'){
      // add code for playstation buttons
  }
  */
  return;
}

// keyTyped was copied from crosser.js
// keyboard mapping W,A,S,D; I,J,K,L; T,Y; as actionable
// will likely have to pass the values of moveUp, moveDown, moveLeft, moveRight for this to work.
function keyTyped(){ // tested once per frame, triggered on keystroke
	if        (key === 'w'          ||
		         key === 'W'          ||
		         key === 'i'          ||
		         key === 'I') {
		print('key up');
	} else if (key === 's'          ||
		         key === 'S'          ||
		         key === 'k'          ||
		         key === 'K') {
    print('key down');
	} else if (key === 'a'          ||
		         key === 'A'          ||
		         key === 'j'          ||
		         key === 'J') {
		print('key left');
	} else if (key === 'd'          ||
		         key === 'D'          ||
		         key === 'l'          ||
		         key === 'L') {
		print('key right');
	}
  /*
  // another option for mapping start and select functions
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
	return false;

} // end keyTyped

function keyReleased() {
  if ((key === 'g') || (key === 'G')){ // g on most keyboards using here as a select or highlight
    // need to add here a test for if gamestate === playing (either) then load index.html
    if (ctr0 % 2 === 0){
      btn1.changeAnimation('off');
      btn2.changeAnimation('select');
    } else if (ctr0 % 2 === 1) {
      btn1.changeAnimation('select');
      btn2.changeAnimation('off');
    }
    ctr0 = ctr0 +1;
  }
  if ((key === 'h') || (key === 'H')){ // h on most keyboards using here as start the selected choice
    if (ctr0 % 2 === 0){
      btn1.changeAnimation('off');
      btn2.changeAnimation('blink');
      window.open(url0, "_self"); // loadJSON(url0, draw); // httpGet(url0);
    }
    else if (ctr0 % 2 === 1){
      btn1.changeAnimation('blink');
      btn2.changeAnimation('off');
      window.open(url1, "_self"); // loadJSON(url1, draw); // httpGet(url1)
    }
  }
} // end keyReleased(). pad0 buttons[8] and buttons[9] will also use above


// Code to deal with game pads
let lastControllers = []
let controllers = []

function listButtons(pad) {
  console.log('pad.axes.length is ' + pad.axes.length)
  for (var i = 0; i < pad.axes.length; i++) {
      console.log('axis[' + i + '] is ' + pad.axes[i]);
  }
  //console.log('pad buttons are: ' + pad.buttons)
  // max of 16 buttons
  for (var i = 0; i <= 16; i++) {
    if (pad.buttons[i]) {
      if (pad.buttons[i].value > 0 || pad.buttons[i].pressed == true)
        console.log('button[' + i + '] is pressed');
      else 
        console.log('button[' + i + '] is NOT pressed');  
    }
  }
}

const BUTTON_B = 0;
const BUTTON_A = 1;
const BUTTON_Y = 2;
const BUTTON_X = 3;

const BUTTON_SELECT = 8;
const BUTTON_START = 9;
const BUTTON_DPAD_LEFT = 14;
const BUTTON_DPAD_RIGHT = 15;
const BUTTON_DPAD_UP = 12;
const BUTTON_DPAD_DOWN = 13;

/**
 * Checks to see if a controller's button is currently pressed
 * @param {Controller ID we're looking at} ctrlId 
 * @param {ID for a given button} buttonId 
 * @returns true if the button is currently pressed, false otherwise
 */
 function isButtonPressed(ctrlId, buttonId) {
    if (controllers[ctrlId].buttons[buttonId]) {
        let val = controllers[ctrlId].buttons[buttonId].value;
        let pressed = controllers[ctrlId].buttons[buttonId].pressed;
        return (val > 0 || pressed == true);
    }
    
    return false;
}

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
