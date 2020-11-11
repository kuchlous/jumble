ig.module(
	'shoot_game.entities.shoot_tile'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityShootTile = ig.Entity.extend({
	
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
            this.word = settings.word;
            
            // Add the animations
            this.addAnim('idle', 1, [settings.char_num] );
	},
	
        check: function( other ) {
                // this.vel.y = 0;
        },
        nsparks: 50,
        max_y_pos : 300,
        marked_for_killing : false,

        kill: function() {
          for (var i = 0; i < this.nsparks; i++) {
            ig.game.spawnEntity(FireGib, this.pos.x, this.pos.y);
          }
          this.word.incr_killed_position(!this.marked_for_killing && 
                                         (this.pos.y > this.max_y_pos));
          this.parent();
        },
        update: function() {
          this.parent();
          if ((this.pos.y > this.max_y_pos) && !this.marked_for_killing) {
            this.kill();
          }
        },
        mark_for_killing: function() {
          this.word.incr_start_position();
        }
});

});
