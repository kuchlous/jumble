var check_answer = function(e) 
{
  var $this = $(this); 
  e.preventDefault();
  var $input = $this.find('.times_table_input');
  var answer = $input.val();
  answer = answer.replace(/^\s+|\s+$/g,"");
  correct_answer = tnumber * row_to_reveal;
  if (answer == correct_answer) {
    $this.html("<span class=\"correct_answer\">" +  answer + "</span>");
  }
  else {
    $this.html("<span class=\"wrong_answer\">" +  answer + "</span>" + "<span class=\"correct_answer\">" + correct_answer + "</span>");
  }
  row_to_reveal += 1;
  reveal_row(row_to_reveal);
}

var reveal_row = function(row_no)
{
  $("#row"+row_to_reveal).show("slow");
  var $form = $("#form"+row_to_reveal);
  $form.submit(check_answer);
  var $input = $form.find('.times_table_input');
  $input.focus();
}

var row_to_reveal = 1;
$(document).ready(function() {
    $(".table_row").hide();
    reveal_row(row_to_reveal);
})

