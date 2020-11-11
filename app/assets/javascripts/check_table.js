var check_answer = function(e) 
{
  var $this = $(this); 
  e.preventDefault();
  var $input = $this.find('.times_table_input');
  var answer = $input.val();
  answer = answer.replace(/^\s+|\s+$/g,"");
  var multiplicand = problems[row_to_reveal].multiplicand;
  var multiplier = problems[row_to_reveal].multiplier;
  var product = multiplier * multiplicand;
  var is_divide = problems[row_to_reveal].is_divide > 0 ? true : false;
  if (is_divide) {
    correct_answer = multiplier;
  }
  else {
    correct_answer = product;
  }
  if (answer == correct_answer) {
    $this.html("<span class=\"correct_answer\">" +  answer + "</span>");
  }
  else {
    $this.html("<span class=\"wrong_answer\">" +  answer + "</span>" + "<span class=\"correct_answer\">" + correct_answer + "</span>");
  }

  row_to_reveal += 1;
  if (row_to_reveal % 10 == 0) {
    $("#continue-button").show();
  }
  else {
    reveal_row(row_to_reveal);
  }
}

var continue_button_press = function()
{
    $("#continue-button").hide();
    $(".table_row").hide();
    for (var i=0; i<10; i++) {
      var $form = $("#form"+i);
      $form.html('<input class="input-mini times_table_input" autocomplete="off" id="input' + i + '" type="text">');
    }
    reveal_row(row_to_reveal);
}

var reveal_row = function(row_no)
{
  var multiplicand = problems[row_no].multiplicand;
  var multiplier = problems[row_no].multiplier;
  var is_divide = problems[row_no].is_divide > 0 ? true : false;
  var product = multiplier * multiplicand;

  var display_row = row_no % 10;
  if (is_divide) {
    $("#tnumber"+display_row).html(product);
    $("#operation"+display_row).html("&divide;");
    $("#multiplier"+display_row).html(multiplicand);
  }
  else {
    $("#tnumber"+display_row).html(multiplicand);
    $("#operation"+display_row).html("X");
    $("#multiplier"+display_row).html(multiplier);
  }
  $("#row"+display_row).show("slow");
  var $form = $("#form"+display_row);
  $form.submit(check_answer);
  var $input = $form.find('.times_table_input');
  $input.focus();
}

var shuffle_words = function(words) {
  var n = words.length;
  for (var i = n - 1; i > 0; i --) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = words[i];
    words[i] = words[j];
    words[j] = tmp;
  }
}

var problems = [];
var prepare_table = function(num)
{
  for (var i=2; i<=10; i++) {
    for (var j=2; j<=num; j++) {
      problem = new Object();
      problem.multiplier = i;
      problem.multiplicand = j;
      problem.is_divide = Math.floor(Math.random() * 2);
      problems.push(problem);
    }
  }
  shuffle_words(problems);
}

var row_to_reveal = 0;
$(document).ready(function() {
    $("#continue-button").click(continue_button_press);
    prepare_table(tnumber);
    continue_button_press();
//    $(".table_row").hide();
//    $("#continue-button").hide();
//    reveal_row(row_to_reveal);
})

