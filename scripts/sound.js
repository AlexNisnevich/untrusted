function Sound() {
    this.tracks = {
        'Adversity': {
            path: "music/Adversity.wav",
            artist: "Seropard",
            title: "Adversity",
            url: "https://soundcloud.com/seropard"
        },
        'Beach Wedding Dance': {
            path: "music/Rolemusic_-_07_-_Beach_Wedding_Dance.mp3",
            artist: "Rolemusic",
            title: "Beach Wedding Dance",
            url: "https://soundcloud.com/rolemusic"
        },
        'Brazil': {
            path: "music/Vernon_Lenoir_-_Brazilicon_alley.mp3",
            artist: "Vernon Lenoir",
            title: "Brazilicon Alley",
            url: "http://vernonlenoir.wordpress.com/"
        },
        'Chip': {
            path: "music/ThatAndyGuy-Chip-loop.mp3",
            artist: "That Andy Guy",
            title: "Da Funk Do You Know 'bout Chip?",
            url: "https://soundcloud.com/that-andy-guy"
        },
        'cloudy_sin': {
            path: "music/intricate_cloudy_sin.mp3",
            artist: "iNTRICATE",
            title: "cloudy sin",
            url: "https://soundcloud.com/stk13"
        },
        'Come and Find Me': {
            path: "music/Eric_Skiff_-_09_-_Come_and_Find_Me_-_B_mix.mp3",
            artist: "Eric Skiff",
            title: "Come and Find Me",
            url: "http://ericskiff.com/"
        },
        'coming soon': {
            path: "music/Fex_coming_soon.mp3",
            artist: "Fex",
            title: "coming soon",
            url: "http://artistserver.com/Fex"
        },
        'Comme Des Orages': {
            path: "music/Obsibilo_-_02_-_Comme_Des_Orages.mp3",
            artist: "Obsibilo",
            title: "Comme Des Orages",
            url: "http://freemusicarchive.org/music/Obsibilo/"
        },
        'conspiracy': {
            path: "music/conspiracy_bitcrusher_final.mp3",
            artist: "Mike and Alan",
            title: "Conspiracy",
            url: "https://www.facebook.com/MicAndAlan"
        },
        'GameScratch': {
            path: "music/DmitryMazin-GameScratch.mp3",
            artist: "Dmitry Mazin",
            title: "Game Scratch",
            url: "https://soundcloud.com/dmitry-mazin"
        },
        'gurh': {
            path: "music/gurh.mp3",
            artist: "Dmitry Mazin",
            title: "gurh",
            url: "https://soundcloud.com/dmitry-mazin"
        },
        'Messeah': {
            path: "music/RoccoW_-_Messeah.mp3",
            artist: "RoccoW",
            title: "Messeah",
            url: "https://soundcloud.com/roccow"
        },
        'Night Owl': {
            path: "music/Broke_For_Free_-_01_-_Night_Owl.mp3",
            artist: "Broke for Free",
            title: "Night Owl",
            url: "http://brokeforfree.com/"
        },
        'Obscure Terrain': {
            path: "music/Revolution_Void_-_08_-_Obscure_Terrain.mp3",
            artist: "Revolution Void",
            title: "Obscure Terrain",
            url: "http://revolutionvoid.com/"
        },
        'Searching': {
            path: "music/Eric_Skiff_-_06_-_Searching.mp3",
            artist: "Eric Skiff",
            title: "Searching",
            url: "http://ericskiff.com/"
        },
        'Slimeball Vomit': {
            path: "music/Various_Artists_-_15_-_Slimeball_vomit.mp3",
            artist: "Radio Scotvoid",
            title: "Slimeball Vomit",
            url: "https://soundcloud.com/radio-scotvoid"
        },
        'Soixante-8': {
            path: "music/Obsibilo_-_Soixante-8.mp3",
            artist: "Obsibilo",
            title: "Soixante-8",
            url: "http://freemusicarchive.org/music/Obsibilo/"
        },
        'The Green': {
            path: "music/Yonnie_The_Green.mp3",
            artist: "Jonathan Holliday",
            title: "The Green",
            url: "http://www.soundclick.com/bands/default.cfm?bandID=836578"
        },
        'The_Waves_Call_Her_Name': {
            path: "music/Sycamore_Drive_-_03_-_The_Waves_Call_Her_Name.mp3",
            artist: "Sycamore Drive",
            title: "The Waves Call Her Name",
            url: "http://sycamoredrive.bandcamp.com/"
        },
        'Y': {
            path: "music/Tortue_Super_Sonic_-_11_-_Y.mp3",
            artist: "Tortue Super Sonic",
            title: "Y",
            url: "https://soundcloud.com/tss-tortue-super-sonic"
        }
    };

    this.defaultTracks = [
        'GameScratch',
        'Y',
        'Searching',
        'Soixante-8',
        'Come and Find Me'
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
            var track = this.tracks[name];
            $(this.bgPlayerElt).jPlayer('stop');
            $(this.bgPlayerElt).jPlayer("setMedia", {
                'mp3': track.path
            });
            $(this.bgPlayerElt).jPlayer('play');
            this.currentLevelNum = num;

            if (track.url) {
                var nowPlayingMsg = 'Now playing: "' + track.title + '" - <a target="_blank" href="' + track.url + '">' + track.artist + '</a>';
            } else {
                var nowPlayingMsg = 'Now playing: "' + track.title + '" - ' + track.artist;
            }
            $('#nowPlayingMsg').html(nowPlayingMsg);
        }
    };

    this.playTrackByNum = function (num) {
        this.playTrackByName(num, this.defaultTracks[(num - 1) % this.defaultTracks.length]);
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
