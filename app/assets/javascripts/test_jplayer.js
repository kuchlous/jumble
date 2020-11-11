$(document).ready(function() {

  $("#jquery_jplayer_1").jPlayer({
    ready: function(event) {
      alert("Reached here");
      $(this).jPlayer("setMedia", {
        mp3: "/assets/audios/whistle_american.mp3",
      });
      $(this).jPlayer("play");
    },
    swfPath: "/assets/",
    supplied: "mp3"
  });
});
