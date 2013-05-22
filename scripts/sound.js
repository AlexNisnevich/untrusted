function Sound() {
	var tracks = [
		"/music/what.mp3"
	]
	var soundPlayerElt = $("#jquery_audioPlayer");
	var muted = false;

	this.init = function() {
		soundPlayerElt.jPlayer({
			ready: function() {
			  $(this).jPlayer("setMedia", {
			    mp3: tracks[0]
			  }).jPlayer("play");
			  var click = document.ontouchstart === undefined ? 'click' : 'touchstart';
			  var kickoff = function () {
			    soundPlayerElt.jPlayer("play");
			    document.documentElement.removeEventListener(click, kickoff, true);
			  };
			  document.documentElement.addEventListener(click, kickoff, true);
			},
			loop: true,
			swfPath: "/lib/Jplayer.swf"
		});
	}

	this.toggleSound = function() {
		if (muted) {
			soundPlayerElt.jPlayer('unmute');
			$("#muteButton img").attr('src', 'images/mute-off.gif');
		} else {
			soundPlayerElt.jPlayer('mute');
			$("#muteButton img").attr('src', 'images/mute-on.gif');
		}
		muted = !muted;
	}

	// constructor
	this.init();
}
