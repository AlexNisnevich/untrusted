function Sound() {
	this.tracks = [
		"music/DmitryMazin-GameScratch.mp3",
		"music/Tortue_Super_Sonic_-_11_-_Y.mp3",
		"music/Eric_Skiff_-_06_-_Searching.mp3",
		"music/Eric_Skiff_-_09_-_Come_and_Find_Me_-_B_mix.mp3"
	];

	this.bgPlayerElt = $("#jquery_bgPlayer");
	this.soundPlayerElt = $("#jquery_soundPlayer");
	this.muted = false;
	this.currentLevelNum = -1;

	this.init = function() {
		var sound = this;

		this.bgPlayerElt.jPlayer({
			wmode: "window",
			loop: true,
			swfPath: "lib/Jplayer.swf",
			volume: 0.6
		});
		this.soundPlayerElt.jPlayer({
			wmode: "window",
			loop: false,
			supplied: 'wav',
			swfPath: "lib/Jplayer.swf"
		});

		$(window).focus(function () {
			$(sound.bgPlayerElt).jPlayer('play');
		}).blur(function () {
			$(sound.bgPlayerElt).jPlayer('pause');
		});
	};

	this.playTrackByName = function (num, name) {
		if (num !== this.currentLevelNum) {
			$(this.bgPlayerElt).jPlayer('stop');
			$(this.bgPlayerElt).jPlayer("setMedia", {
				'mp3': 'music/' + name + '.mp3'
			});
			$(this.bgPlayerElt).jPlayer('play');
			this.currentLevelNum = num;
		}
	};

	this.playTrackByNum = function (num) {
		if (num !== this.currentLevelNum) {
			$(this.bgPlayerElt).jPlayer('stop');
			$(this.bgPlayerElt).jPlayer("setMedia", {
				'mp3': this.tracks[(num - 1) % this.tracks.length]
			});
			$(this.bgPlayerElt).jPlayer('play');
			this.currentLevelNum = num;
		}
	};

	this.playSound = function (name) {
		$(this.soundPlayerElt).jPlayer('stop');
		$(this.soundPlayerElt).jPlayer("setMedia", {
			'wav': 'sound/' + name + '.wav'
		});
		$(this.soundPlayerElt).jPlayer('play');
	};

	this.toggleSound = function() {
		if (this.muted) {
			this.bgPlayerElt.jPlayer('unmute');
			this.soundPlayerElt.jPlayer('unmute');
			$("#muteButton img").attr('src', 'images/mute-off.png');
		} else {
			this.bgPlayerElt.jPlayer('mute');
			this.soundPlayerElt.jPlayer('mute');
			$("#muteButton img").attr('src', 'images/mute-on.png');
		}
		this.muted = !this.muted;
	};

	// constructor
	this.init();
}
