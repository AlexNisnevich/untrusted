#BEGIN_PROPERTIES#
{
    "music": "Brazil"
}
#END_PROPERTIES#
/**************
 * credits.js *
 **************/

 function startLevel(map) {
    var credits = [
        [15, 1, "U N T R U S T E D"],
        [20, 2, "- or -"],
        [5, 3, "THE CONTINUING ADVENTURES OF DR. EVAL"],
        [1, 4, "{"],
        [1, 5, "a_game_by: 'Alex Nisnevich and Greg Shuflin',"],
        [1, 7, "special_thanks_to: {"],
        [5, 8, "Dmitry_Mazin: 'design and code',"],
        [5, 9, "Jordan_Arnesen: 'level design',"],
        [5, 10, "Natasha_HullRichter: 'playtesting'"],
        [3, 11, "},"],
        [1, 13, "music_by: "],
        [5, 14, "['Jonathan Holliday',"],
        [5, 15, "'Dmitry Mazin',"],
        [5, 16, "'Revolution Void',"],
        [5, 17, "'Fex',"],
        [5, 18, "'iNTRICATE',"],
        [5, 19, "'Tortue Super Sonic',"],
        [5, 20, "'Broke For Free',"],
        [5, 21, "'Sycamore Drive',"],
        [5, 22, "'Eric Skiff'],"],
        [30, 14, "'Mike and Alan',"],
        [30, 15, "'RoccoW',"],
        [30, 16, "'That Andy Guy',"],
        [30, 17, "'Obsibilo',"],
        [30, 18, "'Radio Scotvoid',"],
        [30, 19, "'Rolemusic',"],
        [30, 20, "'Seropard',"],
        [30, 21, "'Vernon Lenoir',"],
        [15, map.getHeight() - 2, "Thank_you: 'for playing!'}"]
    ];

    function drawCredits() {
        for (var i =credits.length-1; i >= 0; i--) {
            var cur = credits[i];
            var prev = (i > 0) ? credits[i-1] : null;
            map._display.drawText(cur[0], cur[1], cur[2]);
            if (prev) {
                map._display.drawText(prev[0], prev[1], prev[2]);
            }
        }
    }

    setTimeout(drawCredits, 4000);

#END_OF_START_LEVEL#
}
