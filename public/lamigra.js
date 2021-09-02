'use strict';
/* * * * * * * * * * * * * * * *
 *
 *		This is a rewriting/remediation of Crosser (2000 a.c.e.)
 *		there is an accompanying file called "about.txt" that contains a partial dev log
 *    another partial dev log is found on gitHub
 *    it has come to our attention that gitHub provides technology solutions to DHS and ICE
 *    We DO NOT support ICE and feel trapped in our complicity because of the importance
 *    of gitHub to the open source ecosystem.
 *
 *    This file depends upon P5.js, Play.P5.js, and JavaScript
 *
 *    This file is called by main.js
 *
 *    This file calls or may call:
 *      contoller.js
 *      touch.js
 *
 *    contributors to this version have been:
 *      Rafael Fajardo
 *      Chris GauthierDickey
 *      Scott Leutenegger
 *    on top of work that was originally crafted by
 *      Rafael Fajardo
 *      Francisco Ortega
 *      Miguel Tarango
 *      Ryan Mulloy
 *      Marco Ortega
 *      Carmen Escobar
 *      Tomás Márquez
 *
 */

//
//
// global variables
//

// defines one unit of movement, which is 32 pixels
const ONE_UNIT = 32;
// width and height of screen in pixels
const WIDTH = 512;
const HEIGHT = 544;
//
//
let btn1; // sprite container for button art
let btn2; // sprite container for button art
/*
//
// url targets using absolute paths
// likely necessary for installation contexts with local a server
// for invoking _crosser.html or _lamigra.html
// used by key strokes for 'select' and 'start'
let url  = "http://localhost:8080/index.html";
let url0 = "http://localhost:8080/_crosser.html";
let url1 = "http://localhost:8080/_lamigra.html";
*/
// url targets using relative paths
let url = 'index.html';
let url0 = '_crosser.html';
let url1 = '_lamigra.html';
//
// declare a variable to contain our font
let arcadeFont;
//
//
//  define state variables
//
let gameState = "startup"; // variable container should hold string labels "select, startup", "play", "win", "lose"
let moveState = 'idle'; // container for player character move states can contain 'idle', 'left', 'right'
let flingEsposas = false; // a boolean for launching handcuffs maybe this needs to be a function?
let cuffs; // group container for new esposas which will be newSprites
//
//
//  define background sprites and set pieces
//
let tierra; // sprite container for the background images
let pipa0; // sprite container for a drain pipe
let pipa1; // sprite container for a drain pipe
let pipa2; // sprite container for a drain pipe
let pipa3; // sprite container for a drain pipe
let pipas; // will be a group of drain pipe sprites
//
//
//  define player character sprites - migra, esposas, bala
//
let migra; // sprite container for player character La Migra SUV
let esposas; // sprite container for handcuffs that animate like Argentine bolas
let bala; // sprite container for lethal projectile. existed in original but has been kept quiet.
//
//
//  define score-counter sprites
//
let avisocontador; // sprite container for counter UI of folks who have crossed and should be located lower left
let avisocounter; // sprite container for counter UI of folks sent back and should be located lower right
//
//
//  define non-player character sprites
//
let maluciadepieles; // sprite container for non-player character
let nitamoreno; // sprite container for non-player character
let linodepieles; // sprite container for non-player character
let carlosmoreno; // sprite container for non-player character who moves in cardinal directions
let marcia; // sprite container for non-player character
let patricialamachona; // sprite container for non-player character
let puercoespin; // sprite container for non-player character
let xrodar; // sprite container for non-player character
//
//  define a collection or Play.P5.js Group identity for non-player character sprites
let cacahuates; // will be a group of sprites non-player characters
//
//
//  define other set pieces that will be in the foreground
//
let deportacioncenter; // sprite container for environment set piece
let repatriationcenter; // sprite container for environment set piece
let sombra0; // sprite container for environment set piece
let sombra1; // sprite container for environment set piece
let sombra2; // sprite container for environment set piece

// define a group for solids so they don't collide
let solids;
let caughtSolids;

const WINNING_CATCH_COUNT = 6;
const LOSING_ESCAPE_COUNT = 4;

let escapeCount = 0;
let catchCount = 0;

//
//
//  define a boolean to set play.p5.js library debug function state
//
const BUGGY = false; // boolean, debug flag, used for debug feature of P5.Play.JS
// turning on BUGGY will turn on DRAW_COLLIDER, otherwise, it's the final value listed below
const DRAW_COLLIDER = BUGGY ? BUGGY : false;

// if set to true, the people only move downwards, left and right, never up
const NO_UP = false;
const NO_LEFT = false;
const NO_IDLE = false;
const NO_RIGHT = false;

// this is a timeout for no input which will then go back to the main screen
let lastInputAt = 0;
// this is the timeout before going back to the selection screent
const BACK_TO_SELECTION_TIMEOUT = 120;

// create an input queue so we can store the last two inputs we received
let inputQueue = [];
let maxQueueSize = 2;

// queue to render things, they'll be drawn in this order so it's important
// to have the order we want. This order will be handled in preload. To deal
// with an object moving more than ONE_UNIT, we simply add the object multiple
// times to the queue
let renderQueue = [];

// this defines the time to spend on changing the animation and rendering for
// each character, the fast this is, the faster the game will move
const FPS_PER_ITEM = 11;
const RENDER_TIME = 1 / FPS_PER_ITEM;

// defines the frame rate--generally we want it some multiple of RENDER_TIME so that
// and then that number of frames will be drawn
const FRAME_RATE = 20;

// indicates where we are in the render queue
let currentIndex = 0;

// timestamp for our indexing into the render queue
let timeStamp = 0;

// considering how to queue on a different time boundary, the next to variables aren't being used yet
let QUEUE_DELAY = .25;
let nextQueueTimeAt = 0;

/*****************************************************************
 * Adds an input into our queue, which we can remove with dequeueInput
 * @param {The input queue (which should be an array) that we're using} inputQueue
 * @param {The next input to add} item
 */
function addInput(inputQueue, item) {
    // grab the current time
    const currentTime = millis() / 1000;

    if (inputQueue.length < maxQueueSize) {
        inputQueue.push(item);
    } else {
        inputQueue.shift();
        inputQueue.push(item);
    }

    // now timestamp when we received this input last
    lastInputAt = currentTime;
}

/*****************************************************************
 * This function removes the next item (i.e., the oldest) in the queue
 * @param {The input queue we're using (which should be an array)} inputQueue
 * @returns {The item we just removed from the queue}
 */
function dequeueInput(inputQueue) {
    return inputQueue.shift();
}


// we put a unique number on each sprite element, though obviously this will overflow if the
// game runs a veeeeery long time while being played--typically longer than is possible for a human to play.
// we increment this value each time we call createSprite
let spriteId = 0;
/*****************************************************************
 * Remove an item from the rendering queue so that we no longer process it
 * @param {The item in the queue to be removed, based on its spriteId} item 
 */
function removeFromRenderQueue(item) {
    // find the index in the queue where this sprite is
    let index = renderQueue.findIndex((sprite) => sprite.spriteId === item.spriteId)
    // remove the element from the queue
    renderQueue.splice(index, 1)
    item.removedFromQueue = true
}

/**
 * Calculates the new index from the current one, based on
 * what our current index is and how many elements are in the queue
 * @param {The queue of sprites we'll be drawing} queue
 * @param {The current index we are testing} idx
 */
function getNextIndex(queue, idx) {
    // get the time in seconds, with subsecond accuracy
    const len = queue.length;

    // make sure the length is greater than 0, and we should always have that
    if (len > 0) {
        return (idx + 1) % len;
    } else {
        console.error('queue length is 0, you probably forgot to add things to it');
        return idx;
    }
}



/*****************************************************************
 * this function is called by checkForPeanutSprite(sprite)
 * this takes/receives a sprite in the renderQueue[] that is
 * also a member of cacahuates [] (a play.p5.js group entity)
 * and sets its movementDir attribute according to a random scheme
 * @param {The sprite to set movementDir for} sprite
 */
