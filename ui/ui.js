// 2019 11 15
// this is an attempt to write a ui that responds to -- is mapped to -- keystrokes
// and which launches one of two functions, scenes, or sketches.
// it may or may not need to manipulate the dom.

var btn1;
var btn2;
var img1;
var img2;
var url;

function preload(){
  img1 = loadImage("img/buttonC1.png");
  img2 = loadImage("img/buttonC2.png");
  btn1 = createSprite(224, 200, 64, 32);
  btn1.addImage("off1", img1);
  btn1.addImage("on1", img2);

  img1 = loadImage("img/buttonL1.png");
  img2 = loadImage("img/buttonL2.png");
  btn2 = createSprite(224, 300, 64, 32);
  btn2.addImage("off2", img1);
  btn2.addImage("on2", img2);

  url = "http://localhost:8080/index.html";

}

function setup(){
  createCanvas(448,448);
  background(200);
}

function draw(){
  background(200);
  if (keyIsDown(71)){
    btn1.changeImage("on1");
    print('key');
    httpGet(url);
  }
  else { btn1.changeImage("off1");}

  drawSprites();
}
