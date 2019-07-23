#BEGIN_PROPERTIES#
{
    "version": "1.3.0",
    "music": "Brazil",
    "mapProperties": {
        "showDrawingCanvas": "true"
    },
    "commandsIntroduced": [
            "canvas.fillStyle",
            "canvas.fillText",
            "map.timeout"
    ]
}
#END_PROPERTIES#
/**************
 * credits.js *
 *************
 *
 * Congratulations! Dr. Eval has successfully escaped from the
 * Machine Continuum with the Algorithm in hand.
 *
 * Give yourself a pat on the back. You are one clever hacker.
 *
 *
 *
 * Hungry for more?
 *
 * Check out Untrusted's github repository at
 *      https://github.com/AlexNisnevich/untrusted
 *
 * Perhaps try your hand at making your own level or two!
 *
 * Like what you've been hearing? You can listen to the full
 * soundtrack at
 *      https://soundcloud.com/untrusted
 *
 * Feel free to drop us a line at [
 *      'alex [dot] nisnevich [at] gmail [dot] com',
 *      'greg [dot] shuflin [at] gmail [dot] com'
 * ]
 *
 * Once again, congratulations!
 *
 *             -- Alex and Greg
 */

function startLevel(map) {
#START_OF_START_LEVEL#
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
        var ctx = map.getCanvasContext();
        ctx.fillStyle = "#ccc";
        var line = credits[i];
        var coords = map.getCanvasCoords(line[0],line[1]);
        ctx.fillText(line[2],coords.x, coords.y)
        map.timeout(function () {drawCredits(i+1);}, 2000)
    }

    map.timeout(function () {drawCredits(0);}, 4000);

#END_OF_START_LEVEL#
}