function setPeanutMovementDir(peanut) {
    // check if they're dead
    if (peanut.isDead) {
        peanut.movementDir = 'none';
        return;
    }

    // check if they're deported
    if (peanut.isDeported) {
        // if they're deported, then stand still idle
        peanut.movemenDir = 'idle';
        return;
    }

    // if they're caught, we have specific behavior, which is first to
    // move right, then to move down to the deportation center, otherwise
    // they're free to move as they chose!
    if (peanut.isCaught) {
        // see if we've moved right enough, if we're less than WIDTH - 16, we can keep moving
        // right (possibly) as long as we're not blocked, and if we're blocked, we'd like to chose
        // down, instead of just being stuck here
        let canMoveRight = false;
        if (peanut.position.x < WIDTH - 16) {

            // now let's test to see if they can move right
            peanut.position.x += 32;
            // if we wouldn't overlap one of the caughtSolids, then we can move right
            if (!caughtSolids.overlap(peanut)) {
                canMoveRight = true;

                // set them up for movement to the right
                peanut.movementDir = 'right';
                peanut.speed = ONE_UNIT;
                peanut.changeAnimation('caught right')
                peanut.animation.looping = false
                peanut.animation.goToFrame(0);
            }

            // and reset their position
            peanut.position.x -= 32;
        }

        if (!canMoveRight && peanut.position.y > 32) {
            peanut.movementDir = 'down';
            peanut.speed = ONE_UNIT;
            peanut.changeAnimation('caught down')
            peanut.animation.looping = false;
            peanut.animation.goToFrame(0);
        }

        // return so we don't then overwrite our movement direction
        return;
    }

    // take the random movement code that was added to updateSprite earlier and paste it here
    // choose a number between 0 and 5 as an index that will yield a direction
    let movementIndex = floor(random(6));

    // now ideally, we'd like to not move if they're going to collide with
    // something that they shouldn't collide with, like another cacahuate or la migra

    // map the index to a movementDir
    switch (movementIndex) {
        case 0:
            if (!NO_IDLE) {
                peanut.movementDir = 'idle';
                peanut.speed = 0;
                peanut.changeAnimation('idle')
                peanut.animation.looping = false;
                peanut.animation.goToFrame(0);
            }
            break;
        case 1:
            if (!NO_LEFT) {
                peanut.movementDir = 'left';
                peanut.speed = ONE_UNIT;
                peanut.changeAnimation('left')
                peanut.animation.looping = false;
                peanut.animation.goToFrame(0);
            }
            break;
        case 2:
            if (!NO_RIGHT) {
                peanut.movementDir = 'right';
                peanut.speed = ONE_UNIT;
                peanut.changeAnimation('right')
                peanut.animation.looping = false;
                peanut.animation.goToFrame(0);
            }
            break;
        case 3:
            // don't let them move upwards
            if (!NO_UP) {
                peanut.movementDir = 'up';
                peanut.speed = ONE_UNIT;
                peanut.changeAnimation('up')
                peanut.animation.looping = false;
                peanut.animation.goToFrame(0);
            }
            break;
        case 4:
        case 5:
            peanut.movementDir = 'down';
            peanut.speed = ONE_UNIT;
            peanut.changeAnimation('down')
            peanut.animation.looping = false;
            peanut.animation.goToFrame(0);
            break;
        default:
            console.error('movementIndex is out of range');
            break;
    }
}

/*****************************************************************
 * This function is called whenever a peanut escapes
 * @param {The sprite for the peanut who has escaped} sprite
 */
function peanutEscapes(peanut, pipa) {
    pipa.changeAnimation('pipa activated');
    pipa.animation.goToFrame(0);
    pipa.animation.looping = false;
    pipa.animation.play();
    removeFromRenderQueue(peanut);
    cacahuates.remove(peanut);
    solids.remove(peanut);
    peanut.remove();
    peanut.visible = false;
    avisocontador.changeAnimation('counter');
    avisocontador.animation.nextFrame();
    escapeCount++;
}

function checkPeanutKilled(sprite1, sprite2) {
    let player = (sprite1.isPlayer ? sprite1 :
        (sprite2.isPlayer ? sprite2 : undefined))

    let peanut = (cacahuates.contains(sprite1) ? sprite1 :
        (cacahuates.contains(sprite2) ? sprite2 : undefined))

    // now only test this if we've got a peanut and player--in essence
    // this says yes, the two are overlapping, meaning we ran over the peanut
    if (player && peanut) {
        console.log('player killed ' + peanut.name);
        // change the animation to dead
        peanut.changeAnimation('muerto')
        peanut.animation.looping = false;
        peanut.animation.goToFrame(0);
        peanut.isDead = true;
    }
}

/*****************************************************************
 * this takes a sprite in the renderQueue[]
 * and checks to see if it is a member of cacahuates []
 * and calls setPeanutMovementDir() if so.
 * cacahuate is spanish/nahuatl for peanut
 * @param {The sprite to be checked} sprite
 */
function checkForPeanutSprite(sprite) {
    // check to see if this is a peanut sprite, if so, it'll be in the peanut group
    if (cacahuates.contains(sprite)) {
        // if so, move it like if you can
        setPeanutMovementDir(sprite);
    } else {
        // cacahuates allergy
    }
}

/*****************************************************************
 * this function is called by updateRendering()
 * and takes a sprite in the renderQueue[]
 * and checks to see if it is a member of cuffs []
 * and if so, checks to see if the y value is less than the border
 * and if so, removes that sprite from renderQue [] and cuffs []
 * @param {The sprite to be checked} sprite
 */   ///*
function checkCuffsJurisdiction(sprite) {
    // check for y boundary of esposas so that we can remove it at the border
    if (sprite.isEsposa && sprite.position.y < BORDER) {
        // remove from the render queue
        console.log(sprite.name + ' is out of jurisdiction');
        removeFromRenderQueue(sprite);
        sprite.visible = false;
        sprite.remove();
    }
}

/*****************************************************************
 * This checks to see if cuffs are overlapping with a peanut
 * @param {The cuff being flung} cuffs
 */
function checkForCaughtPeanut(cuffs) {
    // this returns true if a peanut was caught, false otherwise
    if (cuffs.isEsposa) {
        return cuffs.overlap(cacahuates, (cuffs, peanut) => {
            console.log('peanut ' + peanut.name + ' caught by cuffs! ' + cuffs.name)
            // only catch them once with cuffs, second time won't do anything
            // but make the cuffs disappear
            if (!peanut.isCaught) {
                peanut.isCaught = true;
                peanut.changeAnimation('caught jump');
                peanut.animation.looping = false;
                peanut.animation.goToFrame(0);
            }
            cuffs.visible = false
            removeFromRenderQueue(cuffs)
            cuffs.remove()
        });
    }
}

/*****************************************************************
 * This function checks if a peanut can be deported. It's used by passing it to 
 * a call to overlap, which takes a function as the second argument. If overlap returns
 * true, then the given function is called (this one, for example). We check if
 * one of these is a peanut and one is the deportation center. We then deport if we can!
 * @param {First sprite involved} sprite1 
 * @param {Second sprite involved} sprite2 
 * @returns 
 */
function checkPeanutDeportation(sprite1, sprite2) {
    // see if either is a peanut, if so, we'll assign the name peanut to it
    let peanut = cacahuates.contains(sprite1) ? sprite1 :
        (cacahuates.contains(sprite2) ? sprite2 : undefined)

    // if peanut is undefined or hasn't been caught, we'll just return, nothing to do
    if (!peanut || !peanut.isCaught)
        return;

    console.log('checking possible deportation of ' + peanut.name);

    let deportation = sprite1.name === 'deportationcenter' ? sprite1 :
        (sprite2.name === 'deportationcenter' ? sprite2 : undefined)

    // and if it's not the deportation center, we'll do nothing
    if (!deportation) {
        return;
    }

    // and finally, make sure we're not already deporting someone
    if (deportation.deporting) {
        console.log('checking to deport ' + peanut.name + ' but busy deporting ' + deportation.deporting.name
            + 'who is flagged as deported ' + deportation.deporting.isDeported);
        return;
    }

    console.log(peanut.name + ' will be deported');
    // otherwise we have a peanut and deportation, so first, make the peanut disappear
    peanut.isDeported = true;

    // now turn on animation for deportation center
    deportacioncenter.changeAnimation('gate activated')
    deportacioncenter.animation.looping = false;
    deportacioncenter.animation.goToFrame(0);
    deportacioncenter.deporting = peanut;
    console.log('deporting ' + deportation.deporting.name);
}

/*****************************************************************
 * Checks to see if we're the deportation center and if so, tries
 * to deport the peanut back to the repatriation center
 * @param {The sprite we're working with} bureaucracy
 */
