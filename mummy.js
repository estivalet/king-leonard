class Mummy extends Monster {

    constructor() {
        super();
        this.frameSet = config.assets.images.mummy.frames.left;
    }

    update() {
        super.update();

        if ( this.direction == 0 ) {
            this.x -= this.speed;
            if ( this.x < this.min_x * TILE_SIZE ) {
                this.direction = 2;
                this.frameSet = config.assets.images.mummy.frames.right;
            }
        
        } else if ( this.direction == 2 ) {
            this.x += this.speed;
            if ( this.x > this.max_x  * TILE_SIZE ) {
                this.direction = 0;
                this.frameSet = config.assets.images.mummy.frames.left;
                
            }
        }

        if ( this.tick > this.anim_interval ) {
            this.tick = 0;
            this.currentFrame  = ( this.currentFrame + 1 ) % 21;
        }
    }

    render(context, camera) {
        
        this.posX = this.frameSet[this.currentFrame] % this.cols * this.width;
        this.posY = Math.floor(this.frameSet[this.currentFrame] / this.cols) * this.height;        


        context.drawImage( this.image, 
                            this.posX ,
                            this.posY,
                            this.width,
                            this.height,
                            this.x - camera.x , 
                            this.y -20- camera.y, 
                            80, 
                            100 );	
    }
}