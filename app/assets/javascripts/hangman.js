var word;

var letters_tried;
var bad_attempts;
var hint_letters;

var hint_button_click = function()
{
  var len = word.length;
  letters_left = []
  for (i = 0; i < len; i++) {
    var char_at = word.charAt(i);
    if (!(char_at in letters_tried)) {
      letters_left.push(char_at)
    }
  }
  var j = Math.floor(Math.random() * letters_left.length);
  var chosen_letter = letters_left[j];
  put_letter(chosen_letter);
  add_letter_to_hints(chosen_letter);
}

var get_keystroke = function(event)
{
  var acode = 'A'.charCodeAt(0);
  var zcode = 'Z'.charCodeAt(0);
  var in_char;

  if (event.which >= acode && event.which <= zcode) { 
    in_char = String.fromCharCode(event.which);
    put_letter(in_char);
  }
}

var put_letter = function(in_char) 
{
  if (in_char in letters_tried) {
    blink_tried_letter(in_char);
  }
  else {
    letters_tried[in_char] = 1;
    var found_letter_in_word = fill_word_with_letter(in_char);
    if (found_letter_in_word) {
      add_letter_to_good_attempts(in_char);
      if (word_done()) {
        show_success();
      }
    }
    else {
      add_letter_to_bad_attempts(in_char);
      if ((bad_attempts.length + (hint_letters.length*2)) >= 6) {
        show_failure();
      }
    }
  }
}

var word_done = function() 
{
  var len = word.length;
  for (i = 0; i < len; i++) {
    var char_at = word.charAt(i);
    if (!(char_at in letters_tried)) {
      return false;
    }
  }
  return true;
}

var redraw_hangman = function ()
{
  var $hangman_image_div = $("#hangman-image");
  var hangman_num = bad_attempts.length + (hint_letters.length * 2);
  $hangman_image_div.html("<img src=\"/assets/Hangman-"+hangman_num+".png\" alt=\"\">");
  if (hangman_num >= 4) {
    $('#hint-button-div').hide("slow");
  }
}

var add_letter_to_hints = function(letter)
{
  hint_letters.push(letter);
  var $letter_div = $('#alpha_'+letter);
  var $done_letter_div = $('#alpha_done_'+letter);
  $done_letter_div.html(letter);
  $done_letter_div.addClass("hint_attempt");
  $letter_div.html("");
  redraw_hangman();
}

var add_letter_to_bad_attempts = function(letter)
{
  bad_attempts.push(letter);
  var $letter_div = $('#alpha_'+letter);
  var $done_letter_div = $('#alpha_done_'+letter);
  $done_letter_div.html(letter);
  $done_letter_div.addClass("bad_attempt");
  $letter_div.html("");
  redraw_hangman();
}

var add_letter_to_good_attempts = function(letter)
{
  $letter_div = $('#alpha_'+letter);
  var $done_letter_div = $('#alpha_done_'+letter);
  $done_letter_div.html(letter);
  $done_letter_div.addClass("good_attempt");
  $letter_div.html("");
}

var blink_tried_letter = function(letter)
{
  $letter_div = $('#alpha_'+letter);
  $letter_div.fadeOut('slow', function () { $letter_div.fadeIn('slow'); })
  blink_filled_letter(letter);
}

var fadein = function (fdiv) {
  return function() {
    fdiv.fadeIn('slow');
  }
}

var blink_filled_letter = function(letter)
{
  var len = word.length;
  for (i = 0; i < len; i++) {
    var char_at = word.charAt(i);
    if (char_at == letter) {
      $char_div = $("#char" + i);
      $char_div.fadeOut('slow', fadein($char_div))
    }
  }
}

var fill_word_with_letter = function(letter)
{
  var len = word.length;
  var found = false;
  for (i = 0; i < len; i++) {
    var char_at = word.charAt(i);
    if (char_at == letter) {
      $char_div = $("#char" + i);
      $char_div.html(letter.toUpperCase());
      var char_width = $char_div.width();
      var total_padding = 28 - char_width;
      var left_padding = Math.floor(total_padding/2);
      var right_padding = total_padding - left_padding;
      $char_div.css("padding-left", left_padding);
      $char_div.css("padding-right", right_padding);
      $char_div.fadeOut('slow', fadein($char_div));
      found = true;
    }
  }
  return found;
}

