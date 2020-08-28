function initKeypad() {
	var keypad;
	keypads.length = 0;

	// Left
	keypad = {
		framex:0,
		framey:0,
		x: 2,
		y:canvas.height - 1 *( TILE_SIZE * 2 ) - 2,
		keycode:37
	}
	keypads.push( keypad );


	// Right
	keypad = {
		framex:2,
		framey:0,
		x:canvas.width  - 1 *( TILE_SIZE * 2 ) - 2,
		y:canvas.height - 1 *( TILE_SIZE * 2 ) - 2,
		keycode:39
	}
	keypads.push( keypad );


	// Up
	keypad = {
		framex:1,
		framey:0,
		x: canvas.width /2  - TILE_SIZE  / 2,
		y: 0 *( TILE_SIZE * 2 ) - 2,
		keycode:38
	}
	keypads.push( keypad );

	// Down
	keypad = {
		framex:3,
		framey:0,
		x: canvas.width /2 - TILE_SIZE  /2,
		y:canvas.height - 1 *( TILE_SIZE * 2 ) - 2,
		keycode:40
	}
	keypads.push( keypad );


	// Up left
	keypad = {
		framex:4,
		framey:0,
		x: 2,
		y: 0 *( TILE_SIZE * 2 ) - 2,
		keycode:3738
	}
	keypads.push( keypad );

	// Up right
	keypad = {
		framex:5,
		framey:0,
		x:canvas.width  - 1 *( TILE_SIZE * 2 ) - 2,
		y: 0 *( TILE_SIZE * 2 ) - 2,
		keycode:3839
	}
	keypads.push( keypad );

	// Zleft
	keypad = {
		framex:0,
		framey:1,
		x: 2,
		y: canvas.height / 2 - TILE_SIZE / 2,
		keycode:90
	}
	keypads.push( keypad );

	// Zright
	keypad = {
		framex:0,
		framey:1,
		x:canvas.width  - 1 *( TILE_SIZE * 2 ) - 2,
		y: canvas.height / 2 - TILE_SIZE / 2,
		keycode:90
	}
	keypads.push( keypad );

}

function touchstart(evt) {
	for (var i = 0; i < evt.changedTouches.length ; i++) {
		var touch = evt.changedTouches[i];
	
		var touch_grid_x = ( touch.pageX /  canvas.width  * 5 ) >> 0;
		var touch_grid_y = ( touch.pageY /  canvas.height * 5 ) >> 0;
		var touch_region = touch_grid_y * 5 + touch_grid_x;

		if ( [16,20,21].indexOf(touch_region) > -1  ) {
			left=true;
			right=false;
		} else if ( [18,23,24].indexOf(touch_region) > -1 ) {
			right=true;
			left=false;
		} else if ( [0,1,5].indexOf(touch_region) > -1 ) {
			left=true;
			up=true;
			right=false;
		} else if ( [2,7].indexOf(touch_region) > -1 ) {
			up=true;
			down=false;
		} else if ( [3,4,9].indexOf(touch_region) > -1 ) {
			right=true;
			up=true;
			left=false;
		} else if ( [10,11 ].indexOf(touch_region) > -1 ) {
			shootAction=true;
		} else if ( [13,14 ].indexOf(touch_region) > -1 ) {
			shootAction=true;
		} else if ( [22,17].indexOf( touch_region ) > -1 ) {
			up=false;
			down=true;
		} else if ( [7,11,12,13].indexOf( touch_region ) > -1 ) {
			executeAction=true;
		}
	}
}

function touchend(evt) {
	shootAction=false;
	for (var i = 0; i < evt.changedTouches.length ; i++) {
		var touch = evt.changedTouches[i];
		var touch_grid_x = ( touch.pageX /  canvas.width  * 5 ) >> 0;
		var touch_grid_y = ( touch.pageY /  canvas.height * 5 ) >> 0;
		var touch_region = touch_grid_y * 5 + touch_grid_x;

		if ( [15,16,20,21].indexOf(touch_region) > -1  ) {
			left=false;
		} else if ( [18,19,23,24].indexOf(touch_region) > -1 ) {
			right=false;
		} else if ( [2,7].indexOf(touch_region) > -1 ) {
			up=false;
		} else if ( [0,1,5,6].indexOf(touch_region) > -1 ) {
			left=0;
			up=false;
		} else if ( [3,4,8,9].indexOf(touch_region) > -1 ) {
			right=false;
			up=false;
		} else if ( [22,17].indexOf( touch_region ) > -1 ) {
			down=false;
		}
	}
}	

function touchmove(evt) {
	evt.preventDefault();
	up=false;
}

function renderKeyPad() {
	for ( var i = 0 ; i < keypads.length ; i++ ) {
        object = keypads[i];	
        context.drawImage( images.keypad, 
                                object.framex * TILE_SIZE * 2,
                                object.framey * TILE_SIZE * 2,	
                                TILE_SIZE * 2,
                                TILE_SIZE * 2,
                        object.x ,
                        object.y ,
                        TILE_SIZE* 2, 
                        TILE_SIZE* 2);


    }	
}

