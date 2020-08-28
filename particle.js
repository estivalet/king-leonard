/**
 * 
 * @param {*} sprite 
 * @param {*} x 
 * @param {*} y 
 * @param {*} framex 
 * @param {*} framey 
 * @param {*} active 
 */
function Particle(sprite, x, y, framex, framey, active) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.framex = framex;
    this.framey = framey;
    this.active = active;

    this.set = function(x, y, framex, framey, active, size_x, size_y, tick, interval ) {
        this.x = x;
		this.y = y;
		this.framex = framex;
		this.framey = framey;
		this.active = active;
		this.size_x = size_x;
		this.size_y = size_y;
		this.tick = tick;
		this.interval = interval;        
    }

    this.render = function(context) {
        if (this.active > 0 ) {
            context.drawImage( this.sprite, 
                                    this.framex * ( this.size_x * TILE_SIZE ),
                                    this.framey * TILE_SIZE,
                                    this.size_x * TILE_SIZE,
                                    this.size_y * TILE_SIZE,
                                    this.x - camera.x - ( this.size_x * TILE_SIZE )/2, 
                                    this.y - camera.y - ( this.size_y * TILE_SIZE )/2, 
                                    this.size_x * TILE_SIZE,
                                    this.size_y * TILE_SIZE);	
        }
    }

    this.update = function() {
        if ( this.tick >= this.interval ) {
            if ( this.active > 0 ) {
                this.framex += this.size_x;
                this.active -= 1;
            }
            this.tick = 0;
        }
        this.tick += 1;
    }
}

/**
 * 
 * @param {*} setting_maxparticle 
 * @param {*} sprite 
 */
function ParticleManager(setting_maxparticle, sprite) {
	this.setting_maxparticle 			= setting_maxparticle;
	this.particles 					= [];
	this.particleindex 				= 0;

	this.init = function() {
		for ( var i = 0 ; i < this.setting_maxparticle ; i++ ) {
			this.particles[i] = new Particle(sprite, 0, 0, 0, 0, false);
		}
	}

	this.fireparticle = function( x , y , type , size_x , size_y , active , interval ) {
		var particle = this.particles[this.particleindex ];
		particle.set(x, y, 0, type, active, size_x, size_y, 0, interval);
		this.particleindex = ( this.particleindex + 1 )  % this.setting_maxparticle;
	}

	this.render = function(context) {
		for ( var i = 0; i < this.setting_maxparticle ; i++ ) {
            var particle = this.particles[i];
            particle.render(context);
		}
	}

	this.animate_particles = function() {
		for ( var i = 0; i < this.setting_maxparticle ; i++ ) {
            var particle = this.particles[i];
            particle.update();
		}
    }
    
    this.update = function() {
        this.animate_particles();
    }

}