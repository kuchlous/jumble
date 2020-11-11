$(document).ready(function() {
  browserName = navigator.appName;
  if (browserName.match(/Explorer/)) {
    $('#browser-error').show();
    $("#content").hide();
  } else {
    $('#browser-error').hide();
  }
})
