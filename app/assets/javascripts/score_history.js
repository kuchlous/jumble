// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Stars');
  data.addRows(score_table);
  // data.addRows([
  //   ['Mushrooms', 3],
  //   ['Onions', 1],
  //   ['Olives', 1],
  //   ['Zucchini', 1],
  //   ['Pepperoni', 2]
  // ]);

  // Set chart options
  var options = {'title':'Stars History',
                 'width':800,
                 'height':300};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
