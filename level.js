function Level() {
	this.backgroundlayer_id 		= 0;
	this.middlegroundlayer_id 		= 1;
	this.foregroundlayer_id 		= 2;
	this.backgroundobjectlayer_id	= 3;
	this.foregroundobjectlayer_id 	= 4;
	this.pickableobjectlayer_id 	= 5;
	this.monsterobjectlayer_id 		= 6;
    this.triggerlayer_id 			= 7;
    this.frontlayer_id 			    = 8;
	
	this.setting_monster_width  		= 80;
	this.setting_monster_height 		= 80;
	this.setting_monster_anim_interval 	= 8;
	
	var _this = this;
	this.map = {};
	this.triggers  = [];
	this.spawners = [];
	this.monsters = [];
	this.backgroundobjects = [];
	this.foregroundobjects = [];
	this.pickables = [];

	this.reset = function() {
		
		this.triggers  = [];
		//debugger;
	    for ( var i = 0 ; i <  this.map.layers[this.triggerlayer_id]["objects"].length ; i++ ) {
			var obj =  clone( this.map.layers[this.triggerlayer_id]["objects"][i] );
		    this.triggers.push( obj );

			// first part of the OR is old tiled custom properties
            if ( obj.properties.isLevelStartPosition == 1 || this.getObjCustomPropertyValue(obj, 'isLevelStartPosition')) {
                player.init(obj.x, obj.y);
                //player.init(1470,2000);
            }
        }

		this.backgroundobjects = [];
		for ( var i = 0 ; i <  this.map.layers[this.backgroundobjectlayer_id]["objects"].length ; i++ ) {
			var obj = clone( this.map.layers[this.backgroundobjectlayer_id]["objects"][i] );
			this.backgroundobjects.push(obj);
			if ( obj.name == "drop" ) {
				//waterDrop.add(obj.x, obj.y);
			} else if ( obj.name == "lavadrop" ) {
				//lavaDrop.add(obj.x, obj.y);
			} else if ( obj.name == "waterfall2" ) {
				waterFall = new WaterFall(images.waterfall2);
				waterFall.init(obj.x, obj.y);
			}
        }
		
		this.foregroundobjects = [];
		for ( var i = 0 ; i <  this.map.layers[this.foregroundobjectlayer_id]["objects"].length ; i++ ) {
			this.foregroundobjects.push( clone( this.map.layers[this.foregroundobjectlayer_id]["objects"][i] ));
		}        
		
		this.spawners = [];
		for ( var i = 0 ; i <  this.map.layers[this.monsterobjectlayer_id]["objects"].length ; i++ ) {
			this.spawners.push( clone( this.map.layers[this.monsterobjectlayer_id]["objects"][i] ));
		}

		this.pickables = [];
		for ( var i = 0 ; i <  this.map.layers[this.pickableobjectlayer_id]["objects"].length ; i++ ) {
			this.pickables.push( clone( this.map.layers[this.pickableobjectlayer_id]["objects"][i] ));
		}
		
		auto_randomize_puzzles();
		//auto_calculate_monster_boundary();
	}

	this.getObjCustomPropertyValue = function(object, property) {
		let prop = Object.values(object.properties).find( ({ name }) => name === property);		
		if(prop) {
			return prop.value;
		}
		return object.property;
	}

	this.setObjCustomPropertyValue = function(object, property, value) {
		let prop = Object.values(object.properties).find( ({ name }) => name === property);
		if(prop) {
			prop.value = value;
		} else {
			object.properties[Object.keys(object.properties).length] = {
				"name": property,
				"type": "string",
				"value": value
			};
		}
	}

	drawLayer = function(context, layer, camera) {
		if ( _this.map.layers[layer] ) {
			var tilex_count = canvas.width / TILE_SIZE >> 0 ;
			var tiley_count = canvas.height / TILE_SIZE >> 0 ;
			var cam_tile_x = (camera.x / TILE_SIZE) >> 0;
			var cam_tile_y = (camera.y / TILE_SIZE) >> 0;
			const TILES_PER_ROW = images.bgtiles.width / TILE_SIZE;
	
	
				for ( var i = cam_tile_y - 1; i < cam_tile_y + tiley_count + 2 ; i++ ) {
					for ( var j = cam_tile_x - 1; j < cam_tile_x + tilex_count + 2 ; j++ ) {
						var data =0;
						if ( i >= 0 && j >= 0 && i < _this.map.layers[layer].height && j < _this.map.layers[layer].width   ) {
							//if(layer===2)
							//debugger;
							var data = _this.map.layers[layer].data[ i * _this.map.layers[layer].width + j ]-1;
							var tile_framex = ( data % TILES_PER_ROW );// - 1;
							var tile_framey = ( data / TILES_PER_ROW ) >> 0 ;

							//if(tile_framex<0) tile_framex=TILES_PER_ROW-1;

							//tile_framex = ( data % TILE_SIZE) -1;
							//tile_framey = Math.floor( data / TILE_SIZE);

							if ( tile_framex >= 0 && tile_framey >= 0 ) {

								context.drawImage( images.bgtiles , 
												TILE_SIZE * tile_framex,
												TILE_SIZE * tile_framey,
												TILE_SIZE,
												TILE_SIZE,
										(j * TILE_SIZE - camera.x ) >> 0, 
										(i * TILE_SIZE - camera.y ) >> 0,
										TILE_SIZE,
										TILE_SIZE 
											);
							}
					
						}	
					}
				}
		}
	}

	drawObject = function(context, name, x, y, width, height) {
		let object = config.assets.objects[name];
		context.drawImage(images[object.image], object.x, object.y, object.width, object.height, x, y, width, height); 
	}

	drawSwitch = function(context, object, camera) {
		var switch_state = parseInt( object.properties.state ) || 0;
		drawObject(context, object.name + switch_state, object.x - camera.x, object.y - camera.y, TILE_SIZE, TILE_SIZE);
	}

	drawDoor = function(context, object, camera) {
		var door_state = parseInt( object.properties.state ) || 0;
		drawObject(context, object.name + door_state, object.x - camera.x, object.y - camera.y, 2 * TILE_SIZE, 3 * TILE_SIZE);
	}
	
	drawLever = function(context, object, camera) {
		var obj = Object.values(object.properties).find( ({ name }) => name === 'state' );
		var leverState = parseInt( obj.value ) || 0;
		drawObject(context, object.name + leverState, object.x - camera.x, object.y - camera.y, 2*TILE_SIZE, TILE_SIZE);
	}

	drawCave = function(context, object, camera) {
		var obj = Object.values(object.properties).find( ({ name }) => name === 'state' );
		var caveState = parseInt( obj.value ) || 0;
		drawObject(context, object.name + caveState, object.x - camera.x, object.y - camera.y, 3 * TILE_SIZE, 3 * TILE_SIZE);
	}

	drawZDoor = function(context, object) {
		var zdoor_state = parseInt( object.properties.state );
		drawObject(context, object.name + zdoor_state, object.x - camera.x, object.y - camera.y, 2 * TILE_SIZE, 3 * TILE_SIZE);
	}

	drawUnarySwitch = function(context, object, camera) {
		var switch_state = parseInt( object.properties.state ) || 0;
		drawObject(context, object.name + switch_state, object.x - camera.x, object.y - camera.y, TILE_SIZE, TILE_SIZE);
	}

	drawTrapDoor = function(context, object) {
		var trapdoor_state = parseInt( object.properties.state );
		drawObject(context, object.name + trapdoor_state, object.x - camera.x, object.y - camera.y, 2 * TILE_SIZE, 1 * TILE_SIZE);
	}



	drawRubik = function(context, object, camera) {
		for ( k = 0 ; k < 8 ; k++ ) {
			off_x = [2,0,4,2 , 2, 0 , 4, 2][k];
			off_y = [0,2,2,4 , 2, 4,4 , 6][k];
			var pat = object.state[ k ];

			srcx = ( pat - 1 ) % 2;
			srcy = ( ( ( pat - 1 ) / 2 ) >> 0 ) + 11;

			context.drawImage( images.objecttiles, 
									srcx * TILE_SIZE,
									srcy * TILE_SIZE,
									TILE_SIZE,
									TILE_SIZE,
						object.x + (TILE_SIZE * off_x) - camera.x , 
						object.y + (TILE_SIZE * off_y) - camera.y, 
						TILE_SIZE, 
						TILE_SIZE);		
		}
		for ( k = 0 ; k < 10 ; k++ ) {
			off_x = [ 1, 2, 3,  0,1,3,4   ,1,2,3 ][k];
			off_y = [ 1, 1, 1,  3,3,3,3   ,5,5,5 ][k];
			srcx  = [ 7, 6, 8,  6,4,4,6   ,8,6,7 ][k];
			srcy  = 15;

			context.drawImage( images.bgtiles, 
							srcx * TILE_SIZE,
							srcy * TILE_SIZE,
							TILE_SIZE,
							TILE_SIZE,
				object.x + (TILE_SIZE * off_x) - camera.x , 
				object.y + (TILE_SIZE * off_y) - camera.y, 
				TILE_SIZE, 
				TILE_SIZE);		
		}

	}

	drawPuzzle = function(context, object, camera) {
		var objwidth 	= object.width 	/ TILE_SIZE;
		var objheight 	= object.height / TILE_SIZE;

		for ( k = 0 ; k < objheight ; k++ ) {
			for ( j = 0 ; j < objwidth ; j++ ) {

				var srcx,srcy;
				var pat = object.state[ k * objwidth + j  ];
				if ( pat == 0 ) {
					srcx = 2;
					srcy = 11;
				} else {
					srcx = ( pat - 1 ) % 2;
					srcy = ( ( ( pat - 1 ) / 2 ) >> 0 ) + 11;
				}

				context.drawImage( images.objecttiles, 
							srcx * TILE_SIZE,
							srcy * TILE_SIZE,
							TILE_SIZE,
							TILE_SIZE,
				object.x + (TILE_SIZE * j) - camera.x , 
				object.y + (TILE_SIZE * k)- camera.y, 
				TILE_SIZE, 
				TILE_SIZE);	

					
			}
		}
	}

	drawDeathTrap = function(context, object, camera) {
		var objwidth 	= object.width 	/ TILE_SIZE;
		var objheight 	= object.height / TILE_SIZE;
		
		if ( object.type == "spike" ) {
			for ( j = 0 ; j < objwidth ; j++ ) {
				var srcx,srcy;
				srcy = 10;
				srcx = (  (j + 2 ) % 4  ) + 3 ;

				context.drawImage( images.objecttiles, 
							srcx * TILE_SIZE,
							srcy * TILE_SIZE,
							TILE_SIZE,
							TILE_SIZE,
				object.x + (TILE_SIZE * j) - camera.x , 
				object.y + (TILE_SIZE * 0) - camera.y, 
				TILE_SIZE, 
				TILE_SIZE );	

			}
		}	
	}		

	drawFire = function(context, object, camera) {
		context.drawImage( images.fire, 
					object.framex * TILE_SIZE,
					0,
					TILE_SIZE,
					TILE_SIZE,
		object.x + TILE_SIZE  - camera.x , 
		object.y - TILE_SIZE  - camera.y, 
		TILE_SIZE, 
		TILE_SIZE );	
	}		
	drawFire2 = function(context, object, camera) {
		context.drawImage( images.fire2, 
					object.framex * 100,
					0,
					100,
					100,
		object.x  - camera.x , 
		object.y  -camera.y, 
		100, 
		100 );	
	}		
	drawFire3 = function(context, object, camera) {
		context.drawImage( images.fire3, 
					object.framex * 56,
					0,
					56,
					111,
		object.x  - camera.x , 
		object.y  -camera.y-55, 
		56, 
		111 );	
	}		
	drawWater = function(context, object, camera) {
		context.drawImage( images.water, 
					object.framex * 89,
					0,
					89,
					80,
		object.x + 89  - camera.x , 
		object.y - 80  - camera.y, 
		89, 
		80 );	
	}		
	drawWater2 = function(context, object, camera) {
		for(var i=0; i < 20; i++) {
			let frame = object.framex;
			context.drawImage( images.water2, 
								((frame + i) % 12) * 40,
								0,
								40,
								40,
								object.x + (i*80)  - camera.x , 
								object.y - camera.y, 
								80, 
								110 );	
		}
	}		

	drawWaterFall = function(context, object, camera) {
		context.drawImage( images.waterfall, 
					object.framex * 256,
					0,
					256,
					512,
		object.x + 256  - camera.x , 
		object.y   - camera.y, 
		256, 
		512 );	
	}		

	drawBackgroundObjects = function(context, camera) {
		if (_this.backgroundobjects ) {
			for ( var i = 0 ; i <  _this.backgroundobjects.length ; i++ ) {
				object =  _this.backgroundobjects[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( ( object.x >= camera.x - canvas.width/2  || object.x + object.width > camera.x  ) && 
					object.x <= camera.x + canvas.width  + canvas.width/2   && 
					object.y >= camera.y - canvas.height/2 && 
					object.y <= camera.y + canvas.height + canvas.height/2 ) {

					if ( object.name == "switch" ) {
						drawSwitch(context, object, camera);
					} else if ( object.name == "lever" ) {
						drawLever(context, object, camera);
					} else if ( object.name == "door" ) {
						drawDoor(context, object, camera);
					} else if ( object.name == "cave" ) {
						drawCave(context, object, camera);
					} else if ( object.name == "unaryswitch" ) {
						drawUnarySwitch(context, object, camera);
					} else if ( object.name == "puzzle" ) {
						if ( object.type == "rubik" ) {
							drawRubik(context, object, camera);
						} else {
							drawPuzzle(context, object, camera);
						}
					} else if ( object.name == "deathtrap" ) {
						drawDeathTrap(context, object, camera);
					}  else if ( object.name == "fire" ) {
						drawFire(context, object, camera);
					}  else if ( object.name == "fire2" ) {
						drawFire2(context, object, camera);
					}else if ( object.name == "fire3" ) {
						drawFire3(context, object, camera);
					} else if ( object.name == "water" ) {
						drawWater(context, object, camera);
					} else if ( object.name == "water2" ) {
						drawWater2(context, object, camera);
					}  else if ( object.name == "waterfall" ) {
						drawWaterFall(context, object, camera);
					}
				}	
			}
		}	
	}
	
	drawMovingPlatform = function(context, object) {

		var platform_tilewidth  = ( object.width / TILE_SIZE ) >> 0;
		var platform_tileheight = ( object.height / TILE_SIZE ) >> 0; 
		var state = parseInt( object.properties.state ); 
					
		for ( var j = 0 ; j < platform_tilewidth ; j++ ) { 
			
			for ( var k = 0 ; k < platform_tileheight ; k++ ) {	

				var srcx = 3;
				var srcy = 6;
				if ( platform_tilewidth > 1 ) {
					srcx = ( j == 0 ) ? 2 : ( j == platform_tilewidth - 1  )? 4 : 3;
				}

				if ( object.type == "inandout" ) {

					if ( state == 0 ) {
						srcy = 13;
					} else if ( state == 2 ) {
						srcy = 12;
					}

				} else {

					
					if ( platform_tileheight > 1 ) {
						srcy = ( k == 0 ) ? 6 : 7;
					}
				}		


				context.drawImage( images.objecttiles, 
								srcx * TILE_SIZE,
								srcy * TILE_SIZE ,
								TILE_SIZE,
								TILE_SIZE,
					( object.x + j * TILE_SIZE ) - camera.x , 
					( object.y + k * TILE_SIZE ) - camera.y , 
					TILE_SIZE, 
					TILE_SIZE );	

			}	
		}
	}

	drawFragileBlock = function(context, object) {

		var fragile_state = parseInt( object.properties.state );
		var fragile_tilewidth  = ( object.width  / TILE_SIZE ) >> 0;
		
		for ( var k = 0 ; k < fragile_tilewidth ; k++ ) {

			var srcx = 3;
			var srcy = 14 + fragile_state;		

			if ( k == 0 && fragile_tilewidth > 1 ) { 
				srcx = 2;
			}
			if ( k == fragile_tilewidth - 1 && fragile_tilewidth > 1 ) { 
				srcx = 4;
			}
			context.drawImage( images.objecttiles, 
					srcx  * TILE_SIZE ,
					srcy  * TILE_SIZE ,
					TILE_SIZE,
					TILE_SIZE,
			object.x + k * TILE_SIZE - camera.x , 
			object.y  - camera.y, 
			TILE_SIZE, 
			TILE_SIZE );	

		}
	}
    
    drawForegroundObjects = function(context, camera) {
		if ( _this.foregroundobjects ) {
			for ( var i = 0 ; i < _this.foregroundobjects.length ; i++ ) {
				object = _this.foregroundobjects[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( (object.x >= camera.x - canvas.width/2  || object.x + object.width > camera.x ) && 
					 object.x <= camera.x + canvas.width  + canvas.width/2   && 
					 object.y >= camera.y - canvas.height/2 && 
					 object.y <= camera.y + canvas.height + canvas.height/2 ) {

				
					if ( object.name == "movingplatform") {
						drawMovingPlatform(context, object);
					} else if ( object.name == "trapdoor" ) {
						drawTrapDoor(context, object);
					} else if ( object.name == "zdoor") {
						drawZDoor(context, object);
					} else if ( object.name == "fragile" ) {
						drawFragileBlock(context, object);
					}
				}	
			}
		}	        
	}
	
	drawPickables = function(context, camera) {
		if ( _this.pickables ) {
			for ( var i = 0 ; i < _this.pickables.length ; i++ ) {
				object = _this.pickables[i];
				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= camera.x - canvas.width/2  && object.x <= camera.x + canvas.width  + canvas.width/2   && 
					object.y >= camera.y - canvas.height/2 && object.y <= camera.y + canvas.height + canvas.height/2 ) {

					if ( object.name == "key" ) {
						var key_type = parseInt( object.type );
						drawObject(context, object.name + key_type, object.x - camera.x, object.y - camera.y, TILE_SIZE, TILE_SIZE);
					} else {
						drawObject(context, object.name, object.x - camera.x, object.y - camera.y, TILE_SIZE, TILE_SIZE);
					} 
				}	
			}
		}
	}

	drawMonsters = function(context, camera) {
		for ( var i = 0 ; i < _this.monsters.length ; i++ ) {
			var monster = _this.monsters[i];
			// Only draw visible object. The camera is always half screen left and top of player so
			if ( monster.x >= camera.x - canvas.width/2  && monster.x <= camera.x + canvas.width  + canvas.width/2   && 
				monster.y >= camera.y - canvas.height/2 && monster.y <= camera.y + canvas.height + canvas.height/2 ) {
				monster.render(context, camera);
			}	
		}

	}

	animate_backgroundobjects = function() {

		if ( _this.backgroundobjects ) {

			for ( var i = 0 ; i < _this.backgroundobjects.length ; i++ ) {
				
				object = _this.backgroundobjects[i];

				if ( object.name == "unaryswitch" ){

					var objstate = parseInt(object.properties.state);
					if ( objstate > 0 ) {
						
						object.tick = parseInt( object.tick ) || 0;
						object.tick += 1;

						if ( object.tick > 5 ) {
							object.properties.state = ( objstate + 1 ) % 3;
							object.tick = 0;
						}	
					}
				} else if(object.name == "fire") {
					object.tick = parseInt( object.tick ) || 0;
					object.framex = parseInt( object.framex ) || 0;
					object.tick += 1;
					if(object.tick > 4) {
						object.tick = 0;
						object.framex = (object.framex + 1) % 5;
					}
				} else if(object.name == "fire2") {
					object.tick = parseInt( object.tick ) || 0;
					object.framex = parseInt( object.framex ) || 0;
					object.tick += 1;
					if(object.tick > 5) {
						object.tick = 0;
						object.framex = (object.framex + 1) % 4;
					}
				} else if(object.name == "fire3") {
					object.tick = parseInt( object.tick ) || 0;
					object.framex = parseInt( object.framex ) || 0;
					object.tick += 1;
					if(object.tick > 5) {
						object.tick = 0;
						object.framex = (object.framex + 1) % 17;
					}
				} else if(object.name == "water") {
					object.tick = parseInt( object.tick ) || 0;
					object.framex = parseInt( object.framex ) || 0;
					object.tick += 1;
					if(object.tick > 10) {
						object.tick = 0;
						object.framex = (object.framex + 1) % 3;
					}
				} else if(object.name == "water2") {
						object.tick = parseInt( object.tick ) || 0;
						object.framex = parseInt( object.framex ) || 0;
						object.tick += 1;
						if(object.tick > 5) {
							object.tick = 0;
							object.framex = (object.framex + 1) % 12;
						}					
				} else if(object.name == "waterfall") {
					object.tick = parseInt( object.tick ) || 0;
					object.framex = parseInt( object.framex ) || 0;
					object.tick += 1;
					if(object.tick > 5) {
						object.tick = 0;
						object.framex = (object.framex + 1) % 7;
					}
				}
			}
		}
	}

	animate_foregroundobjects = function() {
		if (_this.foregroundobjects ) {

			for ( var i = 0 ; i < _this.foregroundobjects.length ; i++ ) {
				
				object = _this.foregroundobjects[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= camera.x - canvas.width/2  && object.x <= camera.x + canvas.width  + canvas.width/2   && 
					 object.y >= camera.y - canvas.height/2 && object.y <= camera.y + canvas.height + canvas.height/2 ) {

					if ( object.name == "movingplatform") {

						var blockismoving = 0;
						var min_x = parseInt( object.properties.min_x ) * TILE_SIZE;
						var min_y = parseInt( object.properties.min_y ) * TILE_SIZE;
						var max_x = parseInt( object.properties.max_x ) * TILE_SIZE;
						var max_y = parseInt( object.properties.max_y ) * TILE_SIZE;
						var dir_x = parseInt( object.properties.direction_x );
						var dir_y = parseInt( object.properties.direction_y );

						if ( object.type == "controllable" ) {

							if ( dir_x && object.x + dir_x > min_x && object.x + dir_x < max_x ) { 
								object.x += dir_x;
								blockismoving = 1;
							}

							if ( dir_y && object.y + dir_y > min_y && object.y + dir_y < max_y ) {
								object.y += dir_y;
								blockismoving = 1;
							}
						} else if ( object.type == "inandout" ) {


							if ( typeof object.tick == 'undefined' ) {
								object.tick = 0;
							}
							object.tick += 1;
							if ( object.tick > parseInt( object.properties.interval ) ) {
								object.properties.state = ( parseInt( object.properties.state ) + 1 ) % 3;
								object.tick = 0;
								
								if ( rand(15) == 0 ) {
									//this.sndMovingwall.play();
								} 

							}

						} else {

							if ( dir_x ) {
								if ( dir_x > 0 ) {
									object.x += parseInt( object.properties.speed );
									if ( object.x >= max_x ) {
										object.properties.direction_x = -1;
									}	
								} else if ( dir_x  < 0 ) {

									object.x -= parseInt( object.properties.speed );
									if ( object.x <= min_x ) {
										object.properties.direction_x = 1;
									}	
								}
								blockismoving = 1;
							}
							if ( dir_y ) {

								if ( dir_y > 0 ) {
									object.y += parseInt( object.properties.speed );
									if ( object.y >= max_y ) {
										object.properties.direction_y = -1;
									}	
								} else if ( dir_y  < 0 ) {

									object.y -= parseInt( object.properties.speed );
									if ( object.y <= min_y ) {
										object.properties.direction_y = 1;
									}	
								}
								blockismoving = 1;
							}

						}
							
						//if ( blockismoving == 1 && _this.sndMovingwall.paused ) {
							//this.sndMovingwall.play();
						//}
						
						
					}


				}	
			}
		}	
	}

	animate_monsters = function() {
		for ( var i = _this.monsters.length - 1 ; i >= 0 ; i-- ) {
			var monster = _this.monsters[i];

			if ( monster.x >= camera.x - canvas.width * 2  && monster.x <= camera.x + canvas.width  + canvas.width * 2   && 
				monster.y >= camera.y - canvas.height * 2 && monster.y <= camera.y + canvas.height + canvas.height * 2 ) {
					monster.update();
			}	
		}
	}


	this.object_collide_with_wall = function( main_object, direction , delta) {
		for ( var j = 0 ; j < 3 ; j++ ) {
			var pof_x = null;
			var pof_y = null;
			if ( direction == 3 ) {
				pof_x = main_object.x + j * 10 + ( main_object.width / 2 >> 0 ) - 10 ;
				pof_y = main_object.y + main_object.height + delta - 6 ;

			} else if ( direction == 1 ) {
				pof_x = main_object.x + j * 10 + ( main_object.width / 2 >> 0 ) - 10 ;
				pof_y = main_object.y + 24;
			} else if (direction == 0 ) {
				pof_x = main_object.x +     ( main_object.width  / 3 >> 0 ) + delta ;
				pof_y = main_object.y + j * ( main_object.height / 3 >> 0 ) + 25 ;
			} else if ( direction == 2 ) {
				pof_x = main_object.x +     ( main_object.width  * 2/ 3 >> 0 ) + delta ;
				pof_y = main_object.y + j * ( main_object.height  / 3 >> 0 ) + 25 ;
			}		


			if ( pof_x != null && pof_y != null  &&  this.map.layers ) {
				var pof_tile_y = pof_y / TILE_SIZE >> 0;
				var pof_tile_x = pof_x / TILE_SIZE >> 0;

				// Static foreground
				for ( var k = pof_tile_y - 2 ; k <  pof_tile_y + 2 ; k++ ) {
					for ( var l = pof_tile_x  - 2 ; l < pof_tile_x + 2 ; l++ ) {
						var data = this.map.layers[ this.foregroundlayer_id ].data[ k * this.map.layers[ this.foregroundlayer_id ].width + l ];

						if ( data > 0 ) {

							if ( pof_x >= l * TILE_SIZE  && pof_x <= (l + 1) * TILE_SIZE  && 
								pof_y >= k * TILE_SIZE  && pof_y <= (k + 1) * TILE_SIZE  ) {

								if ( direction == 3  ) {
									return pof_y - k * TILE_SIZE ;

								} else if ( direction == 1 ) {

									return ( k + 1 ) * TILE_SIZE - pof_y ;
								
								} else if ( direction == 0  || direction == 2) {

									return l;
								
								} 

							}
						}
					}
				}

				// Foreground objects
				var objects_arr = this.foregroundobjects;

				for ( var i = 0 ; i < objects_arr.length ; i++ ) {
					
					object = objects_arr[i];

					// Only draw visible object. The camera is always half screen left and top of player so
					if ( object.x >= camera.x - canvas.width/2  && object.x <= camera.x + canvas.width  + canvas.width/2   && 
							object.y >= camera.y - canvas.height/2 && object.y <= camera.y + canvas.height + canvas.height/2 ) {

						if  (  this.object_is_collidable(object) ) {

							if ( pof_x >= object.x  && pof_x <= object.x + object.width  && 
									pof_y >= object.y  && pof_y <= object.y + TILE_SIZE  ) {

								if ( direction == 3  ) {
									return pof_y - object.y ;

								} else if ( direction == 1 ) {

									return object.y + TILE_SIZE - pof_y ;
								
								} else if ( direction == 0  || direction == 2) {

									return object.x;
								} 

							}
						}


					}	
				}


			}
		}
		return 0;

		}		
	this.object_is_collidable = function( object ) {
		if   ( 	( object.name == "movingplatform" && object.type != "inandout" )  || 
							( object.name == "movingplatform" && object.type == "inandout" && parseInt( object.properties.state ) > 0 )  || 
							( object.name == "trapdoor" && parseInt( object.properties.state ) == 1 ) || 
						    ( object.name == "zdoor"    && parseInt( object.properties.state ) == 1 ) ||
						    ( object.name == "fragile" && parseInt(object.properties.state) < 4 )
						 ) {
			return true;	
		}
		return false;
	}

	auto_randomize_puzzles = function() {
		if ( _this.backgroundobjects ) {
			for ( var i = 0 ; i < _this.backgroundobjects.length ; i++ ) {

				var object = _this.backgroundobjects[i];
				if ( object.name == "puzzle" ) {

					object.state = object.properties.solution.split(",").map( Number) ;
					
					if ( object.properties.init == "random" ) {
						
						if ( object.type == "slider"  ) {
							//this.shuffle_array( object.state );
							_this.movepuzzle( object , 3 );
							for ( j = 0 ; j < 10 ; j++ ) {
								_this.movepuzzle( object , rand(4) );
							}
						}
							
					} else {
						object.state = object.properties.init.split(",").map( Number );
					}
					
				}
			}
		}
	}

	this.movepuzzle = function( object_j , direction ) {

		var indexof_0 = object_j.state.indexOf(0);
		var puzzlewidth = ( object_j.width / TILE_SIZE ) >> 0;
		var puzzleheight = ( object_j.height / TILE_SIZE ) >> 0;
		var moved = 0;

		if ( direction == 0 && indexof_0 % puzzlewidth > 0 ) {
		
			var tmp = object_j.state[ indexof_0 - 1 ];
			object_j.state[ indexof_0 - 1 ] = 0;
			object_j.state[ indexof_0 ] = tmp;
			moved = 1;

		
		} else if ( direction == 1 &&   (( indexof_0 / puzzlewidth ) >> 0 ) > 0  ) {

			var tmp = object_j.state[ indexof_0 - puzzlewidth ];
			object_j.state[ indexof_0 - puzzlewidth ] = 0;
			object_j.state[ indexof_0 ] = tmp;
			moved = 1;
				
		} else if ( direction == 2 && indexof_0 % puzzlewidth < puzzlewidth - 1 ) {

			var tmp = object_j.state[ indexof_0 + 1 ];
			object_j.state[ indexof_0 + 1 ] = 0;
			object_j.state[ indexof_0 ] = tmp;	
			moved = 1;
			
		} else if ( direction == 3 && (( indexof_0 / puzzlewidth ) >> 0 ) < puzzleheight - 1  ) {

			var tmp = object_j.state[ indexof_0 + puzzlewidth ];
			object_j.state[ indexof_0 + puzzlewidth ] = 0;
			object_j.state[ indexof_0 ] = tmp;
			moved = 1;
			
		}

		return moved;
	}


	spawn_monsters = function() {
		if ( _this.spawners ) {
			for ( var i = _this.spawners.length - 1  ; i >= 0 ; i-- ) {
				var object = _this.spawners[i];
				// if it is time to trigger the enemy
				if  ( !(parseInt( _this.getObjCustomPropertyValue(object,'triggerid') ) > 0 ) ) {
					if ( object.x >= camera.x - canvas.width/2  && object.x <= camera.x + canvas.width  + canvas.width/2   && 
					 	 object.y >= camera.y - canvas.height/2 && object.y <= camera.y + canvas.height + canvas.height/2 ) {
						//	debugger;
						var spawncount 		= parseInt( _this.getObjCustomPropertyValue(object, 'spawncount' )) ;
						var spawninterval 	= parseInt( _this.getObjCustomPropertyValue(object, 'spawninterval' )); 

						if ( typeof object.tick == "undefined" ) {
							object.tick = spawninterval;
						} else {
							object.tick += 1;
						}


						if ( object.tospawn_interval && object.tick >= object.tospawn_interval ) {

							const monstersMapping = { 'Mummy': Mummy}

							var monster = new monstersMapping[object.name]();
							monster.init(images.mummy, object.name
								, object.x
								, _this.getObjCustomPropertyValue(object,'min_x')
								, _this.getObjCustomPropertyValue(object,'max_x')
								, object.y
								, 175
								, 275
								, parseInt(_this.getObjCustomPropertyValue(object,'direction'))
								, parseInt(_this.getObjCustomPropertyValue(object,'hp')));


							/*
							if ( object.properties.speed ) {
								monster.speed = parseInt( object.properties.speed );
							} else {
								monster.speed = 1;
							}
							
							if ( object.properties.firepower ) {
								monster.firepower = parseInt( object.properties.firepower );
								monster.firetype  = object.properties.firetype  ? parseInt( object.properties.firetype ) : 0;
							} else {
								monster.firepower = 0;
							}*/

							//monster.framex = 0;
							//if ( monster.name == "Mummy" ) {
							//	console.log('SPAWN!!!');
								//debugger;
								//monster.framey = 0;
								//monster.min_x  = parseInt(_this.getObjCustomPropertyValue(object,'min_x'));
								//monster.max_x  = parseInt(_this.getObjCustomPropertyValue(object,'max_x'));
							//	monster.auto_calculate_monster_boundary();
							
							//}

							_this.monsters.push( monster );	
							
							if ( _this.getObjCustomPropertyValue(object,'spawncount') == 0 ) {
								//Delete spawner when spawn count reaches 0
								_this.spawners.splice( i , 1 );
							}	
							object.tospawn_interval = 0;
						}

						if ( spawncount > 0  && object.tick >= spawninterval ) {

							//this.sndCatpurr.play();
							object.tick = 0;
							particleManager.fireparticle( object.x + 40  , object.y + 40 , 2 , 2 , 2 , 6 , 4 );
							object.tospawn_interval = 12;
							_this.setObjCustomPropertyValue(object,'spawncount', spawncount - 1);


							
						}
					}
				}

			}
		}
	}

	this.render = function(context) {
		drawLayer(context, 0, camera);
		drawLayer(context, 1, camera);
		drawLayer(context, 2, camera);
        drawBackgroundObjects(context, camera);
        drawForegroundObjects(context, camera);
		drawPickables(context, camera);
		drawMonsters(context, camera);
	}

	this.renderFrontLayer = function(context) {
		drawLayer(context, this.frontlayer_id, camera);
	}

	this.update = function() {
		spawn_monsters();
		animate_backgroundobjects();
		animate_foregroundobjects();
		animate_monsters();
	}

}
