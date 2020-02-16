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
