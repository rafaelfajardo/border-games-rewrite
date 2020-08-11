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
// keyTyped() has been moved to controller.js
// function play( game ){}
