#BEGIN_PROPERTIES#
{
    "version": "1.0",
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
        [2, 5, "a_game_by: 'Alex Nisnevich and Greg Shuflin',"],
        [2, 7, "special_thanks_to: {"],
        [5, 8, "Dmitry_Mazin: ['design', 'code'],"],
        [5, 9, "Jordan_Arnesen: ['levels', 'playtesting'],"],
        [5, 10, "Natasha_HullRichter: ['levels','playtesting']"],
        [2, 11, "},"],
        [2, 13, "music_by: "],
        [4, 14, "['Jonathan Holliday',"],
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
        [30, 18, "'BLEO',"],
        [30, 19, "'Rolemusic',"],
        [30, 20, "'Seropard',"],
        [30, 21, "'Vernon Lenoir',"],
        [15, map.getHeight() - 2, "Thank_you: 'for playing!'"],
        [1, map.getHeight() - 1, "}"]
    ];

    function drawCredits(i) {
        if (i >= credits.length) {
            return;
        }

        // redraw lines bottom to top to avoid cutting off letters
        for (var j = i; j >= 0; j--) {
            var line = credits[j];
            map._display.drawText(line[0], line[1], line[2]);
        }

        setTimeout(function () {drawCredits(i+1);}, 2000)
    }

    setTimeout(function () {drawCredits(0);}, 4000);

#END_OF_START_LEVEL#
}
