var shuffle_words = function(words) {
  var n = words.length;
  for (var i = n - 1; i > 0; i --) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = words[i];
    words[i] = words[j];
    words[j] = tmp;
  }
}

var row_order = [];
var column_order = [];
var n_words_done = 0;
var colors = ['rgba(125,125,200,0.5)',
              'rgba(125,200,125,0.5)',
              'rgba(200,125,125,0.5)',
              'rgba(200,200,125,0.5)',
              'rgba(125,200,200,0.5)',
              'rgba(200,125,200,0.5)',
              'rgba(125,175,200,0.5)',
              'rgba(125,200,175,0.5)',
              'rgba(175,125,200,0.5)',
              'rgba(175,200,125,0.5)',
              'rgba(200,125,175,0.5)',
              'rgba(200,175,125,0.5)'];
var old_colors;
var word_array;
var words_fit;
var find_words_audio_types = new Object;
var find_words = [];
var show_all_button_timeout = null;
var for_print = false;

var create_order_array = function(size)
{
  var order_array = [];
  for (var i = 0; i < size; i++) {
    order_array.push(i);
  }
  shuffle_words(order_array);
  return order_array;
}

var init_row_col_order = function(size)
{
  row_order = create_order_array(size);
  column_order = create_order_array(size);
}

var log_word_array = function(word_array)
{
  var out = '';
  for (var i = 0; i < word_array.length; i++) {
    for (var j = 0; j < word_array[i].length; j++) {
      out += (word_array[i][j]);
    }
    out += '\n';
  }
  console.log(out);
}

var init_word_array = function(size)
{
  word_array = [];
  old_colors = [];
  for (var i = 0; i < size; i++) {
    word_array.push([]);
    old_colors.push([]);
    for (var j = 0; j < size; j++) {
      word_array[i].push('_');
      old_colors[i].push('rgba(255,255,255,0.5)');
    }
  }
  return word_array;
}

var is_empty = function(ch)
{
  return (ch == '_');
}

// returns -1 if not able to fit in any column, else returns
// the start (row, col), else returns [-1, -1]
var fit_in_column = function(word_array, word, columns_done)
{
  for (var i=0; i<column_order.length; i++) {
    var column = column_order[i];
    if (!columns_done[column]) {
      var r_order = create_order_array(word_array.length);
      for (var j=0; j<r_order.length; j++) {
        var row = r_order[j];
        if (row + word.length <= word_array.length) {
          var fitted = true;
          for (var k=row; k<row+word.length; k++) {
            if (is_empty(word_array[k][column]) == false && word_array[k][column] != word.charAt(k-row)) {
              fitted = false;
              break;
            }
          }
          if (fitted) {
            for (var k=row; k<row+word.length; k++) {
              word_array[k][column] = word.charAt(k-row);
            }
            columns_done[column] = true;
            return [row, column];
          }
        }
      }
    }
  }
  return [-1, -1];
}

var fit_in_row = function(word_array, word, rows_done)
{
  for (var i=0; i<row_order.length; i++) {
    var row = row_order[i];
    if (!rows_done[row]) {
      var col_order = create_order_array(word_array.length);
      for (var j=0; j<col_order.length; j++) {
        var column = col_order[j];
        if (column + word.length <= word_array[row].length) {
          var fitted = true;
          for (var k=column; k<column+word.length; k++) {
            if (is_empty(word_array[row][k]) == false && word_array[row][k] != word.charAt(k-column)) {
              fitted = false;
              break;
            }
          }
          if (fitted) {
            for (var k=column; k<column+word.length; k++) {
              word_array[row][k] = word.charAt(k-column);
            }
            rows_done[row] = true;
            return [row, column];
          }
        }
      }
    }
  }
  return [-1, -1];
}

var last_try_row_first = false;

