/*
 *
 *		This is a rewriting/remastering/remediation of La Migra (circa 2001 a.c.e.)
 *		there is an accompanying file called "about.js" that contains a dev log
 *
 */

// global variables
var tierra; // sprite container for the background images
var pipa0; // sprite container for a drain pipe
var pipa1; // sprite container for a drain pipe
var pipa2; // sprite container for a drain pipe
var pipa3; // sprite container for a drain pipe
var pipas; // will be a group of drain pipe sprites

var migra; // sprite container for player character La Migra SUV
var esposas; // sprite container for handcuffs that animate like Argentine bolas
var bala; // sprite container for lethal projectile. existed in original but has been kept quiet.
var avisocontador; // sprite container for counter UI of folks who have crossed and should be located lower left
var avisocounter; // sprite container for counter UI of folks sent back and should be located lower right

var maluciadepieles; // sprite container for non-player character
var nitamoreno; // sprite container for non-player character
var linodepieles; // sprite container for non-player character
var carlosmoreno; // sprite container for non-player character who moves in cardinal directions
var marcia; // sprite container for non-player character
var patricialamachona; // sprite container for non-player character
var puercoespin; // sprite container for non-player character
var xrodar; // sprite container for non-player character
var cacahuates; // will be a group of sprites non-player characters

var deportacioncenter; // sprite container for environment set piece
var repatriationcenter; // sprite container for environment set piece
var sombra0; // sprite container for environment set piece
var sombra1; // sprite container for environment set piece
var sombra2; // sprite container for environment set piece

var gamestate = "startup"; // variable container should hold string lables "startup", "play", "win", "lose"
var BUGGY = true; // boolean, debug flag, used for debug feature of P5.Play.JS


