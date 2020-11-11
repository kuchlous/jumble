// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Users');
  data.addColumn('number', 'Active Users');
  data.addRows(user_table);

  // Set chart options
  var options = {'title':'Users',
                 'width':1200,
                 'height':300};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.ColumnChart(document.getElementById('user_chart_div'));
  chart.draw(data, options);

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Sessions');
  data.addRows(session_table);

  // Set chart options
  var options = {'title':'Sessions',
                 'width':1200,
                 'height':300};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.ColumnChart(document.getElementById('session_chart_div'));
  chart.draw(data, options);
}
