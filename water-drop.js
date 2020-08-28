function WaterDrop(maxdrops, sprite) {
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
				width:40,
				height:40,
				x : 0,
				y : 0,
				vy: 0,
				fallTimer: 50,
				frame: 0,
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
			
			if(drop.frame==3) {
				drop.active=false;
				drop.frame=0;
			}
			
			if ( drop.active  ) {
				if(drop.falling) {
					drop.y += drop.vy;
					//if ( this.drop_collide_with_wall( drop ) ) {
					if(level.object_collide_with_wall( drop , 3 ,0 )){
						drop.frame=3;
						drop.falling = false;
					}
				} else {
					drop.fallTimer--;
					if(drop.fallTimer<0) {
						drop.falling = true;
						drop.frame = 2;
					} else if(drop.fallTimer>10 && drop.fallTimer<20) {
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
					drop.frame=0;
				}
			}
		}
	}

    this.render = function(context) {
        for ( var i = 0 ; i < this.maxdrops ; i++ ) {
            var drop = this.drops[i];
            if (drop.active) {
                context.drawImage(this.sprite, drop.frame * 40, 0, 40, 40, drop.x - camera.x, drop.y - camera.y, 40, 40);
            } 
        }        
    }

    this.update = function() {
        this.animate_drops();

    }
}