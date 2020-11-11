ig.module(
	'game.entities.ptile'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTile = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 30, y:35},
	// offset: {x: 4, y: 2},
	
	maxVel: {x: 200, y: 1000},
	friction: {x: 100, y: 0},
        bounciness: 0,
	
	type: ig.Entity.TYPE.A, // Tile group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/tiles-a-z-blank.png', 30, 35 ),	
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Tile
	health: 10,
	flip: false,
        prevstate: 'none',
        char_num: 0,

	init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.vel.y = settings.vel.y;
            this.char_num = settings.char_num;
            
            // Add the animations
            this.addAnim('idle', 1, [settings.char_num] );
	},
	
	update: function() {
		
                if (this.standing) { return; }

		// move left or right
		if( ig.input.pressed('left') ) {
                  this.pos.x -= this.size.x;
		}
		else if( ig.input.pressed('right') ) {
                  this.pos.x += this.size.x;
		}
                else if (ig.input.pressed('down') ) {
                  this.vel.y += 100;
                }

                this.pos.x = this.pos.x.limit(8, 8 + (11 * 30));
		
	        this.currentAnim = this.anims.idle;

		// move!
		this.parent();
	},

        check: function( other ) {
                // this.vel.y = 0;
        },
        nsparks: 50,

        kill: function() {
          for (var i = 0; i < this.nsparks; i++) {
            ig.game.spawnEntity(FireGib, this.pos.x, this.pos.y);
          }
          this.parent();
        }
});

});