function checkDeportationCenter(bureaucracy) {
    // see if we're deporting someone
    if (bureaucracy.name === 'deportationcenter' && bureaucracy.deporting) {
        console.log('check if we can repatriate ' + bureaucracy.deporting.name)
        // now see if we can move them to the repatriation center
        if (!repatriationcenter.repatriating) {
            let peanut = bureaucracy.deporting;
            // now let the repatriation center hold the peanut
            repatriationcenter.repatriating = bureaucracy.deporting;
            console.log('moved ' + peanut.name + ' to repatriation center')
            // update our catch count
            catchCount++;

            // update the on screen counter
            // now update the counter
            avisocounter.changeAnimation('counter');
            avisocounter.animation.nextFrame();

            // make room for more deportation
            bureaucracy.deporting = undefined;
            peanut.position.x = repatriationcenter.position.x;
            peanut.position.y = repatriationcenter.position.y;
        }
    } // otherwise we're not the deportation center or if we are, we're not deporting
}

/*****************************************************************
 * Checks to see if we're the repatriation center and if so, tries
 * to repatriate the peanut back into Mexico
 * @param {The sprite we're working with} bureaucracy
 */
function checkRepatriationCenter(bureaucracy) {
    // check first if we're repatriating someone
    if (bureaucracy.name === 'repatriationcenter' && bureaucracy.repatriating) {
        bureaucracy.changeAnimation('gate activated');
        bureaucracy.animation.looping = false;
        bureaucracy.animation.rewind();
        let peanut = bureaucracy.repatriating;
        peanut.position.x -= 32;
        // well, move it back if it's overlapping
        if (solids.overlap(peanut)) {
            console.log('no room to repatriate ' + peanut.name)
            peanut.position.x += 32;
        } else {
            console.log(peanut.name + ' repatriated!')
            bureaucracy.repatriating = undefined;
            // otherwise, we can stay here, so change the animations and stuff
            peanut.isCaught = false;
            peanut.isDeported = false;
            peanut.changeAnimation('down');

        }
    }
}

/************************************************************
 * this function takes/receives a rendering queue and timing;
 * and, updates positions based on how much
 * time has elapsed at this point in the game
 * @param {A queue of sprites to render} queue
 * @param {How long we spend at each sprite drawing} timing
 */
function updateRendering(queue, timing) {
    // frameCount++;
    // let rate = frameCount / (millis() / 1000);
    //console.log('rate: ' + rate);

    // calculate the next index
    //const nextIdx = getNextIndex(queue, currentIndex, timing);

    // get a reference to the current sprite because sometimes
    // they get removed from the queue after updating and
    // we want to hold onto it for the duration of the function
    let sprite = queue[currentIndex];

    let nextIdx = currentIndex;
    // this returns true if we have another frame, false otherwise
    if (!manuallyAnimate(sprite, sprite.animation.looping)) {
        nextIdx = getNextIndex(renderQueue, currentIndex);
        console.log('next index is ' + nextIdx)
        updateSprite(sprite)
    }

    // if the index hasn't changed, then we need to manually animate the sprite
    if (nextIdx !== currentIndex) {

        // first, check for peanut escape
        if (sprite.overlap(pipas, peanutEscapes)) {
            console.log('peanut ' + sprite.name + ' escapes!');
        }

        // checks to see if the sprite is a cuff, and if so, removes it from the render queue
        checkCuffsJurisdiction(sprite);

        // checks if this sprite is a cuff, and if so, if it's overlapping with
        // a peanut so that they can be caught (also ignore it if it was removed)
        if (!sprite.removedFromQueue)
            checkForCaughtPeanut(sprite);

        // after updating, the sprite has moved so it's no longer animated
        sprite.hasMoved = false;

        // check if this is the deportation center and deport if we can
        checkDeportationCenter(sprite);

        // check if this is the repatriation center and repatriate if we can
        checkRepatriationCenter(sprite);

        // at this point, we can update our index, but if it was
        // removed from the queue, our current index points now
        // to the next index, so we want to recalculate it
        if (sprite.removedFromQueue) {
            currentIndex--;
            nextIdx = getNextIndex(queue, currentIndex);
            console.log('next index is ' + nextIdx)
        }

        // otherwise, just use the next index
        currentIndex = nextIdx

        // this is the new sprite
        sprite = queue[currentIndex];

        // this will cause the peanut to face their next direction they'll be moving
        // since it will go to the first frame in their animation after they pick a direction
        // note that we do this only when we're the new sprite to be animated
        checkForPeanutSprite(sprite);
    }
}

/**
 * Manually animate the sprite by moving to the next frame
 * @param {The sprite we're animating} sprite
 */
function manuallyAnimate(sprite, looping) {
    // if we're not at the last frame, we can move forward one frame
    if (sprite.animation.getFrame() != sprite.animation.getLastFrame()) {
        sprite.animation.nextFrame();
        // return true that there might be another frame
        return true;
    } else {
        // if we're looping, then rewind the animation
        if (looping)
            sprite.animation.rewind();

        // return false if we're at the last frame so we know to move on
        return false;
    }
}

/**********************************************
 * is called by updateRendering()
 * stops the animation of the sprite in the queue at the current index
 */
function stopSprite(sprite) {
    // console.log('stopping ' + sprite.name);
    if (sprite.animation) {
        //sprite.animation.stop();
        //sprite.animation.rewind();
    }
}

const BORDER = 7 * 32;
/**********************************************************
 * is called by updateRendering() and receives a sprite in the queue
 * updateSprite figures out which way a sprite is moving and where to draw it
 */
function updateSprite(sprite) {
    //console.log('updating ' + sprite.name);
    // if (sprite.animation) {
    //     sprite.animation.play();
    // }

    // now we deal with user input
    if (sprite.isPlayer == true) {
        //console.log('player x pos is ' + sprite.position.x)
        // if so, get the next movement that's been queued up
        let dir = dequeueInput(inputQueue)
        if (dir && gameState === 'play') {
            sprite.movementDir = dir;
            // don't move if we're just flinging esposas
            if (dir !== 'esposas') {
                sprite.hasMoved = true;
                sprite.changeAnimation('move');
                sprite.animation.looping = false;
                sprite.animation.rewind();
            }
        } else {
            // and if there's no movement, just be idle
            sprite.movementDir = 'idle';
        }
    }

    // how a sprite moves, and generally they shouldn't collide
    switch (sprite.movementDir) {
        case 'left':
            sprite.position.x = sprite.position.x - sprite.speed;
            // bound the x-axis at 0, unless you're the player, then it's 32
            if (sprite.position.x < (sprite.isPlayer ? 32 : 0) ||
                (solids.contains(sprite) && solids.overlap(sprite))) {
                // at this point we know there's an overlap of the solids
                // and the sprite--well the main interesting question is
                // was this the player moving onto a peanut
                if (sprite.isPlayer && sprite.overlap(solids, checkPeanutKilled)) {
                    console.log('player ran over a peanut');
                }

                // we calculate the new position as such so that
                // the sprite x position cannot be below 0,
                // we may want to be sure that x should be 32 instead of 16
                sprite.position.x += sprite.speed;
            }
            break;
        case 'right':
            // bound the x-axis at the shadows under the bridge
            sprite.position.x = sprite.position.x + sprite.speed;
            // this is a bit more complicated, mainly because if we're a
            // caught sprite, it's okay to walk beneath the bridge, so
            // we're allowed to move to the edge of the screen
            if (sprite.position.x >= WIDTH - (sprite.isCaught ? 0 : 32) ||
                (solids.contains(sprite) && solids.overlap(sprite, checkPeanutDeportation))) {

                // at this point we know there's an overlap of the solids
                // and the sprite--well the main interesting question is
                // was this the player moving onto a peanut
                if (sprite.isPlayer && sprite.overlap(solids, checkPeanutKilled)) {
                    console.log('player ran over a peanut');
                }

                // check to see if this is a peanut and they've been caught, because
                // we have special rules for them, i.e., that they can walk over the avisocounter,
                // in essence, they can't move right if they're a peanut, they're caught
                // and the overlap (from the outer if statement) was not with the avisocounter
                if (cacahuates.contains(sprite) && sprite.isCaught && !caughtSolids.overlap(sprite)) {
                    console.log('special case: ' + sprite.name + ' isCaught: ' + sprite.isCaught);
                } else {
                    // we calculate the new position as such so that
                    // the sprite x value can never be more than width-32,
                    // in essence bounding the position
                    sprite.position.x -= sprite.speed;
                }
            }
            break;
        case 'up':
            // bound the y-axis at 32
            sprite.position.y = sprite.position.y - sprite.speed;

            if (sprite.position.y < 16 ||
                (solids.contains(sprite) && solids.overlap(sprite))) {
                // calculate the new position as such so that
                // the sprite y position can never be less than 0
                // the sprites are 64 pixels tall and so their center is 32
                sprite.position.y += sprite.speed;
            }
            break;
        case 'down':
            // bound the lower y-axis at height-32
            sprite.position.y = sprite.position.y + sprite.speed;
            if (sprite.position.y > HEIGHT - 32 ||
                (solids.contains(sprite) && solids.overlap(sprite, checkPeanutDeportation))) {
                // the y position of the sprite should never exceed height-32
                sprite.position.y -= sprite.speed;
            }
            break;
        case 'idle':
            sprite.position.x = sprite.position.x;
            sprite.position.y = sprite.position.y;
            break;
        case 'esposas':
            makeEsposas(migra.position.x + 16, migra.position.y - 32, 32, 32);
            break;
        case 'none':
            // for the non-moving objects
            break;
        default:
            console.error('movementDir on ' + sprite.name + ' is undefined as \'' + sprite.movementDir + '\'');
            break;
    }
}


