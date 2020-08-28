function WaterFall(sprite) {
	this.sprite = sprite;
	this.parts = [];
	this.size = 10;
	this.vy = 4;
	this.maxy = 500;

    this.init = function(x, y) {
		this.init_y = y;
		this.x = x ;

		this.parts[0] = {
			active: true,
			y : y,
			frame: 3,
		}
    }

	this.animate = function() {
		for ( var i = 0 ; i < this.parts.length ; i++ ) {
			var part = this.parts[i];
			part.y += this.vy;
			if(part.y > this.maxy) {
				part.y = this.init_y;
			}
		}
	}

    this.render = function(context) {
		for ( var i = 0 ; i < this.parts.length ; i++ ) {
			var part = this.parts[i];
			context.drawImage(this.sprite, 0, part.frame*32, 128, 32, this.x - camera.x, part.y - camera.y, 128, 32);
		}
    }

    this.update = function() {
        this.animate();
    }
}