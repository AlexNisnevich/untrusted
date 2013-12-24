function Sound() {
	var tracks = [
		"music/DmitryMazin-GameScratch.mp3",
		"music/Tortue_Super_Sonic_-_11_-_Y.mp3",
		"music/Eric_Skiff_-_06_-_Searching.mp3",
		"music/Eric_Skiff_-_09_-_Come_and_Find_Me_-_B_mix.mp3"
	];

	var bgPlayerElt = $("#jquery_bgPlayer");
	var soundPlayerElt = $("#jquery_soundPlayer");
	var muted = false;
	var currentLevelNum = -1;

	this.init = function() {
		bgPlayerElt.jPlayer({
			wmode: "window",
			loop: true,
			swfPath: "lib/Jplayer.swf"
		});
		soundPlayerElt.jPlayer({
			wmode: "window",
			loop: false,
			supplied: 'wav',
			swfPath: "lib/Jplayer.swf"
		});
	}

	this.playTrackByName = function (num, name) {
		if (num != this.currentLevelNum) {
			$(bgPlayerElt).jPlayer('stop');
			$(bgPlayerElt).jPlayer("setMedia", {
				'mp3': 'music/' + name + '.mp3'
			});
			$(bgPlayerElt).jPlayer('play');
			this.currentLevelNum = num;
		}
	}

	this.playTrackByNum = function (num) {
		if (num != this.currentLevelNum) {
			$(bgPlayerElt).jPlayer('stop');
			$(bgPlayerElt).jPlayer("setMedia", {
				'mp3': tracks[(num - 1) % tracks.length]
			});
			$(bgPlayerElt).jPlayer('play');
			this.currentLevelNum = num;
		}
	}

	this.playSound = function (name) {
		$(soundPlayerElt).jPlayer('stop');
		$(soundPlayerElt).jPlayer("setMedia", {
			'wav': 'sound/' + name + '.wav'
		});
		$(soundPlayerElt).jPlayer('play');
	}

	this.toggleSound = function() {
		if (muted) {
			bgPlayerElt.jPlayer('unmute');
			soundPlayerElt.jPlayer('unmute');
			$("#muteButton img").attr('src', 'images/mute-off.png');
		} else {
			bgPlayerElt.jPlayer('mute');
			soundPlayerElt.jPlayer('mute');
			$("#muteButton img").attr('src', 'images/mute-on.png');
		}
		muted = !muted;
	}

	// constructor
	this.init();
}