/*********************************************************
 *
 *  preload() necessary to load images into sprites
 *
 */
function preload() {
    /*
     *  load images for tierra and set default background
     */
    let img0; // img0 - img9 will be placeholders that only exist within preload function
    let img1;
    let img2;
    let img3;
    let img4;
    let img5;
    let img6;
    let img7;
    let img8;
    let img9;

    timeStamp = millis() / 1000 + RENDER_TIME;

    /*
     * load and create tierra
     */
    img0 = loadImage('img-lamigra/la-migra_masthead.png'); // title screen image
    if (BUGGY) {
        img1 = loadImage('img-lamigra/frontera02_grid.png');  // this is the game play field and is 512 x 544 pixels with a grid
    } else {
        img1 = loadImage('img-lamigra/frontera02.png');  // this is the game play field and is 512 x 544 pixels without a grid
    }
    img2 = loadImage('img-lamigra/la-migra_cold_one_017.png');
    img3 = loadImage('img-lamigra/la-migra_cold_one_018.png');
    tierra = createSprite(256, 272); // 256,256 presumes a 512 x 512 background. this is not true, actually 512 x 544. fixed to 256 x 272
    tierra.spriteId = spriteId++;
    tierra.addImage('masthead', img0); // title screen
    tierra.addImage('mapa', img1); // gameplay screen
    tierra.addImage('pierdes', img2); // loss screen
    tierra.addImage('ganas', img3); // victory screen
    tierra.changeImage('masthead'); // set the background to mapa while we develop, will need to change later
    tierra.debug = BUGGY; // set the debug flag
    tierra.name = 'tierra'

    /*
     *  load images for drain pipe set piece along bottom of screen
     */
    img0 = loadImage('img-lamigra/pipeA.png'); // is the resting state for a pipe sprite
    img1 = loadImage('img-lamigra/pipeB.png'); // is the illuminated, activated state for a pipe sprite
    pipa0 = createSprite(2 * 32 + 16, 16 * 32 + 16, 32, 32);
    pipa0.spriteId = spriteId++;
    pipa0.addImage('pipa', img0);
    pipa0.addAnimation('pipa activated', img0, img1, img1, img0);
    pipa0.animation.looping = false;
    pipa0.debug = DRAW_COLLIDER; // set the debug flag
    pipa0.setCollider('rectangle', 0, 0, 32, 32)
    pipa0.name = 'pipa0';

    pipa1 = createSprite(32 * 5 + 16, 16 * 32 + 16, 32, 32);
    pipa1.spriteId = spriteId++;
    pipa1.addImage('pipa', img0);
    pipa1.addAnimation('pipa activated', img0, img1, img1, img0);
    pipa1.animation.looping = false;
    pipa1.debug = DRAW_COLLIDER; // set the debug flag
    pipa1.setCollider('rectangle', 0, 0, 32, 32)
    pipa1.name = 'pipa1';

    pipa2 = createSprite(32 * 8 + 16, 16 * 32 + 16, 32, 32);
    pipa2.spriteId = spriteId++;
    pipa2.addImage('pipa', img0);
    pipa2.addAnimation('pipa activated', img0, img1, img1, img0);
    pipa2.animation.looping = false;
    pipa2.debug = DRAW_COLLIDER; // set the debug flag
    pipa2.setCollider('rectangle', 0, 0, 32, 32)
    pipa2.name = 'pipa2';

    pipa3 = createSprite(32 * 11 + 16, 16 * 32 + 16, 32, 32);
    pipa3.spriteId = spriteId++;
    pipa3.addImage('pipa', img0);
    pipa3.addAnimation('pipa activated', img0, img1, img1, img0);
    pipa3.animation.looping = false;
    pipa3.debug = DRAW_COLLIDER; // set the debug flag
    pipa3.setCollider('rectangle', 0, 0, 32, 32)
    pipa3.name = 'pipa3';

    pipas = new Group(); // the group of drain pipes, should allow for testing collision with group
    pipas.add(pipa0); // push pipa0 onto pipas group which acts like an array
    pipas.add(pipa1);
    pipas.add(pipa2);
    pipas.add(pipa3);

    /*
     * load images for migra, player character
     */
    img0 = loadImage('img-lamigra/migra_car-1.png');
    img1 = loadImage('img-lamigra/migra_car-2.png');
    migra = createSprite(8 * 32, 13 * 32 + 16, 64, 32); // verify the size of images for this sprite
    migra.spriteId = spriteId++;
    migra.addAnimation('move', img1, img0, img1, img0);
    migra.addAnimation('stay', img0);
    migra.changeAnimation('stay');
    migra.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(migra); // add migra to renderQueue []
    migra.name = 'migra';
    migra.animation.playing = false;
    migra.movementDir = 'idle';
    migra.speed = 32;
    migra.isPlayer = true;

    /*
     * load images for esposas sprite
     * deprecated in favor of the dynamically generated one in flingEsposas currently in draw()
     */

    /*
     *  to do: load images for bala(s) (or not)
     *  this code will look like flingEsposas with disappearance at y <= 16
     */

    /*
     * load imgages for avisocontador sprite, should be yellow sign
     */
    img0 = loadImage('img-lamigra/counter-2-0.png');
    img1 = loadImage('img-lamigra/counter-2-1.png');
    img2 = loadImage('img-lamigra/counter-2-2.png');
    img3 = loadImage('img-lamigra/counter-2-3.png');
    img4 = loadImage('img-lamigra/counter-2-4.png');
    img5 = loadImage('img-lamigra/counter-2-5.png');
    img6 = loadImage('img-lamigra/counter-2-6.png');
    img7 = loadImage('img-lamigra/counter-2-7.png');
    img8 = loadImage('img-lamigra/counter-2-8.png');
    img9 = loadImage('img-lamigra/counter-2-9.png');
    avisocontador = createSprite(16, 32 * 14 + 16, 32, 32);
    avisocontador.spriteId = spriteId++;
    avisocontador.addImage('0', img0);
    avisocontador.addImage('1', img1);
    avisocontador.addImage('2', img2);
    avisocontador.addImage('3', img3);
    avisocontador.addImage('4', img4);
    avisocontador.addImage('5', img5);
    avisocontador.addImage('6', img6);
    avisocontador.addImage('7', img7);
    avisocontador.addImage('8', img8);
    avisocontador.addImage('9', img9);
    avisocontador.addAnimation('counter', img0, img1, img2, img3, img4, img5, img6, img7, img8, img9);
    avisocontador.setCollider('rectangle', 0, 0, 28, 28)
    avisocontador.debug = DRAW_COLLIDER; // set the debug flag
    avisocontador.name = 'avisocontador';

    /*
     * load images for avisocounter sprite, should be pale blue sign
     */
    img0 = loadImage('img-lamigra/counter-3-0.png');
    img1 = loadImage('img-lamigra/counter-3-1.png');
    img2 = loadImage('img-lamigra/counter-3-2.png');
    img3 = loadImage('img-lamigra/counter-3-3.png');
    img4 = loadImage('img-lamigra/counter-3-4.png');
    img5 = loadImage('img-lamigra/counter-3-5.png');
    img6 = loadImage('img-lamigra/counter-3-6.png');
    img7 = loadImage('img-lamigra/counter-3-7.png');
    img8 = loadImage('img-lamigra/counter-3-8.png');
    img9 = loadImage('img-lamigra/counter-3-9.png');
    avisocounter = createSprite(14 * 32 + 16, 16 * 32 + 16, 32, 32);
    avisocounter.spriteId = spriteId++;
    avisocounter.addImage('0', img0);
    avisocounter.addImage('1', img1);
    avisocounter.addImage('2', img2);
    avisocounter.addImage('3', img3);
    avisocounter.addImage('4', img4);
    avisocounter.addImage('5', img5);
    avisocounter.addImage('6', img6);
    avisocounter.addImage('7', img7);
    avisocounter.addImage('8', img8);
    avisocounter.addImage('9', img9);
    avisocounter.addAnimation('counter', img0, img1, img2, img3, img4, img5, img6, img7, img8, img9);
    avisocounter.setCollider('rectangle', 0, 0, 28, 28)
    avisocounter.debug = DRAW_COLLIDER; // set the debug flag
    avisocounter.name = 'avisocounter'
    /*
     *  load images for MariaLucia De Pieles non-player character sprite
     */
    maluciadepieles = createSprite(4 * 32 + 16, 2 * 32, 32, 64);
    maluciadepieles.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/marialucia-2_01.png');
    img1 = loadImage('img-lamigra/marialucia-2_02.png');
    maluciadepieles.addAnimation('idle', img0);
    maluciadepieles.addAnimation('down', img0, img1, img0);
    img0 = loadImage('img-lamigra/marialucia-2_03.png');
    img1 = loadImage('img-lamigra/marialucia-2_04.png');
    maluciadepieles.addAnimation('right', img1, img0, img1);
    img0 = loadImage('img-lamigra/marialucia-2_05.png');
    img1 = loadImage('img-lamigra/marialucia-2_06.png');
    maluciadepieles.addAnimation('left', img1, img0, img1);
    img0 = loadImage('img-lamigra/marialucia-2_07.png');
    img1 = loadImage('img-lamigra/marialucia-2_08.png');
    maluciadepieles.addAnimation('up', img1, img0, img1);
    img0 = loadImage('img-lamigra/marialucia-2_11.png');
    img1 = loadImage('img-lamigra/marialucia-2_12.png');
    maluciadepieles.addAnimation('caught down', img0, img1, img0);
    img0 = loadImage('img-lamigra/marialucia-2_12.png');
    img1 = loadImage('img-lamigra/marialucia-2_13.png');
    maluciadepieles.addAnimation('caught right', img0, img1, img0);
    img0 = loadImage('img-lamigra/marialucia-2_09.png');
    maluciadepieles.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/marialucia-2_10.png');
    maluciadepieles.addAnimation('muerto', img0, img1, img1);
    maluciadepieles.changeAnimation('down');
    maluciadepieles.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    maluciadepieles.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(maluciadepieles); // add maluciadepieles to renderQueue []
    maluciadepieles.name = 'maluciadepieles';
    maluciadepieles.animation.playing = false;
    maluciadepieles.movementDir = 'idle';
    maluciadepieles.speed = 32;
    maluciadepieles.isCaught = false;

    /*
     * load images for Nita Moreno non-player character
     */
    nitamoreno = createSprite(8 * 32 + 16, 2 * 32, 32, 64);
    nitamoreno.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/nita-2_01.png');
    img1 = loadImage('img-lamigra/nita-2_02.png');
    nitamoreno.addAnimation('idle', img0);
    nitamoreno.addAnimation('down', img0, img1, img0); // resolved - something wrong here
    img0 = loadImage('img-lamigra/nita-2_03.png');
    img1 = loadImage('img-lamigra/nita-2_04.png');
    nitamoreno.addAnimation('right', img1, img0, img1);
    img0 = loadImage('img-lamigra/nita-2_05.png');
    img1 = loadImage('img-lamigra/nita-2_06.png');
    nitamoreno.addAnimation('left', img1, img0, img1);
    img0 = loadImage('img-lamigra/nita-2_07.png');
    img1 = loadImage('img-lamigra/nita-2_08.png');
    nitamoreno.addAnimation('up', img0, img1, img0); // resolved - something wrong here
    img0 = loadImage('img-lamigra/nita-2_11.png');
    img1 = loadImage('img-lamigra/nita-2_12.png');
    nitamoreno.addAnimation('caught down', img0, img1, img0);
    img2 = loadImage('img-lamigra/nita-2_13.png');
    nitamoreno.addAnimation('caught right', img1, img2, img1);
    img0 = loadImage('img-lamigra/nita-2_09.png');
    nitamoreno.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/nita-2_10.png');
    nitamoreno.addAnimation('muerto', img0, img1, img1);
    nitamoreno.changeAnimation('down');
    nitamoreno.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    nitamoreno.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(nitamoreno); // add nitamoreno to renderQueue []
    nitamoreno.name = 'nitamoreno';
    nitamoreno.animation.playing = false;
    nitamoreno.movementDir = 'idle';
    nitamoreno.speed = 32;
    nitamoreno.isCaught = false;

    /*
     *  load images for Lino De Pieles non-player character sprite
     */
    linodepieles = createSprite(2 * 32 + 16, 2 * 32, 32, 64);
    linodepieles.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/lino-2_01.png');
    img1 = loadImage('img-lamigra/lino-2_02.png');
    linodepieles.addAnimation('idle', img0);
    linodepieles.addAnimation('down', img0, img1, img0);
    img0 = loadImage('img-lamigra/lino-2_03.png');
    img1 = loadImage('img-lamigra/lino-2_04.png');
    linodepieles.addAnimation('left', img0, img1, img0);
    img0 = loadImage('img-lamigra/lino-2_05.png');
    img1 = loadImage('img-lamigra/lino-2_06.png');
    linodepieles.addAnimation('up', img0, img1, img0);
    img0 = loadImage('img-lamigra/lino-2_07.png');
    img1 = loadImage('img-lamigra/lino-2_08.png');
    linodepieles.addAnimation('right', img0, img1, img0);
    img0 = loadImage('img-lamigra/lino-2_11.png');
    img1 = loadImage('img-lamigra/lino-2_12.png');
    linodepieles.addAnimation('caught down', img0, img1, img0);
    img0 = loadImage('img-lamigra/lino-2_12.png');
    img1 = loadImage('img-lamigra/lino-2_13.png');
    linodepieles.addAnimation('caught right', img1, img0, img1);
    img0 = loadImage('img-lamigra/lino-2_09.png');
    linodepieles.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/lino-2_10.png');
    linodepieles.addAnimation('muerto', img0, img1, img1);
    linodepieles.changeAnimation('down');
    linodepieles.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    linodepieles.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(linodepieles);
    linodepieles.name = 'linodepieles';
    linodepieles.animation.playing = false;
    linodepieles.movementDir = 'idle';
    linodepieles.speed = 32;
    linodepieles.isCaught = false;

    /*
    * add imgages for Carlos Moreno non-player character
    */
    carlosmoreno = createSprite(16, 2 * 32, 32, 64);
    carlosmoreno.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/Carlos-Moreno-3_01.png');
    img1 = loadImage('img-lamigra/Carlos-Moreno-3_02.png');
    carlosmoreno.addAnimation('idle', img0);
    carlosmoreno.addAnimation('down', img0, img1, img0);
    img0 = loadImage('img-lamigra/Carlos-Moreno-3_03.png');
    img1 = loadImage('img-lamigra/Carlos-Moreno-3_04.png');
    carlosmoreno.addAnimation('up', img0, img1, img0);
    img0 = loadImage('img-lamigra/Carlos-Moreno-3_05.png');
    img1 = loadImage('img-lamigra/Carlos-Moreno-3_06.png');
    carlosmoreno.addAnimation('right', img0, img1, img0);
    img1 = loadImage('img-lamigra/Carlos-Moreno-3_07.png');
    img0 = loadImage('img-lamigra/Carlos-Moreno-3_08.png');
    carlosmoreno.addAnimation('left', img0, img1, img0);
    img0 = loadImage('img-lamigra/Carlos-Moreno-3_11.png');
    img1 = loadImage('img-lamigra/Carlos-Moreno-3_12.png');
    carlosmoreno.addAnimation('caught down', img0, img1, img0);
    img2 = loadImage('img-lamigra/Carlos-Moreno-3_13.png');
    carlosmoreno.addAnimation('caught right', img1, img2, img1);
    img0 = loadImage('img-lamigra/Carlos-Moreno-3_14.png');
    carlosmoreno.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/Carlos-Moreno-3_15.png');
    carlosmoreno.addAnimation('muerto', img0, img1, img1);
    carlosmoreno.changeAnimation('down');
    carlosmoreno.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    carlosmoreno.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(carlosmoreno); // add carlosmoreno to renderQueue []
    carlosmoreno.name = 'carlosmoreno';
    carlosmoreno.animation.playing = false;
    carlosmoreno.movementDir = 'idle';
    carlosmoreno.speed = 32;
    carlosmoreno.isCaught = false;

    /*
     *  load images for Marcia non-player character sprite
     */
    marcia = createSprite(6 * 32 + 16, 2 * 32, 32, 64);
    marcia.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/marcia-3_01.png');
    img1 = loadImage('img-lamigra/marcia-3_02.png');
    marcia.addAnimation('idle', img0);
    marcia.addAnimation('down', img0, img1, img0);
    img0 = loadImage('img-lamigra/marcia-3_03.png');
    img1 = loadImage('img-lamigra/marcia-3_04.png');
    marcia.addAnimation('up', img0, img1, img0);
    img0 = loadImage('img-lamigra/marcia-3_05.png');
    img1 = loadImage('img-lamigra/marcia-3_06.png');
    marcia.addAnimation('right', img0, img1, img0);
    img0 = loadImage('img-lamigra/marcia-3_07.png');
    img1 = loadImage('img-lamigra/marcia-3_08.png');
    marcia.addAnimation('left', img0, img1, img0);
    img0 = loadImage('img-lamigra/marcia-3_11.png');
    img1 = loadImage('img-lamigra/marcia-3_12.png');
    marcia.addAnimation('caught down', img0, img1, img0); // resolved - one of these frames is not transparent
    img0 = loadImage('img-lamigra/marcia-3_12.png');
    img1 = loadImage('img-lamigra/marcia-3_13.png');
    marcia.addAnimation('caught right', img0, img1, img0);
    img0 = loadImage('img-lamigra/marcia-3_09.png');
    marcia.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/marcia-3_10.png');
    marcia.addAnimation('muerto', img0, img1, img1);
    marcia.changeAnimation('down');
    marcia.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    marcia.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(marcia); // add marcia to renderQueue []
    marcia.name = 'marcia';
    marcia.animation.playing = false;
    marcia.movementDir = 'idle';
    marcia.speed = 32;
    marcia.isCaught = false;

    /*
     * load images for Patricia La Machona non-player character sprite
     */
    patricialamachona = createSprite(10 * 32 + 16, 2 * 32, 32, 64);
    patricialamachona.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/patricia-2_01.png');
    img1 = loadImage('img-lamigra/patricia-2_02.png');
    patricialamachona.addAnimation('idle', img0);
    patricialamachona.addAnimation('down', img0, img1, img0);
    img1 = loadImage('img-lamigra/patricia-2_03.png');
    img0 = loadImage('img-lamigra/patricia-2_04.png');
    patricialamachona.addAnimation('right', img0, img1, img0);
    img0 = loadImage('img-lamigra/patricia-2_05.png');
    img1 = loadImage('img-lamigra/patricia-2_06.png');
    patricialamachona.addAnimation('up', img0, img1, img0);
    img1 = loadImage('img-lamigra/patricia-2_07.png');
    img0 = loadImage('img-lamigra/patricia-2_08.png');
    patricialamachona.addAnimation('left', img0, img1, img0);
    img0 = loadImage('img-lamigra/patricia-2_11.png');
    img1 = loadImage('img-lamigra/patricia-2_12.png');
    patricialamachona.addAnimation('caught down', img0, img1, img0);
    img0 = loadImage('img-lamigra/patricia-2_12.png');
    img1 = loadImage('img-lamigra/patricia-2_13.png');
    patricialamachona.addAnimation('caught right', img0, img1, img0);
    img0 = loadImage('img-lamigra/patricia-2_09.png');
    patricialamachona.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/patricia-2_10.png');
    patricialamachona.addAnimation('muerto', img0, img1, img1);
    patricialamachona.changeAnimation('down');
    patricialamachona.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    patricialamachona.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(patricialamachona); // add patricialamachona to renderQueue []
    patricialamachona.name = 'patricialamachona';
    patricialamachona.animation.playing = false;
    patricialamachona.movementDir = 'idle';
    patricialamachona.speed = 32;
    patricialamachona.isCaught = false;

    /*
     *  load imgaes for Puercoespin non-player character sprite
     */
    puercoespin = createSprite(12 * 32 + 16, 2 * 32, 32, 64);
    puercoespin.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/porcupine_01.png');
    img1 = loadImage('img-lamigra/porcupine_02.png');
    puercoespin.addAnimation('idle', img0);
    puercoespin.addAnimation('down', img0, img1, img0);
    img0 = loadImage('img-lamigra/porcupine_03.png');
    img1 = loadImage('img-lamigra/porcupine_04.png');
    puercoespin.addAnimation('right', img0, img1, img0);
    img0 = loadImage('img-lamigra/porcupine_05.png');
    img1 = loadImage('img-lamigra/porcupine_06.png');
    puercoespin.addAnimation('left', img0, img1, img0);
    img0 = loadImage('img-lamigra/porcupine_07.png');
    img1 = loadImage('img-lamigra/porcupine_08.png');
    puercoespin.addAnimation('up', img0, img1, img0);
    img1 = loadImage('img-lamigra/porcupine_15.png');
    img0 = loadImage('img-lamigra/porcupine_16.png');
    puercoespin.addAnimation('caught down', img0, img1, img0);
    img0 = loadImage('img-lamigra/porcupine_15.png');
    img1 = loadImage('img-lamigra/porcupine_17.png');
    puercoespin.addAnimation('caught right', img0, img1, img0);
    img0 = loadImage('img-lamigra/porcupine_13.png');
    puercoespin.addAnimation('caught jump', img0, img0, img0);
    img1 = loadImage('img-lamigra/porcupine_14.png');
    puercoespin.addAnimation('muerto', img0, img1, img1);
    puercoespin.changeAnimation('down');
    puercoespin.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    puercoespin.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(puercoespin); // add puercoespin to renderQueue []
    puercoespin.name = 'puercoespin';
    puercoespin.animation.playing = false;
    puercoespin.movementDir = 'idle';
    puercoespin.speed = 32;
    puercoespin.isCaught = false;

    /*
     *  load images for X-rodar non-player character sprite
     */
    xrodar = createSprite(14 * 32 + 16, 2 * 32, 32, 64);
    xrodar.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/X-rodar-3_01.png');
    img1 = loadImage('img-lamigra/X-rodar-3_02.png');
    xrodar.addAnimation('idle', img0);
    xrodar.addAnimation('down', img0, img1, img0);
    img0 = loadImage('img-lamigra/X-rodar-3_03.png');
    img1 = loadImage('img-lamigra/X-rodar-3_04.png');
    xrodar.addAnimation('right', img0, img1, img0);
    img0 = loadImage('img-lamigra/X-rodar-3_05.png');
    img1 = loadImage('img-lamigra/X-rodar-3_06.png');
    xrodar.addAnimation('left', img0, img1, img0);
    img0 = loadImage('img-lamigra/X-rodar-3_07.png');
    img1 = loadImage('img-lamigra/X-rodar-3_08.png');
    xrodar.addAnimation('up', img0, img1, img0);
    img0 = loadImage('img-lamigra/X-rodar-3_11.png');
    img1 = loadImage('img-lamigra/X-rodar-3_12.png');
    xrodar.addAnimation('caught down', img0, img1, img0); // resolved - one frame has white pixels
    img0 = loadImage('img-lamigra/X-rodar-3_12.png');
    img1 = loadImage('img-lamigra/X-rodar-3_13.png');
    xrodar.addAnimation('caught right', img0, img1, img0);
    img0 = loadImage('img-lamigra/X-rodar-3_09.png');
    xrodar.addAnimation('caught jump', img0, img0, img0); // resolved - image is not transparent
    img1 = loadImage('img-lamigra/X-rodar-3_10-copy-b.png');
    xrodar.addAnimation('muerto', img0, img1, img1); // resolved - image is not transparent
    xrodar.changeAnimation('down');
    xrodar.setCollider('rectangle', 0, 0, 30, 62); // set a collision box two pixels smaller than sprite
    xrodar.debug = DRAW_COLLIDER; // set the debug flag
    renderQueue.push(xrodar); // add xrodar to renderQueue []
    xrodar.name = 'xrodar';
    xrodar.animation.playing = false;
    xrodar.movementDir = 'idle';
    xrodar.speed = 32;
    xrodar.isCaught = false;

    /*
     *  create a group for non-player characters
     */
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
    deportacioncenter = createSprite(15 * 32 + 16, 15 * 32 + 16, 32, 96);
    deportacioncenter.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/gates3AAA.png');
    img1 = loadImage('img-lamigra/gates3BB.png');
    deportacioncenter.addImage('gate', img0);
    deportacioncenter.addAnimation('gate activated', img1, img1, img1, img0);
    //deportacioncenter.changeAnimation('gate activated'); // will change, activated for testing purposes during development
    deportacioncenter.setCollider('rectangle', 0, 16, 28, 56);
    deportacioncenter.debug = DRAW_COLLIDER; // set the debug flag
    deportacioncenter.name = 'deportationcenter'
    deportacioncenter.movementDir = 'none';
    renderQueue.push(deportacioncenter);

    /*
     *  load image for repatriation center
     */
    repatriationcenter = createSprite(15 * 32 + 16, 32 + 16, 32, 96);
    repatriationcenter.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/porton3A.png');
    img1 = loadImage('img-lamigra/porton3B.png');
    repatriationcenter.addImage('gate', img0);
    repatriationcenter.addAnimation('gate activated', img1, img1, img1, img0);
    //repatriationcenter.changeAnimation('gate activated'); // will change,
    repatriationcenter.setCollider('rectangle', 0, 0, 28, 60);
    repatriationcenter.debug = DRAW_COLLIDER; // set the debug flag
    repatriationcenter.name = 'repatriationcenter'
    repatriationcenter.movementDir = 'none'
    renderQueue.push(repatriationcenter);

    /*
     *  create a group for the solid objects
     */
    solids = new Group();
    solids.add(maluciadepieles);
    solids.add(nitamoreno);
    solids.add(linodepieles);
    solids.add(carlosmoreno);
    solids.add(marcia);
    solids.add(patricialamachona);
    solids.add(puercoespin);
    solids.add(xrodar);
    solids.add(deportacioncenter);
    solids.add(migra);
    solids.add(repatriationcenter);
    solids.add(avisocounter);
    solids.add(avisocontador);

    caughtSolids = new Group();
    caughtSolids.add(maluciadepieles);
    caughtSolids.add(nitamoreno);
    caughtSolids.add(linodepieles);
    caughtSolids.add(carlosmoreno);
    caughtSolids.add(marcia);
    caughtSolids.add(patricialamachona);
    caughtSolids.add(puercoespin);
    caughtSolids.add(xrodar);
    //caughtSolids.add(deportacioncenter);
    caughtSolids.add(migra);
    caughtSolids.add(repatriationcenter);
    // do not add avisocounter, so that the caught peanuts can walk through it
    caughtSolids.add(avisocontador);


    /*
     * load image for shadows along right hand side of screen
     */
    sombra0 = createSprite(15 * 32 + 16, 4 * 32 + 16, 32, 96); // will contain shadowB.png
    sombra0.spriteId = spriteId++;
    sombra1 = createSprite(15 * 32 + 16, 8 * 32, 32, 128); // will contain shadowC.png
    sombra1.spriteId = spriteId++;
    sombra2 = createSprite(15 * 32 + 16, 12 * 32, 32, 128); // will contain shadowC.png
    sombra2.spriteId = spriteId++;
    img0 = loadImage('img-lamigra/shadowCCC.png'); // used twice, mid right, lower right
    img1 = loadImage('img-lamigra/shadowBBB.png'); // used once, upper right
    sombra0.addImage('sombra', img1);
    sombra1.addImage('sombra', img0);
    sombra2.addImage('sombra', img0);
    sombra0.setDefaultCollider();
    sombra1.setDefaultCollider();
    sombra2.setDefaultCollider();
    sombra0.debug = BUGGY; // set the debug flag
    sombra1.debug = BUGGY; // set the debug flag
    sombra2.debug = BUGGY; // set the debug flag

    // preload our font into arcadeFont
    arcadeFont = loadFont('assets/04b30.otf'); // this is a freeware font from http://www.04.jp.org/
} // end preload()


