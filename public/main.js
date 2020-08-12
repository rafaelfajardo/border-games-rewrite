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
let btn1; // sprite container for button art
let btn2; // sprite container for button art
let img1; // temporary container to preload an image
let img2; // temporary container to preload an image
let url;  // container for a target url
let url0; // container for a target url
let url1; // container for a target url
let ctr0; // container for a counter

// preload
function preload(){
  img1 = loadImage('assets/CrosserButton1.gif'); // load dimmed crosser button image
  img2 = loadImage('assets/CrosserButton4.gif'); // load bright crosser button image
  btn1 = createSprite(224, 160, 180, 180);
  btn1.addImage('off1', img1);
  btn1.addImage('on1', img2);
  btn1.addAnimation('off', img1);
  btn1.addAnimation('select', img2);
  btn1.addAnimation('blink', img1,img2,img2,img1);
  btn1.changeAnimation('select');

  img1 = loadImage('assets/LaMigraButton1.gif'); // load dimmed la migra button image
  img2 = loadImage('assets/LaMigraButton3.gif'); // load bright la migra button image
  btn2 = createSprite(224, 370, 64, 32);
  btn2.addImage('off2', img1);
  btn2.addImage('on2', img2);
  btn2.addAnimation('off', img1);
  btn2.addAnimation('select', img2);
  btn2.addAnimation('blink', img1,img2,img2,img1);
  btn2.changeAnimation('off');

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

// draw
function draw(){
  background(128); // overwrite last frame
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
      //console.log('warning, no gamepads connected');
  	}
    let browser = navigator.vendor; // window.navigator.vendor may be correct syntax
    if (browser !== 'Google Inc.'){
      console.log('warning, wrong browser')
    }
    drawSprites();
} // end draw

// udpdateStatus(pad) has been moved to controller.js
// keyTyped was copied from crosser.js
// keyboard mapping W,A,S,D; I,J,K,L; T,Y; as actionable
// will likely have to pass the values of moveUp, moveDown, moveLeft, moveRight for this to work.
function keyTyped(){ // tested once per frame, triggered on keystroke
	if        (keyCode === '38'     || //keyDown(UP_ARROW) || // arrow keys are not responding, also poorly documented
		         key === 'w'          ||
		         key === 'W'          ||
		         key === 'i'          ||
		         key === 'I') {
		print('key up');
		moveUp = true;
	} else if (keyCode === '40'     || //keyCode === 'ArrowDown'  ||
		         key === 's'          ||
		         key === 'S'          ||
		         key === 'k'          ||
		         key === 'K') {
    print('key down');
		moveDown = true;
	} else if (keyCode === '37'     || //key === 'ArrowLeft'  ||
	           key === 'a'          ||
		         key === 'A'          ||
		         key === 'j'          ||
		         key === 'J') {
		print('key left');
		moveLeft = true;
	} else if (keyCode === '39'     || //key === 'ArrowRight'  ||
		         key === 'd'          ||
		         key === 'D'          ||
		         key === 'l'          ||
		         key === 'L') {
		print('key right');
		moveRight = true;
	} else if (key === 't'          ||  // this bit is a little crufty
						 key === 'T') {
	  print('t');
		START = true;
	} else if (key === 'y') {  // this bit is a little crufty too
		print('y');
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
// function play( game ){}
