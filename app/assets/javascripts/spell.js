var is_webkit = false;
var cur_word_index;
var rev_word_index;
var audio_types = new Object();
var prev_mistakes_hash = new Object();
var mistakes = [];
var WORDS_PER_SESSION = 5;
var app_state = "IN_SESSION"; // valid states are ["IN_SESSION", "WAITING_FOR_REVISION", "IN_REVISION", "WAITING_FOR_SESSION"]

var shuffle_words = function(words) {
  var n = words.length;
  for (var i = n - 1; i > 0; i --) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = words[i];
    words[i] = words[j];
    words[j] = tmp;
  }
}

var in_revision = function() {
  return app_state == "IN_REVISION";
}

var incr_attempts = function(word) {
  var s_word = score_table[word];
  if (in_revision()) {
    s_word.rev_attempts += 1;
  }
  else {
    s_word.attempts += 1;
  }
}

var show_multiple_choice = function(word, wmistakes)
{
  $('form').hide();
  $('#spell_multiple_choice').show();
  $('.spell_choice').hide();
  $('.spell_choice_word').hide();

  shuffle_words(wmistakes);
  if (wmistakes.length > 3) {
    wmistakes = wmistakes.slice(0, 3);
  }
  wmistakes.push(word);
  shuffle_words(wmistakes);

  for (var i = 0; (i < wmistakes.length && i < 4); i++) {
    $choice_div = $("#spell_choice" + i); 
    $choice_div.val(wmistakes[i]);
    $choice_div.show();
    $choice_div.attr('checked', false);
    $spell_choice_word_div = $("#spell_choice_word" + i);
    $spell_choice_word_div.text(wmistakes[i]);
    $spell_choice_word_div.show();
  }
}

var show_text_box = function()
{
  $('form').hide();
  $('#spell_text_box').show();
}

var say_word = function(word) {
  incr_attempts(word);
  var audio_type = audio_types[word];
  var indian_mp3_file = '/assets/audios/' + word + '_indian.mp3';
  var american_mp3_file = '/assets/audios/' + word + '_american.mp3';
  var british_mp3_file = '/assets/audios/' + word + '_british.mp3';
  $(".one_audio_div").hide();
  var autoplay = true;
  if (is_webkit) {
    if (audio_type.match(/american/)) { 
      $("#american_audio_div").show(); 
      $("#american_mp3_file").attr('src', american_mp3_file);
      if (autoplay) {
        $("#american_mp3_file").attr('autoplay', 'autoplay');
        autoplay = false;
      }
      else {
        $("#american_mp3_file").removeAttr('autoplay', '');
      }
    }
    if (audio_type.match(/british/)) { 
      $("#british_audio_div").show(); 
      $("#british_mp3_file").attr('src', british_mp3_file);
      if (autoplay) {
        $("#british_mp3_file").attr('autoplay', 'autoplay');
        autoplay = false;
      }
      else {
        $("#british_mp3_file").removeAttr('autoplay', '');
      }
    }
  }
  else {
    if (audio_type.match(/american/)) { 
      $("#american_embed_audio_div").show();
      $("#embed_american_mp3_file").attr('src', american_mp3_file);
      if (autoplay) {
        $("#embed_american_mp3_file").attr('autostart', 'true');
        autoplay = false;
      }
      else {
        $("#embed_american_mp3_file").attr('autostart', 'false');
      }
    }
    if (audio_type.match(/british/)) { 
      $("#british_embed_audio_div").show();
      $("#embed_british_mp3_file").attr('src', british_mp3_file);
      if (autoplay) {
        $("#embed_british_mp3_file").attr('autostart', 'true');
        autoplay = false;
      }
      else {
        $("#embed_british_mp3_file").attr('autostart', 'false');
      }
    }
  }
  $('#compare').focus();
}

var undisplay_spell_and_compare_div = function ()
{
  $("#audio_and_compare").hide();
  $("#help-button").hide();
}

var display_spell_and_compare_div = function ()
{
  $("#audio_and_compare").show();
  $("#help-button").show();
}

var undisplay_skip_tab = function ()
{
  $("#skip-button").hide();
}

var display_skip_tab = function ()
{
  $("#skip-button").show();
}

var undisplay_revision_button = function ()
{
  $("#rev-button-div").hide();
}

var display_revision_button = function ()
{
  $("#rev-button-div").show();
}

var undisplay_new_session_button = function ()
{
  $("#new-session-button-div").hide();
  $(".game-button-div").hide();
}

var display_new_session_button = function ()
{
  $("#new-session-button-div").show();
  $(".game-button-div").show();
}

