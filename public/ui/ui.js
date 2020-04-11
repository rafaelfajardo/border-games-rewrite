// 2019 11 15
// this is an attempt to write a ui that responds to -- is mapped to -- keystrokes
// and which launches one of two functions, scenes, or sketches.
// it may or may not need to manipulate the dom.

/* current version uses keyIsDown(), should also try keyReleased()
*/

let btn1; // sprite container for button art
let btn2; // sprite container for button art
let img1; // temporary container to preload an image
let img2; // temporary container to preload an image
let url;  // container for a target url
let url0; // container for a target url
let url1; // container for a target url
let ctr0; // container for a counter

function preload(){
  img1 = loadImage("img-ui/buttonC1.png"); // load dimmed button image
  img2 = loadImage("img-ui/buttonC2.png"); // load bright button image
  btn1 = createSprite(224, 200, 64, 32);
  btn1.addImage("off1", img1);
  btn1.addImage("on1", img2);
  btn1.addAnimation('off', img1);
  btn1.addAnimation('select', img2);
  btn1.addAnimation('blink', img1,img2,img2,img1);

  img1 = loadImage("img-ui/buttonL1.png"); // load dimmed button image
  img2 = loadImage("img-ui/buttonL2.png"); // load bright button image
  btn2 = createSprite(224, 300, 64, 32);
  btn2.addImage("off2", img1);
  btn2.addImage("on2", img2);
  btn2.addAnimation('off', img1);
  btn2.addAnimation('select', img2);
  btn2.addAnimation('blink', img1,img2,img2,img1);

  url = "http://localhost:8080/index.html";
  url0 = "http://localhost:8080/0.html";
  url1 = "http://localhost:8080/1.html";

}

function setup(){
  createCanvas(448,448);
  background(200);
  ctr0 = 0; // initialize counter
}

function keyReleased() {
  if ((key === 'g') || (key === 'G')){ // g on most keyboards using here as a select or highlight
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
      httpGet(url0);
    }
    else if (ctr0 % 2 === 1){
      btn1.changeAnimation('blink');
      btn2.changeAnimation('off');
      httpGet(url1)
    }
  }
} // end keyReleased(). pad0 buttons[8] and buttons[9] will also use above

function draw(){
  background(200);

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


  drawSprites();

}
