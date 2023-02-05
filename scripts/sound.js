function Sound(source) {
    this.tracks = {
        'Adversity': {
            path: "music/Adversity.mp3",
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
        'BossLoop': {
            path: "music/Boss Loop 1.mp3",
            artist: "Essa",
            title: "Boss Loop 1",
            url: "http://www.youtube.com/user/Essasmusic"
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
        'Death Destroyer': {
            path: "music/BLEO_-_02_-_Death_Destroyer_Radio_Edit_feat_Rhinostrich.mp3",
            artist: "BLEO feat Rhinostrich",
            title: "Death Destroyer (Radio Edit)",
            url: "http://bleo.dummydrome.com/"
        },
        'GameScratch': {
            path: "music/DmitryMazin-GameScratch.mp3",
            artist: "Dmitry Mazin",
            title: "Dynamic Punctuality",
            url: "https://soundcloud.com/dmitry-mazin"
        },
        'gurh': {
            path: "music/gurh.mp3",
            artist: "Dmitry Mazin",
            title: "Dmitry's Thing #2",
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
        'Tart': {
            path: "music/BLEO_-_02_-_Tart_Pts_1__2_feat_KeFF.mp3",
            artist: "BLEO feat KeFF",
            title: "Tart (Pts 1-2)",
            url: "http://bleo.dummydrome.com/"
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

    this.defaultTracks = [ // (not currently used, as all levels now have explicit tracks)
        'GameScratch',
        'Y',
        'Searching',
        'Soixante-8',
        'Come and Find Me'
    ];

    this.sources = {
        'local': '',
        'cloudfront': 'http://dk93t8qfl63bu.cloudfront.net/'
    };

    this.bgPlayerElt = $("#jquery_bgPlayer");
    this.soundPlayerElt = $("#jquery_soundPlayer");
    this.muted = false;
    this.currentLevelNum = -1;

    this.init = function() {
        var sound = this;

        this.source = this.sources[source];

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

    this.playTrackByName = function (name) {
        this.trackForLevel = name;

        var track = this.tracks[name];
        if (track.url) {
            var nowPlayingMsg = 'Now playing: "' + track.title + '" - <a target="_blank" draggable="false" href="' + track.url + '">' + track.artist + '</a>';
        } else {
            var nowPlayingMsg = 'Now playing: "' + track.title + '" - ' + track.artist;
        }
        $('#nowPlayingMsg').html(nowPlayingMsg);

        if (!this.muted && this.currentlyPlayingTrack !== name) {
            var path = this.source + track.path;
            $(this.bgPlayerElt).jPlayer('stop');
            $(this.bgPlayerElt).jPlayer("setMedia", {
                'mp3': path
            });
            $(this.bgPlayerElt).jPlayer('play');

            this.currentlyPlayingTrack = name;
        }
    };

    this.playTrackByNum = function (num) {
        this.playTrackByName(this.defaultTracks[(num - 1) % this.defaultTracks.length]);
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
            this.muted = false;
            this.playTrackByName(this.trackForLevel);
        } else {
            this.bgPlayerElt.jPlayer('mute');
            this.soundPlayerElt.jPlayer('mute');
            $("#muteButton img").attr('src', 'images/mute-on.png');
            this.muted = true;
        }
    };

    // constructor
    this.init();
}