var collect_mistakes = function(words)
{
  words.length = 0;
  for (var word in score_table) {
    s_word= score_table[word];
    if (s_word.badAttempts.length > 0) {
      words.push(s_word.word);
    }
  }
}

// Need to be different from update_spell_score because
// need to set async, does not get executed without it.
// Also no success part. Could possibly use for logout also.
var update_score_on_server_at_unload = function()
{
  json = JSON.stringify(score_table);
  $.ajax({ url: 'update_spell_score', 
           async: false,
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { json: json}
         }
        );
}

var update_score_on_server_at_logout = function()
{
  update_score_on_server(score_table);
}

var update_score_on_server = function(score_table)
{
  json = JSON.stringify(score_table);
  $.ajax({ url: 'update_spell_score', 
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { json: json}, 
           success: function(data) {
             $('#star_num').html(data);
           }
         }
        );
  clear_score_table(score_table);
}

var clear_score_table = function(score_table)
{
  for (var word in score_table) {
    delete score_table[word];
  }
}

var set_for_new_session = function() {
  $rev_title_div.hide();
  mistakes.length = 0;
  clear_score_table(score_table);
  clear_incorrect_table();
  clear_correct_table();
}

var start_new_session = function() {
  undisplay_revision_button();
  undisplay_new_session_button();
  display_spell_and_compare_div();
  set_for_new_session();
  say_new_word();
}

var end_session = function() {
  app_state = "WAITING_FOR_REVISION";
  display_revision_button();
  undisplay_spell_and_compare_div();
}

var set_for_revision = function() {
  $rev_title_div.html("REVISION");
  $rev_title_div.show();
  remove_answers_from_incorrect_table();
  rev_word_index = -1;
}

var start_revision = function() {
  undisplay_revision_button();
  display_spell_and_compare_div();
  set_for_revision();
  say_new_word();
}

var end_revision = function() {
  app_state = "WAITING_FOR_SESSION";
  update_score_on_server(score_table);
  if (cur_word_index + 1 == all_words.length) {
    alert("Finished this set of words");
    window.location.replace("/");
    return;
  }
  display_new_session_button();
  undisplay_spell_and_compare_div();
}

var get_word_definition = function(word, div, full) {
  div.html("<img src=\"/assets/wait20.gif\">");
  div.show();
  $.ajax({ url: 'get_meaning', 
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { word: word, full: full }, 
           success: function(data) {
             div.html(data);
             div.show();
             if (!is_webkit) {
               $(".example_mp3_file_audio").hide(); 
             }
           }
         }
        );
}

var say_new_word = function() {
  undisplay_skip_tab();
  switch (app_state) {
    case "IN_REVISION": {
      if (rev_word_index + 1 == mistakes.length) {
        end_revision();
        return;
      }
      break;
    }
    case "IN_SESSION": {
      if ((cur_word_index + 1 == all_words.length) || 
          ((cur_word_index > 0) && 
           ((cur_word_index + 1) % WORDS_PER_SESSION == 0))
         ) {
        collect_mistakes(mistakes);
        if (mistakes.length == 0) {
          end_revision();
          return;
        }
        else {
          end_session();
          return;
        }
      } 
      break;
    }
    case "WAITING_FOR_SESSION": {
      app_state = "IN_SESSION";
      break;
    }
    case "WAITING_FOR_REVISION": {
      app_state = "IN_REVISION";
      break;
    }
  }
  incr_cur_word_index();
  cur_word = get_current_word();
  cur_mistakes = get_prev_mistakes(cur_word);
  get_word_definition(cur_word, $meaning_div, true);
  score_table[cur_word] = score_table[cur_word] || new WordScore(cur_word);
  if (cur_mistakes.length > 0 && app_state != "IN_REVISION" && Math.random() > 0.5) {
    show_multiple_choice(cur_word, cur_mistakes);
  }
  else {
    show_text_box();
  }
  say_word(cur_word);
}

var update_result = function(msg)
{
  $result.html(msg);
  $result.show();
  $result.fadeOut(2000);
}

var skip_word = function(e) {
  undisplay_skip_tab();
  cur_word = get_current_word();
  update_score(cur_word, "", "SKIPPED");
  say_new_word();
}

var get_current_word = function() {
  return in_revision() ? mistakes[rev_word_index] : all_words[cur_word_index];
}

var get_prev_mistakes = function(word) {
  return prev_mistakes_hash[word];
}

var incr_cur_word_index = function() {
  if (in_revision()) {
    rev_word_index += 1;
  } else {
    cur_word_index += 1;
  }
}

