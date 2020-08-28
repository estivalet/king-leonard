function LavaDrop(maxdrops, sprite) {
    this.sprite = sprite;
	this.maxdrops = maxdrops;
	this.drop_vy = 4;
    this.drops = [];
    this.dropindex = 0;

    this.init = function() {
		this.drops = [];
		this.dropindex = 0;

		for ( var i = 0 ; i < this.maxdrops ; i++ ) {
			this.drops[i] = {
				active: false,
				falling: false,
				splashing: false,
				width:40,
				height:40,
				x : 0,
				y : 0,
				vy: 0,
				fallTimer: 50,
				frame: 1,
				reactivateTimer: 100,	
			}
		}        
    }

	this.add = function(x, y) {
		var drop = this.drops[ this.dropindex];
		drop.init_x = x;
		drop.init_y = y;
		drop.x  		= x ;
		drop.y  		= y ;
		drop.vy 		= this.drop_vy;
		drop.active 	= true;
		drop.frame=0;
		this.dropindex = (this.dropindex  + 1) % this.maxdrops ;

	}	

	this.animate_drops = function() {
		for ( var i = 0 ; i < this.maxdrops ; i++ ) {
			var drop = this.drops[i];
			
			if(drop.frame==6) {
				drop.active=false;
				drop.splashing = false;
				drop.frame=1;
			}
			
			if ( drop.active  ) {
				if(drop.falling) {
					drop.y += drop.vy;
					if(level.object_collide_with_wall( drop , 3 ,0 )){
						drop.frame=6;
						drop.falling = false;
						drop.splashing = true;
					}
				} else if(!drop.splashing) {
					drop.fallTimer--;
					if(drop.fallTimer<0) {
						drop.falling = true;
						drop.frame = 4;
					} else if(drop.fallTimer>10 && drop.fallTimer<20) {
						drop.frame=3;
					} else if(drop.fallTimer>20 && drop.fallTimer<30) {
						drop.frame=2;
					} else if(drop.fallTimer>30 && drop.fallTimer<40) {
						drop.frame=1;
					}
				}
			}  else {
				drop.reactivateTimer--;
				if(drop.reactivateTimer < 0) {
					drop.reactivateTimer = 100;
					drop.active = true;
					drop.x = drop.init_x;
					drop.y = drop.init_y;
					drop.fallTimer = 50;
					drop.falling = false;
					drop.frame=1;
				}
			}
		}
	}

    this.render = function(context) {
        for ( var i = 0 ; i < this.maxdrops ; i++ ) {
            var drop = this.drops[i];
            if (drop.active) {
				//context.drawImage(this.sprite, 0, 0, 64, 64, drop.x - camera.x,  - camera.y + TILE_SIZE, 64, 64);
                context.drawImage(this.sprite, drop.frame * 64, 0, 64, 64, drop.x - camera.x, drop.y - camera.y, 64, 64);
            } 
        }        
    }

    this.update = function() {
        this.animate_drops();

    }
}