
var is_webkit = false;
var cur_word_index;

var get_word_definition = function(word, div) {
  div.html("<img src=\"/assets/wait20.gif\">");
  div.show();
  $.ajax({ url: 'get_meanings_for_selection', 
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { word: word }, 
           success: function(data) {
             div.html(data);
             div.show();
             var $form = $('form');
             $form.submit(choose_new_meaning);
           },
           failure: function(data) {
             new_word();
           }
         }
        );
}

var choose_meaning = function(word_id, meaning_id)
{
  $.ajax({ url: 'choose_meaning',
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { word_id: word_id, meaning_id: meaning_id }, 
           success: function(data) {
             new_word();
           },
           failure: function(data) {
             new_word();
           }
         }
        );
}

var skip = function()
{
   new_word();
}

var new_word = function() {
  if (cur_word_index + 1 == all_words.length) {
    alert("Finished this set of words");
    window.location.replace("/");
  }
  incr_cur_word_index();
  cur_word = get_current_word();
  $word_div.html("<b>" + cur_word + "</b>");
  get_word_definition(cur_word, $meaning_div);
}

var get_current_word = function() {
  return all_words[cur_word_index];
}

var incr_cur_word_index = function() {
  cur_word_index += 1;
}

var $meaning_div;
var $skip_div;

var choose_new_meaning = function(e) 
{
  var $this = $(this); 
  e.preventDefault();
  var $input = $this.find('#meaning');
  var meaning = $input.val().toLowerCase();
  word = get_current_word();
  var gtype = $('input:checkbox:checked').val();
  $.ajax({ url: 'set_new_meaning',
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: { word: word, meaning: meaning, gtype: gtype }, 
           success: function(data) {
             new_word();
           },
           failure: function(data) {
             new_word();
           }
         }
        );
}

var initialize_divs = function () {
  $word_div = $('#word_for_meaning');
  $meaning_div = $('#meaning');
  $skip_div = $("#skip-button");
  $skip_div.click(skip);
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

var initialize = function () {
  $('<img />').attr('src','/assets/wait20.gif').appendTo('body').css('display','none');
  initialize_divs();
  cur_word_index = -1;
  new_word();
}

$(document).ready(function() {
  initialize();
});