var fill_word = function() {
  var len = word.length;
  for (i = 0; i < len; i++) {
    var char_at = word.charAt(i);
    $char_div = $("#char" + i);
    $char_div.html(char_at.toUpperCase());
    $char_div.fadeOut('slow', fadein($char_div));
  }
}

var show_empty_word = function(word)
{
  var len = word.length;
  var word_html = "";
  for (i = 0; i < len; i++) {
    word_html += "<span class=\"btn btn-medium btn-primary word_char\" id=char" + i  + "> - </span>"; 
  }
  $word_div.html(word_html);
  var char_width = $('#char0').outerWidth(true);
  var word_width = char_width * len;
  var div_width = $word_div.width();
  var padding = (div_width - word_width)/2;
  $word_div.css("padding-left", padding + "px");
}

var disable_letter_clicks = function()
{
  var acode = 'A'.charCodeAt(0);
  for (i = 0; i < 26; i++) {
    var letter_code = acode + i;
    var letter = String.fromCharCode(letter_code);
    var $letter_div = $('#alpha_' + letter);
    $letter_div.off('click');
  }
}

var end_hagman = function(score)
{
  $(document).off('keydown');
  disable_letter_clicks();
  $('#hint-button-div').hide("slow");
  $('#new-session-button-div').show();
  $.ajax({ url: 'update_hangman_score',
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { word: cur_word, score: score },
           success: function(data) {
             $('#hangman_star_num').html(data);
           }
         }
      );
}

var show_success = function()
{
  $('#new-session-button').html("You got it, Start New Session");
  end_hagman(6 - bad_attempts.length + (hint_letters.length*2));
}

var show_failure = function()
{
  fill_word();
  $('#new-session-button').html("Sorry, Start New Session");
  end_hagman(0);
}

var get_letter_click_fn = function(letter)
{
  return function () {
    put_letter(letter);
  }
}

var fill_letters_div = function()
{
  var letters_html = "<table> <tbody>";
  var acode = 'A'.charCodeAt(0);

  letters_html += "<tr>";
  for (i = 0; i < 26; i++) {
    var letter_code = acode + i;
    var letter = String.fromCharCode(letter_code);
    letters_html += "<td> <a class=\"alpha_char\" id=alpha_" + letter  +">" + letter + "</a> </td>"; 
  }
  letters_html += "</tr>";
  letters_html += "<tr>";
  for (i = 0; i < 26; i++) {
    var letter_code = acode + i;
    var letter = String.fromCharCode(letter_code);
    letters_html += "<td> <span class=\"alpha_done_char\" id=alpha_done_" + letter  +">" + "</span> </td>"; 
  }
  letters_html += "</tr>";
  letters_html += "</tbody></table>";
  $letters_div.html(letters_html);
  for (i = 0; i < 26; i++) {
    var letter_code = acode + i;
    var letter = String.fromCharCode(letter_code);
    var $letter_div = $('#alpha_' + letter);
    $letter_div.click(get_letter_click_fn(letter));
  }

  var table_width = $letters_div.children().width();
  var div_width = $letters_div.width();
  var padding = (div_width - table_width)/2;
  $letters_div.css("padding-left", padding + "px");
}

var preloadImages = function()
{
  for (var i = 1; i <= 6; i++) {
    $('<img />').attr('src','/assets/Hangman-'+i+'.png').appendTo('body').css('display','none');
  }
}

var $word_div;
var $letters_div;

var $old_content;

var word_definition_click = function() 
{
  get_word_definition(word, $('#show-meaning-div'), false);
}

var start_hangman = function(in_word)
{
  word = in_word.toUpperCase();
  letters_tried = new Object();
  bad_attempts = [];
  var $content_div = $('#content');
  $.ajax({ url: 'draw_hangman', 
           type: 'GET',
           headers: {
             'X-Transaction': 'GET Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           success: function(data) {
             $content_div.html(data);
             $(document).keydown(get_keystroke);
             $word_div = $('#word');
             $letters_div = $('#letters');
             hint_letters = [];
             $('#new-session-button-div').hide();
             $('#new-session-button').click(start_and_draw_new_spell_session);
             $('#show-meaning-button').click(word_definition_click);
             $('#hint-button').click(hint_button_click);
             preloadImages();
             fill_letters_div();
             show_empty_word(word)
           }
         }
        );
}
