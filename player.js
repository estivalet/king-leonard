function Player(image, width, height) {
	this.image = image;
	this.width = width;//100;//120;
	this.height	= height;//100;//120;
	this.setting_jump_height 		= 22.0;
	this.setting_jump_xdistance 	= 6.0;
	this.setting_gravity 				= 1.1;
	this.setting_walking_speed  	= 4;
	this.setting_falling_horizontal = 5;
	this.setting_walkcycle_interval = 3;
	this.setting_initial_life_count    = 3;
	this.setting_hp_per_life 		   = 12;
	this.setting_fallinjury 		   = 4;
	this.setting_maxlife 				= 10;


	this.init = function(x, y) {
		this.x = x;
		this.y = y;
		this.restartx = x;
		this.restarty = y;
		this.death = 0;
		this.framex = 0;
		this.framey = 0;
		this.falling = false;
		this.crouching = false;
		this.upwardspeed = 0 ;
		this.in_pain = 0;
		this.direction = 0;
		this.tick = 0;
		this.tick2 = 0;
		this.coinpower = 1;
		this.coincount = 1;

		this.firing = 0;
		this.inventory = [];
		this.hp 		= this.setting_hp_per_life;
		this.life 	= this.setting_initial_life_count;	

        this.teleporting = 0;
	}

	this.fall = function() {
		// Prev frame falling state
		this.prev_frame_falling = this.falling;
		this.prev_frame_upwardspeed = this.upwardspeed;

		// Falling
		if ( this.falling > 0 ) {
			
			// Falling down
			if ( this.upwardspeed > 0.0 ) {

				var excess = this.player_collide_with_wall(3 , this.upwardspeed ) ;
				if ( excess > 0 ) {
//debugger;
					this.y += this.upwardspeed - excess;
					this.upwardspeed = 0;
					this.falling = 0;

					sounds.playerWalk.play();
/*
					if ( this.player.terminalvelocity_length > 5 ) {
						this.player.in_pain = 50;
						this.player_get_hurt( this.setting_fallinjury );

						this.sndSadDog.play();
						this.sndBreakBone.play();

					}*/
				
				} else {

					this.upwardspeed += this.setting_gravity;

					// Terminal velocity
					if ( this.upwardspeed > TILE_SIZE - 1.0 ) {
						this.upwardspeed = TILE_SIZE - 1.0 ;

						this.terminalvelocity_length += 1;

					}
					this.y +=    this.upwardspeed  ;

				}

				this.framex = this.direction == 0 ? 3 : 0 ; 

			// Going up
			} else if ( this.upwardspeed < 0.0 ) {
				
				var excess = this.player_collide_with_wall( 1 , this.upwardspeed );
				if ( excess > 0 ) {
						
					this.upwardspeed = this.setting_gravity;
					this.y +=    this.upwardspeed - excess ;

				} else {
					this.upwardspeed += this.setting_gravity;
					this.y +=    this.upwardspeed  ;

					if ( this.tick > 4  ) {
							
						if ( this.direction == 0 && this.framex < 3 ) {		
							this.framex += 1;
						
						} else if ( this.direction == 1 && this.framex > 0 ) {
							this.framex -= 1;

						}	

						this.tick = 0;
					}
 				}

 				
			}
			
			this.framey = 4 + this.direction;
			
		} else {

			// Dropping 
			this.terminalvelocity_length = 0;

			var excess 	= this.player_collide_with_wall( 3 , 3.2);//0.8 ) ;
			var excess2 = this.player_collide_with_wall( 3 , 3.2 ) ; 

			if ( excess == 0 && excess2 == 0 ) {
				this.falling = 2 ;
				this.upwardspeed = 0.8;

			} else if ( excess2 > 0 && excess == 0 ) {
				this.y += 2.4;
				
			} else if ( excess > 0.81 ) {
				this.y -= excess >> 0;
			}	
		}


	}


	this.jump = function() {
		if (up) {
			if (this.falling == 0 && this.crouching == false && this.in_pain == 0 ) {
				sounds.jump.play();
				this.upwardspeed = -1.0 * this.setting_jump_height ;
				this.falling 	= 1;
				if ( this.direction == 0 ) {
					this.framex = 0;
				} else {
					this.framex = 3;
				}
			}	
		}
	}

	this.crouch = function() {
		if (down) {
			if ( this.falling == 0 ) {			
				this.crouching = true;
				this.framex = this.direction + 4;
				this.framey = 2;	
			}

		} else {
			this.crouching = false ;
		}
	}	

	this.walkLeft = function() {
		if (left) {
			if ( this.crouching == false && this.in_pain == 0 ) {
				var excess = this.player_collide_with_wall( 0 , this.falling > 0 ? - this.setting_falling_horizontal : - this.setting_walking_speed ) ;

				if ( excess > 0 ) {
					//this.player.x -= excess ;

				} else {

					if ( this.falling > 0 ) {

						if ( this.falling == 1 ) {
							this.x -= this.setting_jump_xdistance;
						} else {
							this.x -=  this.setting_falling_horizontal;
						}

					} else {
						this.x -=  this.setting_walking_speed;
						this.framey = 0;
						if ( this.tick >  this.setting_walkcycle_interval ) {
							this.framex = (this.framex + 1 ) % 6 ;
//							this.framex = (this.framex + 1 ) % 8 ;
							this.tick = 0;
						}
					}
					this.walking   = true;
				} 	

				this.direction = 0;
				if ( this.falling == 0 && ( this.framex == 0 || this.framex == 4 ) ) {
					sounds.playerWalk.play();
				}

			}			


		}
	}

	this.walkRight = function() {

		if (right) {
			if ( this.crouching == false && this.in_pain == 0 ) {
				var excess = this.player_collide_with_wall( 2 , this.falling > 0 ? this.setting_falling_horizontal : this.setting_walking_speed ) ;

				if ( excess > 0 ) {
					//this.player.x -= excess ;

				} else {

					if ( this.falling > 0 ) {
						
						if ( this.falling == 1 ) {
							this.x += this.setting_jump_xdistance;
						} else {
							this.x += this.setting_falling_horizontal;
						}

					} else {
						this.x += this.setting_walking_speed;
						this.framey = 1;

						if ( this.tick > this.setting_walkcycle_interval ) {
							this.framex  = (this.framex + 5 ) % 6 ;
//							this.framex  = (this.framex + 7 ) % 8 ;
							this.tick = 0;
						}
					}
					this.walking   = true;
				}	
				this.direction = 1;

				if ( this.falling == 0 && ( this.framex == 7 || this.framex == 3 ) ) {
					sounds.playerWalk.play();
				}
			}			
		}
	}

	this.walk = function() {
		this.walking   = false;
		this.walkLeft();
		this.walkRight();
	}

	this.player_collide_with_wall = function( direction , delta) {
		return level.object_collide_with_wall( this , direction , delta );
	}

	this.player_collide_with_trigger = function( ) {
		if (level.triggers) {
			for (var i=level.triggers.length - 1 ; i >= 0 ; i-- ) {
				var object = level.triggers[i];
				if ( this.x >= object.x && this.x <= object.x + object.width && 
					 this.y >= object.y && this.y <= object.y + object.height ) {

					if ( object.name == "trigger" ) {
						console.log('trigger!');
						//debugger;
						for ( var j = 0 ; j < level.spawners.length ; j++ ) {
							if ( parseInt( level.getObjCustomPropertyValue(level.spawners[j],'triggerid' )) == parseInt( level.getObjCustomPropertyValue(object,'id') )) {
								level.setObjCustomPropertyValue(level.spawners[j],'triggerid', 0);
							}
						}
					
					} else if ( object.name == "restart" ) {

						this.restart_x = object.x ;
						this.restart_y = object.y ;

					}
						

					// Done with trigger. delete it.
					level.triggers.splice( i , 1 );
				}	
			}	

		}
	}

	this.player_collide_with_monster = function() {
		for ( var i = 0 ; i < level.monsters.length ; i++ ) {
			var monster = level.monsters[i];
			if(monster) {
				this.monster_collide_with_player(monster);
			}
		}
	}

	this.monster_collide_with_player = function( monster ) {
		var diffx = this.x + 20 - monster.x ;
		var diffy = this.y + ( this.crouching ? 30 : 0) - monster.y  ;

		if ( diffx * diffx + diffy * diffy < 55 * 55 ) {
			return 1;
		}
		return 0;
	}

  

	this.idle = function() {
		if ( this.falling == 0 && this.walking == false && this.crouching == false && this.in_pain == 0 )  {
			this.framex = this.framex % 4;
			this.framey = 2  + this.direction ;
	
			if ( this.tick > 12 ) {
				if ( this.direction == 0 ) {
					this.framex  = (this.framex + 1 ) % 4 ;
				} else {
					this.framex  = ( this.framex + 3 ) % 4;
				}
				this.tick = 0;
			}
		}
	}

	this.player_pickup_objects = function() {
		// Player pickup
		if ( level.pickables ) {

			for ( var i = level.pickables.length - 1 ; i >= 0 ; i-- ) {
				
				object = level.pickables[i];
				var diffx = ( object.x + TILE_SIZE / 2 ) - ( this.x + this.width / 2 );
				var diffy = ( object.y + TILE_SIZE / 2 ) - ( this.y + this.height / 2 ) ;
				var hascustomsound = 0;

				if ( diffx * diffx + diffy * diffy < TILE_SIZE * TILE_SIZE ) {

					if ( object.name == "key" ) {
						this.inventory.push( object );
					
					} else if ( object.name == "coinup" ) {

						if ( this.coincount < 5 ) {
							this.coincount += 1 ;
						}
					
					} else if ( object.name == "powerup" ) {

						if ( this.coinpower < 10 ) {
							this.coinpower += 1;
						}

					} else if ( object.name == "lifeup" ) {

						if ( this.life < this.setting_maxlife ) {
							this.life += 1;
							//this.sndLifeup.play();
						}
						hascustomsound = 1;
						

					} else if ( object.name == "hpup" ) {

						if ( this.hp < this.setting_hp_per_life ) {
							this.hp += 6;
							if ( this.hp > this.setting_hp_per_life ) {
								this.hp = this.setting_hp_per_life;
							}
						}
						//this.sndHeal.play();
						hascustomsound = 1;

					
					} else if ( object.name == "hint" ) {
						message.setMessage(object.properties.hint);
					} 


					level.pickables.splice( i , 1 );

					if ( hascustomsound == 0 ) {
						//this.sndPickup.play();
					}
					particleManager.fireparticle( object.x + 10 , object.y + 10 , 1 , 1 , 1 , 7 ,  1 );
					
				}
			}
		}
	}    

	this.doUnarySwitchAction = function(object, bg_objects_arr, fg_objects_arr) {
		var objstate = parseInt( object.properties.state ) || 0 
		if ( objstate == 0 ) {
			sounds.switch2.play();
			object.properties.state = objstate + 1;
		}

		if ( object.type == "movingplatformswitch" ) {

			for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
				
				var object_j = fg_objects_arr[j];
				if ( object_j.name == "movingplatform" && object_j.properties.id == object.properties.movingplatformid ) {
					object_j.properties[ object.properties.controlproperty ] = parseInt(object.properties.value) ;
				}
				 
			}	
		} else if ( object.type == "puzzleswitch") {

			var switchval = parseInt( object.properties.value );
					

			for ( j = 0 ; j < bg_objects_arr.length ; j++ ) {
				var object_j = bg_objects_arr[j];

				if ( object_j.name == "puzzle" && object_j.properties.id == object.properties.puzzleid ) {

					var moved = 0;
					if ( object_j.type == "slider" ) {
						var moved = level.movepuzzle( object_j , switchval );
						
					} else if ( object_j.type == "filler" ) {

						//var moved = this.fillpuzzle( object_j , switchval );
					
					} else if ( object_j.type == "rubik" ) {

						//var moved = this.rotatepuzzle( object_j , switchval );

					}



					if ( object_j.state.join(",") == object_j.properties.solution ) {

						if ( typeof object_j.solved == 'undefined' ) {
							//this.sndSurprise.play();
							object_j.solved = 1;
						}

						for ( k = 0 ; k < fg_objects_arr.length ; k++ ) {
							
							var object_k = fg_objects_arr[k];
							if ( object_k.name == "movingplatform" && object_k.properties.id == object_j.properties.movingplatformid ) {
								object_k.properties[ object_j.properties.controlproperty ] = 1 ;
							}
							 
						}	

					} else {
						if ( moved == 1 ) {
							//this.sndMovingwall.play();
						}
					}

				}
				 
			}	

		}			
	}

	this.doorAction = function(object, bg_objects_arr) {
		var door_state = parseInt( object.properties.state ) || 0;
		if ( door_state ) {
			var doorid = parseInt( object.properties.id );
			to_door = parseInt( object.properties.to_door );
			for ( j = 0 ; j < bg_objects_arr.length ; j++ ) {
				object_j = bg_objects_arr[j];
				if (parseInt( object_j.properties.id ) == to_door) {
					sounds.teleport.play();
					this.teleporting 	  = 20;
					this.teleport_target  = object_j;
					break;
				}
			}
		}

	}

	this.doDoorSwitchAction = function(object, bg_objects_arr) {
		for ( j = 0 ; j < bg_objects_arr.length ; j++ ) {
			var object_j = bg_objects_arr[j];
			if ( object_j.name == "door" && object_j.properties.id == object.properties.doorid ) {

				if ( clearlock_ifneeded( object_j ) == 0 ) {
					object_j.properties.state = object.properties.state;
					//object_j.properties.state == 1 ? this.sndOpendoor.play() : this.sndClosedoor.play();
				}
			}
			 
		}	
	}

	this.doCaveLeverAction = function(object, bg_objects_arr) {
		for ( j = 0 ; j < bg_objects_arr.length ; j++ ) {
			var object_j = bg_objects_arr[j];
			if ( object_j.name == "cave" && object_j.properties.id == object.properties.doorid ) {
				//if ( clearlock_ifneeded( object_j ) == 0 ) {

					var obj = level.getObjCustomProperty(object, 'state');
					var obj_j = level.getObjCustomProperty(object_j, 'state');
					obj_j.value = obj.value;


					//object_j.properties.state == 1 ? this.sndOpendoor.play() : this.sndClosedoor.play();
//								}
			}
			 
		}	
	}



	this.doTrapDoorSwitchAction = function(object, fg_objects_arr) {
		for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
			var object_j = fg_objects_arr[j];
			if ( object_j.name == "trapdoor" && object_j.properties.id == object.properties.trapdoorid ) {
				if ( clearlock_ifneeded( object_j ) == 0 ) {
					if ( parseInt( object.properties.closeonly ) == 1 ) {
						object_j.properties.state = 1;
					} else {
						object_j.properties.state = 1 - parseInt(object.properties.state );
						//object_j.properties.state == 0 ? this.sndOpenTrapdoor.play() : this.sndCloseTrapdoor.play();
					}
				}
			}
		}	
	}

	this.doZDoorSwitchAction = function(object, fg_objects_arr) {
		for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
			var object_j = fg_objects_arr[j];
			if ( object_j.name == "zdoor" && object_j.properties.id == object.properties.zdoorid ) {
				if (clearlock_ifneeded( object_j ) == 0 ) {
					object_j.properties.state = 1 - parseInt(object.properties.state );
				//	object_j.properties.state == 0 ? this.sndOpendoor.play() : this.sndClosedoor.play();
				}
			}
		}
	}

	this.doMovingPlatformSwitchAction = function(object, fg_objects_arr) {
		for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
			var object_j = fg_objects_arr[j];
			if ( object_j.name == "movingplatform" && object_j.properties.id == object.properties.movingplatformid ) {
				object_j.properties[ object.properties.controlproperty ] = parseInt( object.properties.state ) ? 1 : -1 ;
			}
		}	
	}

 
    this.animate_transition = function() {
		if ( this.teleporting > 0 && this.life >= 0 ) {
			this.teleporting -= 1;
			if ( this.teleporting == 10 && this.teleport_target ) {
				this.x = this.teleport_target.x ;
				this.y = this.teleport_target.y ;
				camera.x = this.x - canvas.width / 2;
				camera.y = this.y - canvas.height / 2;
				this.teleport_target = null;
			}
		}

	}
	
	clearlock_ifneeded = function( object_j ) {
		if ( parseInt( object_j.properties.keyid ) > 0 ) {
			for ( k = player.inventory.length - 1 ; k >= 0 ; k-- ) {
				var object_k = player.inventory[k];
				if ( parseInt( object_k.properties.id ) == parseInt( object_j.properties.keyid ) ) {
					object_j.properties.keyid = 0;
					player.inventory.splice(k, 1 );
					return 0;
				}
			}
			message.setMessage("The door is locked. You need the correct key to unlock it.");
			return -1;
		}
		return 0;	
	}



	this.update = function() {
		this.crouch();
		this.fall();
		this.jump();
		this.walk();
		this.idle();
        this.player_pickup_objects();
		this.player_collide_with_trigger();
		this.player_collide_with_monster();
        this.animate_transition();

		this.tick += 1;
		this.tick2 += 1;

	}

	this.renderPlayer = function(context) {
		context.drawImage( image, 
				this.width  * this.framex , 
				this.height * this.framey , 
				this.width , 
				this.height , 
		this.x - camera.x, 
		this.y - camera.y, 
		this.width , 
		this.height );
	}

	this.renderLife = function(context) {
		if ( this.life >= 0 ) {
			for ( var i = 0 ; i < this.life ; i++ ) {
				context.drawImage( images.dogewarrior_head, 0, 0, 40,	40,	10 + 40 * i , 10 ,40,	40 );	
			}

			var lifebarsize = this.hp * 68 / this.setting_hp_per_life  >> 0
			if ( lifebarsize < 1 ) {
				lifebarsize = 1 
			}
			
			context.drawImage( images.objecttiles, 320,0,	80,	40,	20,	50,	80,40 );
		    context.drawImage( images.objecttiles, 320,40, lifebarsize, 20, 26, 56, lifebarsize,20 );
		}
	}

	this.renderInventory = function(context) {
		for ( var i = 0 ; i < this.inventory.length ; i++ ){

			object = this.inventory[i];
			if ( object.name == "key" ) {

				context.drawImage( images.bgtiles, 
									4 * TILE_SIZE ,
									8 * TILE_SIZE,
									TILE_SIZE,
									TILE_SIZE,
						i * ( TILE_SIZE + 10 ) + 10,
						canvas.height - ( TILE_SIZE + 10 ),
						TILE_SIZE, 
						TILE_SIZE );


				var key_type = parseInt( object.type );
						context.drawImage( images.objecttiles, 
											(key_type + 1 ) * TILE_SIZE ,
											4 * TILE_SIZE,
											TILE_SIZE,
											TILE_SIZE,
								i * ( TILE_SIZE + 10 ) + 10 + 5,
								canvas.height - ( TILE_SIZE + 10 ) + 5,
								TILE_SIZE - 10, 
								TILE_SIZE - 10);	
					
			}
		}
	}

	this.renderTeleportingEffect = function(context) {
        if ( this.teleporting > 0 ) {
            context.beginPath()
            context.rect( 0 , 0, canvas.width, canvas.height );

            var alpha;
            if ( this.teleporting > 10 ) {
                alpha = ( 20 - this.teleporting ) / 10 ;
            } else {
                alpha = this.teleporting / 10 ;
            }

            context.fillStyle =  "rgba(0, 0, 0, " +  alpha + ")";
            context.fill();
            context.strokeStyle = 'black';
            context.stroke();
            context.closePath();
        }

	}

	this.render = function(context) {
		this.renderPlayer(context);
		this.renderLife(context);
		this.renderInventory(context);
		this.renderTeleportingEffect(context);
	}
}