const INPUT_DELAY = .25;
let readInputAfter = 0;

/***********************************************************
 *
 *
 *
 */
function setup() {
    // put setup code here
    //createCanvas(512,544); // La Migra default canvas size
    //createCanvas(448, 548); // Crosser default canvas size
    let canvas = createCanvas(512, 544); // suggested by p5js.org reference for parent()
    canvas.parent('canvas-column'); // place the sketch canvas within the div named canvas-column within index.html
    //
    //
    // cursor is useful for desktop and web served games
    // cursor is not useful for installation with gamepad
    // it may be crucial for installation with Leap Motion Controller
    // we seem to have to provide solutions for both
    // noCursor(); // testing cursor manipulation
    cursor(HAND); // params = HAND, ARROW, CROSS, MOVE, TEXT, WAIT
    //
    frameRate(FRAME_RATE);
    background(128);
    cuffs = new Group(); // a group of esposas-like sprites

    // setup the font parameters to be used by text in 'startup' and 'win' state
    textFont(arcadeFont);
}
function draw() {
    // put drawing code here
    background(128);

    // get the current time
    const currentTime = millis() / 1000;

    // if we've been doing nothing without input for BACK_TO_SELECTION seconds,
    // we'll just reopen the main selection window
    if (currentTime > lastInputAt + BACK_TO_SELECTION_TIMEOUT) {
        open(url, '_self');
    }
    /*
     * I have commented out the switch statement during the early part of coding
     */
    switch (gameState) { // switch is not documented in P5.JS but is part of Javascript
        // case "select":
        //     // statements that display select condition, called by keyReleased() 'g'
        //     // statements that may alter gameState label and condition
        //     // statements that may reload this game
        //     // statements that may launch the other game
        //     break;
        case "startup":
            // temporarily just fall through to play
            // statements to display the startup condition
            // statements that may alter gamestate label and condition
            tierra.changeImage('masthead');
            tierra.depth = 100;
            break;
        case "play":
            tierra.changeImage('mapa')
            tierra.depth = 0;
            // statements that display gameplay

            // update what we're rendering and how frequently
            updateRendering(renderQueue, RENDER_TIME);

            // check if we're winning or losing at this point
            checkWinLose();
            break;
        case "lose":
            tierra.changeImage('pierdes')
            tierra.depth = 100;
            // statements that display loss condition
            break;
        case "win":
            tierra.changeImage('ganas');
            tierra.depth = 100;
            // statements that display win condition
            break;
        default:
            // statements that catch and redirect in case none of the above is true
            break; // is there a 'break' after 'default'? I forget
    }

    // sketch to fling cuffs -- esposas in spanish -- upward, if we're flinging them,
    // first we make them, and this sets them on their upward trajectory
    // if (flingEsposas) {
    //     makeEsposas(migra.position.x + 16, migra.position.y - 32, 32, 32);
    // }
    // /*
    // sketch to move player character
    // if (moveState === 'left') {
    //     migra.changeAnimation('move');
    //     migra.animation.play();
    //     migra.position.x = migra.position.x - 32;
    //     if (migra.position.x - 32 < 0) {
    //         migra.position.x += 32; // create bounds on movement
    //     }
    //     moveState = 'idle'
    //     migra.animation.stop();
    // } else if (moveState === 'right') {
    //     migra.changeAnimation('move');
    //     migra.animation.play();
    //     migra.position.x = migra.position.x + 32;
    //     if (migra.position.x + 32 > WIDTH) {
    //         migra.position.x -= 32;
    //     }
    //     moveState = 'idle'
    //     migra.animation.stop();
    // } else {
    //     moveState = 'idle';
    //     //migra.position.x = migra.position.x;
    // }
    //

    // if the time is after our readInputAfter timestamp, we'll process input from the controller
    if (currentTime > readInputAfter) {
        // scan the game pads to see which ones are active
        scanGamePads();
        // grab controller 0, since that's all we'll have
        let pad0 = controllers[0];
        // test that pad0 is not null or undefined (i.e., it exists)
        if (pad0) {
            // just log it so we know
            //console.log('pad0 is active');
            // now update the game with the status of the game pad
            updateStatus(pad0); // will need an updateStatus() function
        } else { // what to do if pad0 is null, which is to say there is no gamepad connected
            // use keyboard
            // or use touches
            //console.log("did not find gamepad (probably need to click it so it wakes up)")
        }
    }

    // now tell p5.play to draw all the sprites it knows about
    drawSprites();

    // we have to render text after drawing sprites
    if (gameState === 'startup') {
        //strokeWeight(5);
        fill(128 + sin(frameCount * 0.1) * 128, 128 + cos(frameCount * 0.1) * 128, 128 + sin(frameCount * 0.1) * 128);
        textSize(14);
        text('Press START to play', 140, 512);
    }
    if (gameState === 'win') {
        fill(128 + sin(frameCount * 0.1) * 128, 128 + cos(frameCount * 0.1) * 128, 128 + sin(frameCount * 0.1) * 128);
        textSize(14);
        text('Press START to play again', 120, 500);
        text('Or press SELECT to choose', 120, 520);
    }
    if (gameState === 'lose') {
        fill(128 + sin(frameCount * 0.1) * 128, 128 + cos(frameCount * 0.1) * 128, 128 + sin(frameCount * 0.1) * 128);
        textSize(14);
        text('Press START to try again', 120, 500);
        text('Or press SELECT to choose', 120, 520);
    }
} // end of draw()


