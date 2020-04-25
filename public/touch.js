function touchStarted(){

	// touch controller
	// poorly documented P5JS overview says touchX and touchY are analagous to mouseX and mouseY
	// buried in a github page, not the friendly public facing p5js.org
	// test on openprocessing yields an error treating touchX and touchY as undefined variables
	// touch functionality seems to have broken on 2019 06 04 after adding cadaver and other assets
	/*
	d pad sprite is currently 96 x 96 pixels. 3 x 32 X 3 x 32
	sprite center will be 48 x 48
	controller origin top left corner (conX,conY)
	d pad button edges can be a multiple of the offsets offX and offY
	*/
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
	return false;
} // end touchStarted