var fit_word = function(word_array, word, rows_done, columns_done)
{
  var did_it_fit = new Object();
  did_it_fit.start = -1;
  did_it_fit.is_row = true;

  if (word.length > word_array.length) { return did_it_fit; }

  // If tried row first last time, try column first this time.
  var try_row = !last_try_row_first;
  var try_column = last_try_row_first;

  var tried_row = false;
  var tried_column = false;

  while (!tried_row || !tried_column) {
    if (try_row) {
      var start_coord = fit_in_row(word_array, word, rows_done);
      if (start_coord[0] != -1) {
        did_it_fit.is_row = true;
        did_it_fit.start = start_coord;
        log_word_array(word_array);
        last_try_row_first = true;
        return did_it_fit;
      }
      tried_row = true;
    }
    if (try_column) {
      var start_coord = fit_in_column(word_array, word, columns_done);
      if (start_coord[0] != -1) {
        did_it_fit.is_row = false;
        did_it_fit.start = start_coord;
        log_word_array(word_array);
        last_try_row_first = false;
        return did_it_fit;
      }
      tried_column = true;
    }
    try_row = !try_row;
    try_column = !try_column;
  }
  return did_it_fit;
}

var MAX_TRIES = 10;

var arrange_words = function(words, size) {
  init_row_col_order(size);

  var n_tries = 0;
  do {
    n_tries ++;
    words_fit = new Object;
    rows_done = new Object;
    columns_done = new Object;
    word_array = init_word_array(size);
    for (var i=0; i<words.length; i++) {
      var word = words[i];
      did_it_fit = fit_word(word_array, word, rows_done, columns_done);
      if (did_it_fit.start[0] != -1) {
        words_fit[word] = did_it_fit;
      }
    }
  } while ((Object.keys(words_fit).length < words.length) && (n_tries < MAX_TRIES));

  log_word_array(word_array);

  for (var i=0; i<size; i++) {
    for(var j=0; j<size; j++) {
      if (is_empty(word_array[i][j])) {
        word_array[i][j] = String.fromCharCode(Math.floor(Math.random() * 26) + 'A'.charCodeAt(0));
      }
    }
  }
  log_word_array(word_array);

  return word_array;
}

var first_click;
var first_row;
var first_col;
var second_row;
var second_col;

var mark_first_click = function(row, col)
{
  $td = $('#letter_' + row + '_' + col);
  new_color = normalize_color(old_colors[row][col], colors[n_words_done]);
  $td.css('background', new_color);
}

var min = function(x, y)
{
  return (x > y ? y : x);
}

var max = function(x, y)
{
  return (x > y ? x : y);
}

var find_selected_word = function(first_row, first_col, second_row, second_col)
{
  word = '';
  if (first_row == second_row) {
    var locol = min(first_col, second_col);
    var hicol = max(first_col, second_col);
    for (var i = locol; i <= hicol; i++) {
      word += word_array[first_row][i];
    }
  }
  else if (first_col == second_col) {
    var lorow = min(first_row, second_row);
    var hirow = max(first_row, second_row);
    for (var i = lorow; i <= hirow; i++) {
      word += word_array[i][first_col];
    }
  }
  return word;
}

var mark_found_word = function(word, first_row, first_col, second_row, second_col)
{
  var locol = min(first_col, second_col);
  var hicol = max(first_col, second_col);
  var lorow = min(first_row, second_row);
  var hirow = max(first_row, second_row);
  for (var i = lorow; i <= hirow; i++) {
    for (var j = locol; j <= hicol; j++) {
      $td = $('#letter_' + i + '_' + j);
      new_color = normalize_color(old_colors[i][j], colors[n_words_done]);
      $td.css('background', new_color);
      old_colors[i][j] = new_color;
    }
  }
  $('#fit_word_' + word).css('background', colors[n_words_done]);
  words_fit[word].found = true;
  n_words_done ++;
}

var restore_old_colors = function()
{
  for (var i = 0; i < word_array.length; i++) {
    for (var j = 0; j < word_array.length; j++) {
      $td = $('#letter_' + i + '_' + j);
      $td.css('background', old_colors[i][j]);
    }
  }
}

