Number.prototype.limit = function (min, max) {
      return Math.min(max, Math.max(min, this));
};

STATE = {
  GAME: 0,
  GAME_OVER: 1
};

var end_spell_and_shoot = function()
{
  $(document).off('keydown');
  start_and_draw_new_spell_session();
}

var end_help = function()
{
  $(document).off('keydown');
  ig.system.startRunLoop();
}

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

        'plugins.color-picker',
	
	'game.entities.ptile',
	'game.entities.gun',
	'game.entities.particle',
	'game.levels.level-1'
)
.defines(function(){

SpellShootGame = ig.Game.extend({
	
	gravity: 0.01, // Need this only to ensure that the blocks
                       // do not bounce back on colliding with other
                       // blocks.
	
	// Load a font
        font: new ig.Font('media/fonts/arial-28-rev.png'),
        inst_font: new ig.Font('media/fonts/andale-16-rev.png'),
        backdrop: new ig.Image('media/grid-blue.png'),
        clearColor: null,
	
        last_tile: null,
        tile_size: {x: 30, y: 35},
        n_user_line: 0,
        n_completed_lines: 0,
        n_full_rows: 0,
        user_lines: [],
        user_tile_lines: [],
	
        get_row_num :function(tile) {
          var y_pos = tile.pos.y;
          var row_num = Math.round((ig.system.height - 8 - y_pos) / tile.size.y - 1);
          return row_num;
        },
        get_col_num :function(tile) {
          var x_pos = tile.pos.x;
          var col_num = Math.round((x_pos - 8) / tile.size.x);
          return col_num;
        },
        get_char_for_tile :function() {
          var first_row_word = this.words[this.n_full_rows];
          var first_row_letters = new Object();
          for (var j = 0; j < first_row_word.length; j++) {
            first_row_letters[first_row_word[j]] = true;
          }
          var first_row_letters_array = [];
          for (var letter in first_row_letters) {
            first_row_letters_array.push(letter);
          }
          var first_row_letter = first_row_letters_array[Math.floor(Math.random() * first_row_letters_array.length)];

          var other_rows_words = this.words.slice(this.n_full_rows + 1, this.n_user_line + 2);
          var other_rows_letters = new Object();
          for (var i = 0; i < other_rows_words.length; i++) {
            var other_rows_word = other_rows_words[i];
            for (var j = 0; j < other_rows_word.length; j++) {
              other_rows_letters[other_rows_word[j]] = true;
            }
          }
          var other_rows_letters_array = [];
          for (var letter in other_rows_letters) {
            other_rows_letters_array.push(letter);
          }
          var other_row_letter = other_rows_letters_array[Math.floor(Math.random() * other_rows_letters_array.length)];
          other_row_letter = other_row_letter ? other_row_letter : first_row_letter;

          return (Math.random() < 0.8 ? first_row_letter : other_row_letter);
        },
        new_tile: function() {
          var char_num = this.get_char_for_tile();
          char_num = char_num.charCodeAt(0) - 'A'.charCodeAt(0);
          var spawn_pos = Math.floor(Math.random() * 12);
          this.last_tile = ig.game.spawnEntity( EntityTile, 8 + spawn_pos * 30, 8, {char_num: char_num, 
                                                                                    vel: {x: 0, 
                                                                                          y: this.n_completed_lines * 20 + 30 
                                                                                         }
                                                                                   } );
        },
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.SPACE, 'shoot' );
		ig.input.bind( ig.KEY.H, 'help' );
		ig.input.bind( ig.KEY.h, 'help' );
		ig.input.bind( ig.KEY.ESC, 'end' );
		
		this.loadLevel( LevelLevel1 );
                ig.game.spawnEntity( EntityGun, 0, 100, {flip: true} );
                ig.game.spawnEntity( EntityGun, 376 - 30, 200, {flip: false} );

                for (var i = 0; i < 13; i++) {
                  this.user_lines.push("            ");
                  this.user_tile_lines.push([]);
                  for (var j = 0; j < 12; j++) {
                    this.user_tile_lines[i].push(null);
                  }
                }
                this.words = all_words.map(function(xx) { return xx.toUpperCase() });
                this.word_lines = []; 
                this.new_tile();
	},
        add_word_line: function(row) {
                if (row > this.words.length - 1) {
                  return;
                }
                var x_pos = 376 + 8;
                var y_pos = (ig.system.height - 8) - ((row + 1) * this.tile_size.y); 
                this.font.draw(this.words[row], x_pos, y_pos);
        },
        row_complete: function(row) {
            var word = this.words[row];
            var user_line = this.user_lines[row];
            if (user_line.search(new RegExp(word)) != -1) {
              return true;
            }
            return false;
        },
        can_match: function(pattern, word) {
            for (var i = 0; i < pattern.length; i++) {
              if ((pattern[i] != ' ') && (pattern[i] != word[i])) {
                return false;
              }
            }
            return true;
        },
        row_unsat: function(row) {
            var word = this.words[row];
            var user_line = this.user_lines[row];
            for (var i = 0; i <= user_line.length - word.length; i++) {
              if (this.can_match(user_line.slice(i, i + word.length), word)) {
                return false;
              }
            }
            return true;
        },
        alert_user_tile_line: function(row) {
          var tile_ids = '';
          for (var i = 0; i < this.user_tile_lines[row].length; i++) {
            if (this.user_tile_lines[row][i]) {
              var l_char_num = this.user_tile_lines[row][i].char_num;
              tile_ids += ' ' + ((l_char_num == 26) ? '-' : String.fromCharCode(l_char_num + 'A'.charCodeAt(0)));
            }
            else {
              tile_ids += ' _';
            }
          }
          alert(tile_ids + ' ' + row);
        },
        fill_row: function(row) {
            var user_line = this.user_lines[row];
            var new_user_line = '';
            for (var i = 0; i < user_line.length; i++) {
              if (user_line[i] == ' ') {
                new_user_line += '-';
                var row_number = row;
                var col_number = i;
                var x_pos = 8 + col_number * 30;
                var y_pos = (ig.system.height - 8) - ((row + 1) * this.tile_size.y);
                var new_tile = ig.game.spawnEntity(EntityTile, x_pos, y_pos, {char_num: 26,
                                                                              vel: {x: 0, 
                                                                                    y: 0
                                                                                   }
                                                                             } );
                this.user_tile_lines[row][i] = new_tile;
                                                                              
              }
              else {
                new_user_line += user_line[i];
              }
            }
            this.user_lines[row] = new_user_line;
            this.n_full_rows ++;
        },
        remove_row: function(row) {
            new_words = [];
            for (var i = 0; i < this.words.length; i++) {
              if (i != row) {
                new_words.push(this.words[i]);
              }
            }
            this.words = new_words;

            var kill_row = this.user_tile_lines[row];
            for (var i = 0; i < kill_row.length; i++) {
              if (kill_row[i]) {
                kill_row[i].kill();
                this.user_tile_lines[row][i] = null;
              }
            }

            for (var i = row + 1; i <= this.n_user_line; i++) {
              var tile_row = this.user_tile_lines[i];
              for (var j = 0; j < tile_row.length; j++) {
                var tile = tile_row[j];
                if (tile) {
                  tile.pos.y += tile.size.y;
                }
              }
            }
            for (var i = row; i <= this.n_user_line; i++) {
              for (var j = 0; j < this.user_tile_lines[i].length; j++) {
                this.user_tile_lines[i][j] = this.user_tile_lines[i + 1][j];
              }
              this.user_lines[i] = this.user_lines[i + 1];
            }
            this.n_user_line -= 1;
            this.n_completed_lines ++;
        },
        add_to_user_lines: function(tile, char_num, row, col) {
                user_line = this.user_lines[row];
                var prefix = col == 0 ? '' : user_line.slice(0, col);
                user_line = prefix + 
                            String.fromCharCode(char_num + 'A'.charCodeAt(0)) +
                            user_line.slice(col + 1);
                this.user_lines[row] = user_line; 
                this.user_tile_lines[row][col] = tile;
        },
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
                if (this.last_tile.standing) {
                  row_number = this.get_row_num(this.last_tile);
                  col_number = this.get_col_num(this.last_tile);
                  if (row_number > this.n_user_line) {
                    this.n_user_line = row_number;
                  }
                  this.add_to_user_lines(this.last_tile, this.last_tile.char_num, row_number, col_number);
                  if (this.row_complete(row_number)) {
                    this.remove_row(row_number);
                  } 
                  else if ((row_number == this.n_full_rows) && this.row_unsat(row_number)) {
                    this.fill_row(row_number);
                  }
                }
                if (this.last_tile._killed || this.last_tile.standing) {
                  this.new_tile();
                }
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
                this.backdrop.draw(0,0);
		this.parent();
		
                if (ig.input.pressed('help')) {
                  ig.system.clear("#00006b"); 
                  this.inst_font.draw('AIM:', 30, 70);
                  this.inst_font.draw('Spell the words in the right panel by using the falling tiles.', 30, 100);
                  this.inst_font.draw('When you spell the correct word in a row, the row disappears.', 30, 130);
                  // this.inst_font.draw('A row fills up with empty tiles when it is not possible to spell the word anymore', 30, 160);
                  this.inst_font.draw('The game gets over when there are more than 6 incomplete rows.', 30, 160);
                  this.inst_font.draw('Controls:', 30, 220); 
                  this.inst_font.draw('Left/Right arrow - Move the falling tile', 30, 250);
                  this.inst_font.draw('Down arrow - Increase the speed of the falling tile', 30, 280);
                  this.inst_font.draw('Space Bar - Shoot bullets at the falling tile', 30, 310);
                  this.inst_font.draw('ESC - End the game', 30, 340);
		  this.inst_font.draw('Click any key to return to the game', 30, 500 );
                  ig.system.stopRunLoop();
                  $(document).keydown(end_help);
                }
                else if (this.n_user_line > 4 || ig.input.pressed('end') ) {
                  for( var i = 0; i < this.entities.length; i++ ) {
                    var ent = this.entities[i];
                    ent.kill();
                  }
                  ig.system.clear("#00006b"); 
		  this.font.draw( 'GAME OVER', 30, 150 );
		  this.inst_font.draw( 'Click any key to return to your session', 30, 200 );
		  this.font.draw( 'Credits', 30, 450 );
		  this.inst_font.draw( 'Bullets: Aadi', 30, 500 );
		  this.inst_font.draw( 'Background: Shaifali', 30, 530 );

                  ig.system.stopRunLoop();
                  $(document).keydown(end_spell_and_shoot);
                }
                else {
                  this.inst_font.draw( 'Help: Press h for help', 378, 2 );
                  this.inst_font.draw( 'Controls:', 378, 30 );
                  this.inst_font.draw( 'Left/Right/Down Arrows, Space Bar', 378, 60 );
                  this.inst_font.draw( 'ESC to end', 378, 90 );
                  this.inst_font.draw( 'SCORE: ' + this.n_completed_lines, 378, 130 );
                  for (var i = 0; i <= this.n_user_line + 1; i++ ) {
                    this.add_word_line(i);
                  }
                }
	}
});


// Start the Game with 60fps
// ig.main( '#canvas', MyGame, 60, 376 * 2 - 8, 576, 1 );

});