/**
 * This function is purely for the side effect of changing
 * the game state to the win/lose state depending on how
 * many people we've caught or lost
 */
function checkWinLose() {
    if (catchCount >= WINNING_CATCH_COUNT)
        gameState = 'win';
    else if (escapeCount >= LOSING_ESCAPE_COUNT)
        gameState = 'lose';
}

/**
 * Creates the esposas by creating a sprite and setting up its movement
 * @param {X position of the sprite} x
 * @param {Y position of the sprite} y
 * @returns the sprite that was created
 */
function makeEsposas(x, y) {
    let newSprite = createSprite(migra.position.x + 16, migra.position.y - 32, 32, 32); // create a new sprite above the migra sprite
    newSprite.spriteId = spriteId++;
    newSprite.setDefaultCollider(); // create collision box for new sprite
    newSprite.addAnimation('lanzar', 'img-lamigra/esposas_0.png', // add images for animating the cuffs
        'img-lamigra/esposas_1.png',
        'img-lamigra/esposas_2.png',
        'img-lamigra/esposas_3.png');
    newSprite.changeAnimation('lanzar');
    cuffs.add(newSprite); // add new sprite to Play.P5.js group cuffs
    flingEsposas = false;
    renderQueue.push(newSprite); // add newSprite to renderQueue
    newSprite.name = 'cuffs[' + cuffs.length + ']'; // give the sprite a name that accords with the group identity
    newSprite.movementDir = 'up';
    newSprite.speed = 32;
    newSprite.isEsposa = true;
    newSprite.debug = DRAW_COLLIDER;
    return newSprite;
}

