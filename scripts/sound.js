function Sound() {
	var tracks = [
		"/music/DmitryMazin-GameScratch.mp3",
		"/music/Jackson_D_Zero_One.mp3",
		"/music/what.mp3"
	]
	var soundPlayerElt = $("#jquery_audioPlayer");
	var muted = false;

	this.init = function() {
		soundPlayerElt.jPlayer({
			ready: function() {
				$(this).jPlayer("setMedia", {
					mp3: tracks[0]
				});
			},
			wmode: "window",
			loop: true,
			swfPath: "/lib/Jplayer.swf",
		    canplay: function() {
		       soundPlayerElt.jPlayer("play");
		    }
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