function preload(){
  /*
   *  load images for tierra and set default background
   */
  let img0 = loadImage ('img-lamigra/la-migra_masthead.png'); // img0 - img9 will be placeholders that only exist within preload function
  if (BUGGY){
    let img1 = loadImage ('img-lamigra/frontera02_grid.png');  // this is the game play field and is 512 x 544 pixels with a grid
  } else {
    let img1 = loadImage ('img-lamigra/frontera02.png');  // this is the game play field and is 512 x 544 pixels without a grid
  }
  let img2 = loadImage ('img-lamigra/la-migra_cold_one_017.png');
  let img3 = loadImage ('img-lamigra/la-migra_cold_one_018.png');
  tierra = createSprite (256,272); // 256,256 presumes a 512 x 512 background. this is not true, actually 512 x 544. fixed to 256 x 272
  tierra.addImage ('masthead',img0); // title screen
  tierra.addImage ('mapa', img1); // gameplay screen
  tierra.addImage ('pierdes', img2); // loss screen
  tierra.addImage ('ganas',img3); // victory screen
  tierra.changeImage('mapa'); // set the background to mapa while we develop, will need to change later

  /*
   *  load images for drain pipe along bottom of screen
   */
  img0 = loadImage ('img-lamigra/pipeA.png'); // is the resting state for a pipe sprite
  img1 = loadImage ('img-lamigra/pipeB.png'); // is the illuminated, activated state for a pipe sprite
  pipa0 = createSprite (2*32+16, 16*32+16, 32, 32);
  pipa0.addImage ('pipa', img0);
  pipa0.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa0.changeAnimation('pipa activated'); // will need to change this state later

  pipa1 = createSprite (32*5+16, 16*32+16, 32, 32);
  pipa1.addImage ('pipa', img0);
  pipa1.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa1.changeAnimation('pipa activated'); // will need to change this state later

  pipa2 = createSprite (32*8+16, 16*32+16, 32, 32);
  pipa2.addImage ('pipa', img0);
  pipa2.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa2.changeAnimation('pipa activated'); // will need to change this state later

  pipa3 = createSprite (32*11+16, 16*32+16, 32, 32);
  pipa3.addImage ('pipa', img0);
  pipa3.addAnimation('pipa activated', img0, img1,img1,img1,img1, img0);
  pipa3.changeAnimation('pipa activated'); // will need to change this state later

  pipas = new Group(); // the group of drain pipes, should allow for testing collision with group
  pipas.add (pipa0);
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

  /*
   * load images for esposas sprite
   */
  img0 = loadImage('img-lamigra/esposas_0.png');
  img1 = loadImage('img-lamigra/esposas_1.png');
  img2 = loadImage('img-lamigra/esposas_2.png');
  img3 = loadImage('img-lamigra/esposas_3.png');
  esposas = createSprite (9*32+16, 12*32+16, 32, 32,); // the esposas launch from the front of the vehicle, and so will need to refer to migra.x-position.
  esposas.addAnimation('lanzar',img0,img0,img1,img1,img2,img2,img3,img3); // this will change later, here for testing purposes

  /*
   *  to do: load images for bala(s) (or not)
   */

   /*
    * load imgages for avisocontador sprite, should be yellow sign
    */
   img0 = loadImage('img-lamigra/counter 2 0.png');
   img1 = loadImage('img-lamigra/counter 2 1.png');
   img2 = loadImage('img-lamigra/counter 2 2.png');
   img3 = loadImage('img-lamigra/counter 2 3.png');
   let img4 = loadImage('img-lamigra/counter 2 4.png');
   let img5 = loadImage('img-lamigra/counter 2 5.png');
   let img6 = loadImage('img-lamigra/counter 2 6.png');
   let img7 = loadImage('img-lamigra/counter 2 7.png');
   let img8 = loadImage('img-lamigra/counter 2 8.png');
   let img9 = loadImage('img-lamigra/counter 2 9.png');
   avisocontador = createSprite (16, 32*14+16, 32, 32);
   avisocontador.addAnimation('test',img0,img1,img2,img3,img4,img5,img6,img7,img8,img9);

  /*
   * load images for avisocounter sprite, should be pale blue sign
   */
  img0 = loadImage('img-lamigra/counter 3 0.png');
  img1 = loadImage('img-lamigra/counter 3 1.png');
  img2 = loadImage('img-lamigra/counter 3 2.png');
  img3 = loadImage('img-lamigra/counter 3 3.png');
  img4 = loadImage('img-lamigra/counter 3 4.png');
  img5 = loadImage('img-lamigra/counter 3 5.png');
  img6 = loadImage('img-lamigra/counter 3 6.png');
  img7 = loadImage('img-lamigra/counter 3 7.png');
  img8 = loadImage('img-lamigra/counter 3 8.png');
  img9 = loadImage('img-lamigra/counter 3 9.png');
  avisocounter = createSprite (14*32+16, 16+32+16, 32, 32);
  avisocounter.addAnimation('test',img0,img1,img2,img3,img4,img5,img6,img7,img8,img9);

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
  deportacioncenter = createSprite (15+32+16, 15*32+16, 32, 96);
  img0 = loadImage('img-lamigra/gates3A.png');
  img1 = loadImage('img-lamigra/gates3B.png');
  deportacioncenter.addImage('gate', img0);
  deportacioncenter.addAnimation('gate activated', img0, img1,img1,img1,img1, img0);
  deportacioncenter.changeAnimation('gate activated'); // will change, activated for testing purposes during development

  /*
   *  load image for repatriation center
   */
   repatriationcenter = createSprite (15*32+16, 32+16, 32, 96);
   img0 = loadImage('img-lamigra/porton3A.png');
   img1 = loadImage('img-lamigra/porton3B.png');
   repatriationcenter.addImage('gate', img0);
   repatriationcenter.addAnimation('gate activated', img0, img1,img1,img1,img1, img0);
   repatriationcenter.changeAnimation('gate activated'); // will change,

   /*
    * load image for shadows along right hand side of screen
    */
    img0 = loadImage('img-lamigra/shadowC.png'); // used twice, mid right, lower right
    img1 = loadImage('img-lamigra/shadowB.png'); // used once, upper right
    sombra0 = createSprite (15*32+16, 4*32+16, 32, 96); // will contain shadowB.png
    sombra1 = createSprite (15*32+16, 8*32, 32, 128); // will contain shadowC.png
    sombra2 = createSprite (15*32+16, 12*32, 32, 128); // will contain shadowC.png
    sombra0.addImage('sombra', img1);
    sombra1.addImage('sombra', img0);
    sombra2.addImage('sombra', img0);



}

function setup() {
  // put setup code here
  createCanvas(512,544);
  background(128);
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

  drawSprites();
}

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