/*******************************************************
 *
 *  keyboard player/user input
 *
 */

/**
 *  keyReleased affords selecting and changing games by invoking URLs
 *  depends on global var url0 and url1 which are targets
 */
function keyReleased() {
    if ((key === 'g') || (key === 'G')) { // g on most keyboards using here as a select or highlight
        window.open(url, "_self");
    }
    if ((key === 'h') || (key === 'H')) { // h on most keyboards using here as start the selected choice
        if (gameState === 'startup')
            gameState = 'play'
        else
            window.open(url1, '_self')

    }
} // end keyReleased(). pad0 buttons[8] and buttons[9] will also use above


function keyTyped() { // tested once per frame, triggered on keystroke
    // grab the current time
    const currentTime = millis() / 1000;

    // don't get the keyboard input while we're waiting
    if (currentTime < readInputAfter)
        return;

    if (key === 'w' ||
        key === 'W' ||
        key === 'i' ||
        key === 'I') {
        print('upward key pressed');
        addInput(inputQueue, 'esposas');
        //flingEsposas = true;
        readInputAfter = currentTime + INPUT_DELAY;

    } else if (key === 's' ||
        key === 'S' ||
        key === 'k' ||
        key === 'K') {
        print('downward key pressed');

    } else if (key === 'a' ||
        key === 'A' ||
        key === 'j' ||
        key === 'J') {
        print('leftward key pressed');
        addInput(inputQueue, 'left');
        readInputAfter = currentTime + INPUT_DELAY;
        //moveState = 'left';

    } else if (key === 'd' ||
        key === 'D' ||
        key === 'l' ||
        key === 'L') {
        print('rightward key pressed');
        addInput(inputQueue, 'right');
        readInputAfter = currentTime + INPUT_DELAY;
        //moveState = 'right';

    } else {
        moveState = 'idle'; // create an idle state for player character
    }
    return false;

} // end keyTyped

