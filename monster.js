class Monster {

    constructor() {}
    
    init(image, name, x, min_x, max_x, y, width, height, direction, hp) {
        this.image = image;
        this.name = name;
        this.x = x;
        this.min_x = min_x;
        this.max_x = max_x
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.hp = hp;
        this.tick = 0;
        this.tick2 = rand(80);
        this.speed = 1;
        this.framex = 0;
        this.framey = 0;
        this.currentFrame = 0;
        this.setting_monster_anim_interval 	= 2;    
        if (this.min_x == "auto"  || this.max_x == "auto" ) {
            this.auto_calculate_monster_boundary();
        }

        // to locate frame in the sprite sheet.
        this.cols = parseInt((this.image.width / this.width));
        this.rows = parseInt((this.image.height / this.height));  
        this.posX = 0;
        this.posY = 0;        

    }

    auto_calculate_monster_boundary() {
        var spawner_tile_x = this.x / TILE_SIZE >> 0;	
        var spawner_tile_y = this.y / TILE_SIZE >> 0;
        
        //var min_x  	 = spawner_tile_x;
        //var max_x  	 = spawner_tile_x;

        // Scan left for min_x 
        if (this.min_x == "auto" ) {

            var scan_col = spawner_tile_x;
            while ( scan_col > 0 ) {
                
                var data0 	= level.map.layers[ level.foregroundlayer_id ].data[ (spawner_tile_y + 0) * level.map.layers[ level.foregroundlayer_id ].width + scan_col ];
                var data1 	= level.map.layers[ level.foregroundlayer_id ].data[ (spawner_tile_y + 1) * level.map.layers[ level.foregroundlayer_id ].width + scan_col ];
                var data2 	= level.map.layers[ level.foregroundlayer_id ].data[ (spawner_tile_y + 2) * level.map.layers[ level.foregroundlayer_id ].width + scan_col ];
                
                if ( data0 == 0  && data1 == 0 && data2 > 0 ) {
                    this.min_x = scan_col;
                } else {
                    break;
                }	
                scan_col -= 1;
            }
            //this.min_x = min_x;
        }

        if (this.max_x == "auto" ) {
            scan_col = spawner_tile_x + 1;
           
            while ( scan_col < 	level.map.layers[ level.foregroundlayer_id ].width ) {

                var data0 	= level.map.layers[ level.foregroundlayer_id ].data[ (spawner_tile_y + 0) * level.map.layers[ level.foregroundlayer_id ].width + scan_col ];
                var data1 	= level.map.layers[ level.foregroundlayer_id ].data[ (spawner_tile_y + 1) * level.map.layers[ level.foregroundlayer_id ].width + scan_col ];
                var data2 	= level.map.layers[ level.foregroundlayer_id ].data[ (spawner_tile_y + 2) * level.map.layers[ level.foregroundlayer_id ].width + scan_col ];
                
                if ( data0 == 0  && data1 == 0 && data2 > 0 ) {
                    this.max_x = scan_col;
                } else {
                    break	
                }
                scan_col += 1;
            }	
           // this.max_x =  max_x - 1;
        
        } 
    }

    update() {
        this.tick += 1;
        
        this.anim_interval = this.setting_monster_anim_interval - this.speed;
        if ( this.anim_interval < 1 ) {
            this.anim_interval = 1;
        }
        /*
        if ( this.name == "Mummy") {
            if ( this.direction == 0 ) {
                this.x -= this.speed;
                if ( this.x < this.min_x * TILE_SIZE ) {
                    this.direction = 2;
                }
            
            } else if ( this.direction == 2 ) {
                this.x += this.speed;
                if ( this.x > this.max_x  * TILE_SIZE ) {
                    this.direction = 0;
                    
                }
            }

            if ( this.tick > anim_interval ) {
                
                this.tick = 0;
                if ( this.direction == 0 ) {
                    this.framey = 0;
                    this.framex  = ( this.framex + 1 ) % 8;
                } else {
                    this.framey = 1;
                    this.framex = ( this.framex + 7 ) % 8;					
                }
            }

        }*/
    }
/*
    render(context, camera) {
        context.drawImage( images.monster, 
                            ( this.framex ) * ( 2 * TILE_SIZE ) ,
                            ( this.framey ) * ( 2 * TILE_SIZE ) ,
                            2 * TILE_SIZE,
                            2 * TILE_SIZE,
                            this.x - camera.x , 
                            this.y + 3 - camera.y, 
                            2 * TILE_SIZE, 
                            2 * TILE_SIZE );	
        
    }*/
}