var normalize_color = function(color1, color2)
{
  r1 = eval(color1.substr(5, 3));
  r2 = eval(color2.substr(5, 3));

  g1 = eval(color1.substr(9, 3));
  g2 = eval(color2.substr(9, 3));

  b1 = eval(color1.substr(13, 3));
  b2 = eval(color2.substr(13, 3));

  if (r1 == 255 && g1 == 255 && b1 == 255) {
    return color2;
  }
  if (r2 == 255 && g2 == 255 && b2 == 255) {
    return color1;
  }
  r3 = Math.floor((r1 + r2) / 2);
  g3 = Math.floor((g1 + g2) / 2);
  b3 = Math.floor((b1 + b2) / 2);
  return ('rgba(' + r3 + ',' + g3 + ',' + b3 + ',0.5)');
}

var mark_selected_letters = function(first_row, first_col, second_row, second_col)
{
  restore_old_colors();
  if ((first_row != second_row) && (first_col != second_col)) {
    return;
  }
  var locol = min(first_col, second_col);
  var hicol = max(first_col, second_col);
  var lorow = min(first_row, second_row);
  var hirow = max(first_row, second_row);
  for (var i = lorow; i <= hirow; i++) {
    for (var j = locol; j <= hicol; j++) {
      $td = $('#letter_' + i + '_' + j);
      new_color = normalize_color(old_colors[i][j], colors[n_words_done]);
      $td.css('background', new_color);
    }
  }
}


var click_fn = function(i, j, input)
{
  if (first_click) {
    first_click = false;
    first_row = i;
    first_col = j;
    mark_first_click(first_row, first_col);
  }
  else {
    first_click = true;
    second_row = i;
    second_col = j;
    restore_old_colors();
    selected_word = find_selected_word(first_row, first_col, second_row, second_col);
    if (words_fit[selected_word]) {
      mark_found_word(selected_word, first_row, first_col, second_row, second_col);
      if (n_words_done == Object.keys(words_fit).length) {
        finished(input);
      }
    }
  }
}

var hover_fn = function(i, j)
{
  if (!first_click) {
    mark_selected_letters(first_row, first_col, i, j);
  }
}

var get_click_fn = function(i, j, input)
{
  return function () {
    click_fn(i, j, input);
  }
}

var get_hover_fn = function(i, j)
{
  return function () {
    hover_fn(i, j);
  }
}

var init_colors_array = function()
{

  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      for (var k = 0; k < 5; k++) {
        cstr = 'rgba(';
        cstr += 125 + i*25;
        cstr += ',';
        cstr += 125 + j*25;
        cstr += ',';
        cstr += 125 + k*25;
        cstr += ',0.5)';
        colors.push(cstr);
      }
    }
  }
  shuffle_words(colors);
}

var create_help_modal = function () {
  $help_modal = $(['<div class="modal hide fade" id="find_words_help_modal" style="display:none">',
                   '  <div class="modal-header">',
                   '    <button type="button" class="close" data-dismiss="modal">×</button>',
                   '    <h3>How To Play</h3>',
                   '  </div>',
                   '  <div class="modal-body">',
                   '    <p>You have to find all the words from the table in the work box.</p>',
                   '    <p>To select a word, click left mouse button to start, and left mouse button again to end.</p>',
                   '    <p>You can listen to the word by clicking <img src="/assets/play_audio.png" width="40" height="40"> </p>',
                   '  </div>',
                   '  <div class="modal-footer">',
                   '    <a href="#" class="btn" data-dismiss="modal">Close</a>',
                   '  </div>',
                   '</div>'].join(' ')).appendTo($('#content'));
}

var print_box = function()
{
  var box_json = JSON.stringify(word_array);
  var words_fit_json = JSON.stringify(words_fit);
  $.ajax({ url: 'print_word_box',
           async: false,
           type: 'POST',
           headers: {
             'X-Transaction': 'POST Example',
             'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
           },
           data: {box_json: box_json,
                  words_fit_json: words_fit_json},
           success: function(data) {
             print_box_id = data;
             window.open("print_word_box/"+ print_box_id);
           }
         }
        );

}