var check_word = function(e) {
  var $this = $(this); 
  e.preventDefault();
  var spell;
  var is_multiple_choice = false;
  // text box option is on
  if ($('#spell_text_box').is(':visible')) {
    var $input = $this.find('#compare');
    spell = $input.val();
    $input.val("");
  } 
  else {
    mutliple_div = $("input:radio[name='spelling_choice']");
    spell = $("input:radio[name='spelling_choice']:checked").val();
    is_multiple_choice = true;
  }
  spell = spell.toLowerCase();
  spell = spell.replace(/^\s+|\s+$/g,"");
  cur_word = get_current_word();
  if (spell == cur_word) {
    update_score(cur_word, spell, "PASS");
    say_new_word();
  } else {
    update_score(cur_word, spell, "FAIL");
    if (is_multiple_choice) {
      reveal_word(cur_word);
      update_result("Sorry, Next Word");
      say_new_word();
    }
    else {
      update_result("Sorry, try again");
      display_skip_tab();
      say_word(cur_word);
    }
  }
}

var clear_correct_table = function()
{
  for (var word in correct_score_table) {
    correct_score_table[word].$tr.remove();
  }
  $correct_table_div.hide();
}

var clear_incorrect_table = function()
{
  for (var word in incorrect_score_table) {
    incorrect_score_table[word].$tr.remove();
  }
  $incorrect_table_div.hide();
}

var remove_answers_from_incorrect_table = function()
{
  for (var word in incorrect_score_table) {
    incorrect_score_table[word].$tdword.html("");
  }
}

function create_correct_word_row(word)
{
  $correct_table_div.show();
  correct_score_table[word.word] = new Object;
  word_row = correct_score_table[word.word];
  word_row.$tr = $('<tr> </tr>');
  word_row.$tdword = $('<td> </td>');
  word_row.$td_star = $('<td> </td>');
  word_row.$tr.append(word_row.$tdword);
  word_row.$tr.append(word_row.$td_star);
  $correct_table.append(word_row.$tr); 
  return word_row;
}

function create_incorrect_word_row(word)
{
  $incorrect_table_div.show();
  var word_row = incorrect_score_table[word];
  if (!word_row) {
    incorrect_score_table[word.word] = new Object;
    word_row = incorrect_score_table[word.word];
    word_row.$tr = $('<tr> </tr>');
    word_row.$tdword = $('<td> </td>');
    word_row.$tdattempts = $('<td> 0 </td>');
    word_row.$td_bad_attempts = $('<td> </td>');
    word_row.$td_star = $('<td> </td>');
    word_row.$tr.append(word_row.$tdword);
    word_row.$tr.append(word_row.$tdattempts);
    word_row.$tr.append(word_row.$td_bad_attempts);
    word_row.$tr.append(word_row.$td_star);
    $incorrect_table.append(word_row.$tr); 
  }
  return word_row;
}

function WordScore(word) {
  this.attempts = 0;
  this.rev_attempts = 0;
  this.skipped = 0;
  this.badAttempts = [];
  this.word = word;
  this.score = 0;
}
 
var find_word_row = function(word) {
  return correct_score_table[word] ? correct_score_table[word] : incorrect_score_table[word]; 
}

var update_star_image = function(word_row, word) {
  if (word.score == 1) {
    word_row.$td_star.html('<img src=/assets/full-gold-star-small.png>');
  }
  else if (word.score == 0.5) {
    word_row.$td_star.html('<img src=/assets/half-gold-star-small.png>');
  }
}

var update_bad_attempts = function(s_word, spell) {
  var word_row = find_word_row(s_word.word);
  s_word.badAttempts.push(spell);
  // Add bad spelling to the list
  var badAttemptsStr = s_word.badAttempts.reduce(
      function(first, second) {
        if (first == '') {
          return first + second;
        } else {
          return first + ', ' + second;
        }
      });
  word_row.$td_bad_attempts.html(badAttemptsStr);
}

var reveal_word = function(word) {
  var s_word = score_table[word];
  var word_row = find_word_row(s_word.word);
  word_row.$tdword.html(s_word.word);
}

var update_score = function(word, spell, result) {
  var s_word = score_table[word];
  var word_row = find_word_row(s_word.word);
  var attempts = s_word.attempts;
  var rev_attempts = s_word.rev_attempts;

  if (!word_row) {
    if (result == 'PASS') {
      word_row = create_correct_word_row(s_word);
    }
    else {
      word_row = create_incorrect_word_row(s_word);
    }
  }

  if (result == "PASS") {
    if (in_revision()) {
      s_word.score = rev_attempts == 1 ? 
                       (s_word.skipped ? 0.5 : 1) :
                       0.5;
    } else {
      s_word.score = (attempts == 1) ? 1 : 0.5;
    }
    // reveal the word
    word_row.$tdword.html(s_word.word);
  } else if (result == "SKIPPED") {
    s_word.skipped = 1;
    s_word.score = 0;
    // reveal the word
    word_row.$tdword.html(s_word.word);
    // display 'SKIPPED' in the attemps column
    word_row.$tdattempts.html(attempts + rev_attempts + ' (SKIPPED)');
  } else {
    update_bad_attempts(s_word, spell);
    word_row.$tdattempts.html(attempts + rev_attempts);
  }
  update_star_image(word_row, s_word);
}