let aButtonReleased = true;


// standard controller names
const nintendoId = /Vendor\: 0810 Product\: e501/;
const suilyId = /Vender\: 0079 Product\: 0011/;
const buffaloID = /Vendor\: 0583 Product\: 2060/;
const exleneID = /Vendor\: 0079 Product\: 0011/;
const innextID = /Vendor\: 0079 Product\: 0011/;

/**
 * Reads the current status of the game pad and processes input
 * @param {The gamepad that's being read} pad
 */
function updateStatus(pad) {
    // get the current time
    const currentTime = millis() / 1000;

    if (isButtonPressed(pad.index, BUTTON_DPAD_LEFT)) {	// check that we're in play state
        if (gameState === 'play') {
            readInputAfter = currentTime + INPUT_DELAY;
            addInput(inputQueue, 'left');
        }
    }
    if (isButtonPressed(pad.index, BUTTON_DPAD_RIGHT)) {  // check that we're in play state
        if (gameState === 'play') {
            readInputAfter = currentTime + INPUT_DELAY;
            addInput(inputQueue, 'right');
        }
    }
    // accept any of the gamepad buttons
    if (aButtonReleased && 
        (isButtonPressed(pad.index, BUTTON_A) ||
         isButtonPressed(pad.index, BUTTON_B) ||
         isButtonPressed(pad.index, BUTTON_X) ||
         isButtonPressed(pad.index, BUTTON_Y))) {
        // print('NES A button pressed');
        if (gameState === 'play') {
            readInputAfter = currentTime + INPUT_DELAY;
            addInput(inputQueue, 'esposas');
            // record that we've pressed it so that it must be released to press again
            aButtonReleased = false;
        }
    } // NES A button
    // does not have buttons 2-7 inclusive
    if (isButtonReleased(pad.index, BUTTON_SELECT)) {
        print('NES Select pressed and released');
        window.open(url, "_self");
    }

    if (isButtonReleased(pad.index, BUTTON_START)) {
        print('NES Start pressed and released');
        // now behave differently depending on where we are
        if (gameState === 'startup') {
            gameState = 'play';
        } else {
            window.open(url1, "_self");
        }
    }

    if (isButtonReleased(0, 1)) {
        console.log('NES A button released');
        aButtonReleased = true;
    }
}


// Code to deal with game pads
let lastControllers = []
let controllers = []

// standard button names
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
    let val = controllers[ctrlId].buttons[buttonId].value;
    let pressed = controllers[ctrlId].buttons[buttonId].pressed;
  
    return (val > 0 || pressed == true);
  }


/**
 * checks two things: controllers and lastControllers, if the button was
 * pressed in lastControllers, but not in controllers, we have a "release" event
 * in essence, which we can check here--note this happens only once per press
 * @param {Index of the controller} ctrlId
 * @param {Index of the button} buttonId
 */
function isButtonReleased(ctrlId, buttonId) {
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
    for (var i = 0; i < pad.buttons.length; i++) {
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
    for (var i = 0; i < controllers.length; i++) {
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
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
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