var display_words = function (word_array, input)
{
  $('#content').html("");
  $help_row = $('<div/>').attr({
                class: 'row'
               }).appendTo('#content');
  if (input["show_help"]) {
    $span6 = $('<div/>').attr({
             class: 'span6'
           }).appendTo($help_row);

    $how_to_play_btn = $('<a id="find-words-help-button" class="btn btn-warning" data-toggle="modal" href="#find_words_help_modal">How To Play</a>').appendTo($span6);
    create_help_modal();
  }

  if (input["print_msg"]) {
    $instructions = $('<h2/>');
    $instructions.html("Search for the words from the table in the WordBox. To solve this online go to http://meliora.in/home/find_words/" + word_box_id);
    $instructions.appendTo($help_row);
    $instructions.css("text-align", "center");
  }

  $row = $('<div/>').attr({
            class: 'row',
            id: 'find_words_content'
          }).appendTo('#content');

  $span6 = $('<div/>').attr({
             class: 'span6'
           }).appendTo($row);
  $span4 = $('<div/>').attr({
             class: 'offset1 span4'
           }).appendTo($row);

  $table = $('<table/>').attr({
             id : 'word_table'
           }).appendTo($span6);
  $tbody = $('<tbody/>').appendTo($table);
  for (var i=0; i<word_array.length; i++) {
    $tr = $('<tr/>').appendTo($tbody);
    for (var j=0; j<word_array[i].length; j++) {
      $td = $('<td> <h2>' + word_array[i][j] + '</h2> </td>').appendTo($tr);
      $td.attr({class: 'find_words_letter',
                id: 'letter_' + i + '_' + j});
      $td.click(get_click_fn(i, j, input));
      $td.hover(get_hover_fn(i, j));
    }
  }

  if (input["show_all"] || input["show_rearrange"] || input["show_new_wordbox"]) {
    $row = $('<div/>').attr({
             class: 'row'
            }).appendTo($span6);
    $row.css("margin-top","20px");
    $span2 = $('<div/>').attr({
               class: 'span2'
               }).appendTo($row);
    $show_all_button = $('<a id="show_all_button" class="btn btn-success btn-large"> Show All Words </a>').appendTo($span2);
    $show_all_button.click(function () { show_all_words(input) });

    if (input["show_all_delayed"]) {
      $show_all_button.hide();
      show_all_button_timeout = setTimeout('$("#show_all_button").show()', 60000);
    }

    if (input["callback_fn"]) {
      $span2 = $('<div/>').attr({
                 class: 'span2'
                 }).appendTo($row);
      $next_session_button = $('<a id="next_session_button" class="btn btn-success btn-large"> New Session</a>').appendTo($span2);
      $next_session_button.hide();
      $next_session_button.click(input["callback_fn"]);
    }

    if (input["show_rearrange]"]) {
      $span2 = $('<div/>').attr({
                 class: 'span2'
                 }).appendTo($row);
      $rearrange_button = $('<a id="rearrange_button" class="btn btn-success btn-large"> Rearrange Words</a>').appendTo($span2);
      $rearrange_button.click(function () { rearrange_words(input["callback_fn"]); });
      $rearrange_button.hide();
    }

    if (input["show_create_random_wordbox"]) {
      $span2 = $('<div/>').attr({
                 class: 'span2'
                 }).appendTo($row);
      $next_session_button = $('<a id="next_session_button" class="btn btn-success btn-large"> New WordBox</a>').appendTo($span2);
      $next_session_button.click(function () { window.location.replace("create_random_word_box") });
    }
    if (input["show_print"]) {
      $span2 = $('<div/>').attr({
                 class: 'span2'
                 }).appendTo($row);
      $print_button = $('<a id="print_button" class="btn btn-success btn-large"> Print </a>').appendTo($span2);
      $print_button.click(function () { print_box(); } );
    }
  }

  $table = $('<table/>').attr({
             id : 'fit_word_table'
           }).appendTo($span4);
  $tbody = $('<tbody/>').appendTo($table);
  var words_fit_array = Object.keys(words_fit);
  shuffle_words(words_fit_array);
  for (var i=0; i < words_fit_array.length; i++) {
    word = words_fit_array[i];
    $tr = $('<tr/>').appendTo($tbody);
    word_find_words_audio_types = find_words_audio_types[word];
    word_audio_type = null;
    if (word_find_words_audio_types) {
      if (word_find_words_audio_types.match(/american/)) {
        word_audio_type = 'american';
      }
      else {
        word_audio_type = 'british';
      }
    }
    $td_audio = null;
    if (input["show_audio"]) {
      if (!word_audio_type) {
        $td_audio = $('<td/>').appendTo($tr);
      }
      else {
        $td_audio = $('<td>' +
                   '<a class="example_mp3_file_audio" onclick="this.firstChild.play()">' +
                     '<audio class="example_mp3_file", src="/assets/audios/' + word.toLowerCase() + '_' + word_audio_type + '.mp3">' + '</audio>' +
                     '<img src="/assets/play_audio.png" width="20" height="20">' +
                   '</a>' +
                 '</td>').appendTo($tr);
      }
      $td_audio.attr({class: 'find_words_letter'});
    }
    $td = $('<td>' +
              '<h2>' + word + '</h2>' +
            '</td>').appendTo($tr);
    $td.attr({class: 'find_words_letter'});
    $tr.attr({id: 'fit_word_' + word});
  }
}

