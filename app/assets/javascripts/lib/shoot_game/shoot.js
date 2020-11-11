Number.prototype.limit = function (min, max) {
      return Math.min(max, Math.max(min, this));
};

var end_spell_and_shoot = function()
{
  $(document).off('keydown');
  callback_shoot_words();
}

var end_help = function()
{
  $(document).off('keydown');
  ig.system.startRunLoop();
}

ig.module( 
	'shoot_game.main' 
)
.requires(
	'impact.game',
	'impact.font',

        'plugins.color-picker',
	
	'shoot_game.entities.shoot_tile',
	'shoot_game.entities.shoot_gun',
	'game.entities.particle',
	'shoot_game.levels.level-1'
)
.defines(function(){

ShootWordsGame = ig.Game.extend({
	
	gravity: 0.01, // Need this only to ensure that the blocks
                       // do not bounce back on colliding with other
                       // blocks.
	
	// Load a font
        font: new ig.Font('media/fonts/arial-28-rev.png'),
        inst_font: new ig.Font('media/fonts/andale-16-rev.png'),
        backdrop: new ig.Image('media/grid-blue.png'),
        clearColor: null,
	
        tile_size: {x: 30, y: 35},
        n_missed_words: 0,
        n_completed_words: 0,
        n_words_released: 0,
        n_words_on_screen: 0,
        missed_words: [],
        words_in_play: [],
        spawnWait: 10,
	
	init: function() {
          // Bind keys
          window.addEventListener('keydown', this.keydown.bind(this), false);
          ig.input.bind( ig.KEY.SPACE, 'help' );
          ig.input.bind( ig.KEY.ESC, 'end' );
          window.focus();
          ig.system.canvas.onclick = function () {
              window.focus();
          };
  
          this.loadLevel( LevelLevel1 );
          ig.game.spawnEntity( EntityShootGun, 170, 538, {flip: true} );

          this.words = all_words.map(function(xx) { return xx.toUpperCase() });
          this.spawnTimer = new ig.Timer();

          this.start_new_word(this.words[this.n_words_released]);
          this.n_words_released ++;
	},
        find_targetted_tile: function(letter) {
          for (var i=0; i<this.words_in_play.length; i++) {
            var word = this.words_in_play[i];
            if (word.killed) {
              continue;
            }
            if (letter == word.word[word.start_letter]) {
              return word.tiles[word.start_letter];
            }
          }
          return null;
        },
        keydown: function (event) {
          if (event.target.type == 'text' || event.ctrlKey || event.shiftKey || event.altKey || this.menu) {
              return true;
          }
          var c = event.which;
          if (!((c > 64 && c < 91) || (c > 96 && c < 123))) {
              return true;
          }
          event.stopPropagation();
          event.preventDefault();
          var letter = String.fromCharCode(c).toUpperCase();
          var targetted_tile = this.find_targetted_tile(letter);
          // If the letter matches one of the targetted letters, spawn a 
          // missile towards that letter
          if (targetted_tile) {
            targetted_tile.mark_for_killing();
            ig.game.spawnEntity( EntityRocket, 180, 500, {targetted_tile: targetted_tile} );
          }
        },
	update: function() {		
          // Update all entities and BackgroundMaps
          this.parent();
          // If timer expired, start new word
          if (this.spawnTimer.delta() > this.spawnWait) {
            this.start_new_word();
          }
	},
        start_new_word: function(word) {
          this.spawnTimer.reset();
          this.n_words_on_screen ++;
          word = this.words[this.n_words_released];
          this.n_words_released ++;
          var spawn_pos = Math.floor(Math.random() * (12 - word.length));
          new_word = new Object();
          this.words_in_play.push(new_word);
          new_word.game = this;
          new_word.word = word;
          new_word.start_letter = 0;
          new_word.killed_letter = 0;
          new_word.killed = false;
          new_word.tiles = new Array();
          for (var i=0; i<word.length; i++) {
            var char_num = word[i].charCodeAt(0) - 'A'.charCodeAt(0);
            var tile = ig.game.spawnEntity(EntityShootTile, 
                8 + spawn_pos * 30, 
                8, 
                {char_num: char_num,
                 vel: {x: 0, 
                       y: this.n_completed_words * 2 + 35 
                      },
                 word: new_word
                });
            new_word.tiles.push(tile);
            spawn_pos ++;
          }
          new_word.incr_start_position = function() {
            this.start_letter ++;
            if (this.start_letter == this.word.length) {
              this.killed = true;
            }
          }
          new_word.incr_killed_position = function(is_too_low) {
            this.killed_letter ++;
            while (this.start_letter < this.killed_letter) {
              this.incr_start_position();
            }
            if (this.killed_letter == this.word.length) {
              this.game.final_kill_word(this, is_too_low);
            }
          }
        },
        add_word_line: function(word, row) {
          var x_pos = 376 + 8;
          var y_pos = (ig.system.height - 8) - ((row + 1) * this.tile_size.y); 
          this.font.draw(word, x_pos, y_pos);
        },
        final_kill_word: function(word, is_miss) {
          this.n_words_on_screen --;
          if (is_miss) {
            this.add_missed_word(word);
          }
          else {
            this.n_completed_words ++;
          }
          if (this.n_words_on_screen == 0) {
            this.start_new_word();
          }
        },
        add_missed_word: function(word) {
          this.missed_words.push(word.word);
        },
	draw: function() {
          // Draw all entities and BackgroundMaps
          this.backdrop.draw(0,0);
          this.parent();
          
          if (ig.input.pressed('help')) {
            ig.system.clear("#00006b"); 
            this.inst_font.draw('AIM:', 30, 70);
            this.inst_font.draw('Shoot the falling words by typing the letters in sequence.', 30, 100);
            this.inst_font.draw('The game gets over when 5 words reach the bottom.', 30, 160);
            this.inst_font.draw('Controls:', 30, 220); 
            this.inst_font.draw('ESC - End the game', 30, 340);
            this.inst_font.draw('SPACE - This help message', 30, 340);
            this.inst_font.draw('Click any key to return to the game', 30, 500 );
            ig.system.stopRunLoop();
            $(document).keydown(end_help);
          }
          else if (this.missed_words.length > 4 || ig.input.pressed('end') ) {
            ig.system.stopRunLoop();
            ig.system.clear("#00006b"); 
            this.font.draw( 'GAME OVER', 30, 150 );
            this.inst_font.draw( 'SCORE: ' + this.n_completed_words, 30, 190 );
            this.inst_font.draw( 'Click any key to return to your session', 30, 230 );
            this.font.draw( 'Credits', 30, 450 );
            this.inst_font.draw( 'Bullets: Aadi', 30, 500 );
            this.inst_font.draw( 'Background: Shaifali', 30, 530 );
            this.spawnTimer.pause();

            $(document).keydown(end_spell_and_shoot);
          }
          else {
            this.inst_font.draw( 'Help: Press SPACE for help', 378, 2 );
            this.inst_font.draw( 'Controls:', 378, 30 );
            this.inst_font.draw( 'Letter Keys to shoot words', 378, 60 );
            this.inst_font.draw( 'ESC to end', 378, 90 );
            this.inst_font.draw( 'Words Completed: ' + this.n_completed_words, 378, 130 );
            this.inst_font.draw( 'Lives Left: ' + (5 - this.missed_words.length), 378, 150 );
            this.inst_font.draw( 'Words Missed: ' + this.missed_words.length, 378, 200 );
            for (var i = 0; i < this.missed_words.length; i++ ) {
              this.add_word_line(this.missed_words[i], i);
            }
          }
	}
});


// Start the Game with 60fps
// ig.main( '#canvas', MyGame, 60, 376 * 2 - 8, 576, 1 );

});