var start_hangman_from_spell = function(words)
{
  var j = Math.floor(Math.random() * words.length);
  start_hangman(words[j]);
}

var start_find_words_from_spell = function(words)
{
  var $content_div = $('#content');
  var find_words_words = words.slice();
  shuffle_words(find_words_words);
  $content_div.html('');
  start_find_words({in_words: find_words_words.slice(0, 10), 
                    audios : audios,
                    print_msg : false,
                    show_all : true,
                    show_all_delayed : true,
                    show_help : true,
                    show_rearrange : false,
                    show_audio : true,
                    callback_fn : start_and_draw_new_spell_session
                   });
}

var start_shoot_and_spell_from_spell = function()
{
  var $content_div = $('#content');
  $.ajax({ url: 'draw_shoot_and_spell', 
           type: 'GET',
           headers: {
             'X-Transaction': 'GET Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           success: function(data) {
            $content_div.html(data);
            ig.module('dummy').requires('game.main').defines(function(){
                      ig.main( '#canvas', SpellShootGame, 60, 376 * 2 - 8, 576, 1 );
                    });
           }
         }
        );
}

var $correct_table;
var $correct_table_div;
var $incorrect_table;
var $incorrect_table_div;
var $rev_title_div;
var $result;
var $my_logout;
var $meaning_div;

var score_table = new Object();
var incorrect_score_table = new Object();
var correct_score_table = new Object();

var set_callbacks_spell = function () {
  var $form = $('form');
  $form.submit(check_word);
  $('#spell_multiple_choice').click(check_word);
  $('#skip-button').click(skip_word);
  $('#rev-button').click(start_revision);
  $('#new-session-button').click(start_new_session);
  $('#hangman-button').click(function () {
      start_hangman_from_spell(all_words);
      });
  $('#shoot-and-spell-button').click(function () {
      start_shoot_and_spell_from_spell(all_words);
      });
  $('#find-words-button').click(function () {
      start_find_words_from_spell(all_words);
      });
  var $my_logout = $('#my_logout');
  $('#my_logout').click(update_score_on_server_at_logout);
  $('#rev-button').tooltip({title: "Click to start revising your mistakes"});
  $(window).unload(update_score_on_server_at_unload);
}

var initialize_divs_spell = function () {
  $correct_table_div = $('#correct_table_div');
  $correct_table_div.hide();
  $correct_table = $('#correct_table')

  $incorrect_table_div = $('#incorrect_table_div');
  $incorrect_table_div.hide();
  $incorrect_table = $('#incorrect_table')

  $rev_title_div = $('#rev_title');
  $rev_title_div.html("NEW SESSION");

  $result = $('#result');

  $meaning_div = $('#meaning');

  $multiple_choice_form_div = $('#spell_multiple_choice');
  $multiple_choice_form_div.hide();

  $browser = $.browser;
  if ($browser.webkit) {
    is_webkit = true;
    $("#embed_audio_div").hide();
  }
  else {
    is_webkit = false;
    $("#audio_div").hide();
  }
}

var create_audio_type_hash = function()
{
  for (var i = 0; i < all_words.length; i++) {
    var word = all_words[i];
    var audio_type = audios[i];
    audio_types[word] = audio_type;
  }
}

var create_mistakes_hash = function()
{
  for (var i = 0; i < all_words.length; i++) {
    var word = all_words[i];
    var prev_mistake = prev_mistakes[i];
    prev_mistakes_hash[word] = prev_mistake;
  }
}



var initialize_spell = function () {
  $('<img />').attr('src','/assets/wait20.gif').appendTo('body').css('display','none');
  initialize_divs_spell();
  set_callbacks_spell();
  create_audio_type_hash();
  create_mistakes_hash();
  shuffle_words(all_words);
  cur_word_index = -1;
  start_new_session();
}

var start_and_draw_new_spell_session = function() {
  var $content_div = $('#content');
  $.ajax({ url: 'draw_spell', 
           type: 'GET',
           headers: {
             'X-Transaction': 'GET Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           success: function(data) {
             $content_div.html(data);
             initialize_divs_spell();
             set_callbacks_spell();
             start_new_session();
           }
         }
        );
}

$(document).ready(function() {
  initialize_spell();
});