var finished = function(input)
{
  $('#show_all_button').hide();
  if (input["callback_fn"]) {
    $('#next_session_button').html('New Session');
    $('#next_session_button').show();
  }
  if (input["show_rearrange"]) {
    $('#rearrange_button').show();
  }
}

var show_all_words = function(input)
{
  if (show_all_button_timeout) {
    clearTimeout(show_all_button_timeout);
  }
  for (word in words_fit) {
    if (!words_fit[word].found) {
      var first_row = words_fit[word].start[0];
      var first_col = words_fit[word].start[1];
      var second_row = words_fit[word].is_row ? first_row : first_row + word.length - 1;
      var second_col = words_fit[word].is_row ? first_col + word.length - 1 : first_col;
      mark_found_word(word, first_row, first_col, second_row, second_col);
    }
  }
  finished(input);
}

var create_find_words_audio_type_hash = function(in_audios)
{
  for (var i = 0; i < find_words.length; i++) {
    var word = find_words[i];
    var audio_type = in_audios[i];
    find_words_audio_types[word] = audio_type;
  }
}

var rearrange_words = function(callback_fn)
{
  var largest_word_size = find_words[0].length;
  var word_box_size = largest_word_size > 10 ? largest_word_size : 10;
  words_fit.length = 0;
  for (word in words_fit) {
    words_fit[word].found = false;
  }
  n_words_done = 0;
  word_array = arrange_words(find_words, word_box_size);
  display_words(word_array, callback_fn);
  first_click = true;
}

var start_find_words = function(input)
{
  // in_words, in_word_array, in_words_fit, in_audios, display_help, display_msg, callback_fn)
  n_words_done = 0;
  if (input["in_words"]) {
    find_words = input["in_words"];
    find_words = find_words.map(function(inw) { return inw.toUpperCase(); });
    find_words = find_words.filter(function(inw) { return inw.length < 12 });

    find_words.sort(function(x, y) {
      return(y.length - x.length);
      });
    var largest_word_size = find_words[0].length;
    var word_box_size = largest_word_size > 10 ? largest_word_size : 10;
    word_array = arrange_words(find_words, word_box_size);
  }
  else {
    init_word_array(input["word_array"].length);
    words_fit = input["words_fit"];
    for (word in words_fit) {
      find_words.push(word);
    }
    word_array = input["word_array"];
  }
  if (input["show_audio"]) {
    create_find_words_audio_type_hash(input["audios"]);
  }
  display_words(word_array, input);
  first_click = true;
}
