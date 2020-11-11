var row_to_reveal = 1;
$(document).ready(function() {
    $(".table_row").hide();
    interval_id = setInterval(function () {
      $("#row"+row_to_reveal).show("slow");
      row_to_reveal += 1;
      if (row_to_reveal > 10) {
        clearInterval(interval_id);
      }
    }, 5000);
})

