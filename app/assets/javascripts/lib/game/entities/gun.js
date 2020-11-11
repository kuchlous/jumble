ig.module(
	'game.entities.gun'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityGun = ig.Entity.extend({
	size: {x: 30, y: 30},
	animSheet: new ig.AnimationSheet( 'media/gun.png', 30, 30 ),
	
        flip: false,

        init: function( x, y, settings ) {
          this.parent( x, y, settings );

          if (settings.flip) {
            this.flip = true 
            this.addAnim( 'idle', 1, [0] );
          }
          else {
            this.addAnim( 'idle', 1, [1] );
          }
        },
        update: function() {
          if( ig.input.pressed('shoot') ) {
            var offset_x = this.flip ? this.size.x : -this.size.x;
            var offset_y = this.size.y/2;
            ig.game.spawnEntity( EntitySlimeGrenade, this.pos.x + offset_x, this.pos.y + offset_y, {flip: this.flip});
          }
        }
  });

// The grenades a gun can throw are NOT in a separate file, because
// we don't need to be able to place them in Weltmeister. They are just used
// here in the code.

// Only entities that should be usable in Weltmeister need to be in their own
// file.
EntitySlimeGrenade = ig.Entity.extend({
	size: {x: 25, y: 14},
	// offset: {x: 2, y: 2},
	maxVel: {x: 400, y: 200},
	
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.6, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A, // Check Against A - the tile group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	// animSheet: new ig.AnimationSheet( 'media/slime-grenade-large.png', 16, 16 ),
	animSheet: new ig.AnimationSheet( 'media/bullet_small_l_r.png', 25, 14),
        // soundStart: new ig.Sound('media/explosion.mp3'),
        // soundStart: new ig.Sound('media/machine gun.mp3'),
	
	bounceCounter: 0,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = (settings.flip ? this.maxVel.x : -this.maxVel.x);
                this.vel.y = 0;
		// this.addAnim( 'idle', 0.2, [0,1] );
                if (settings.flip) {
		  this.addAnim( 'idle', 0.2, [0] );
                }
                else {
		  this.addAnim( 'idle', 0.2, [1] );
                }

            //  this.soundStart.play();
	},
        update: function() {
                this.parent();
                this.vel.y = 0;
        },
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			// only bounce 3 times
			this.bounceCounter++;
			if( this.bounceCounter > 0 ) {
				this.kill();
			}
		}
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		if (!other.standing) {
                  other.receiveDamage( 10, this );
                }
		this.kill();
	}	
});


});

