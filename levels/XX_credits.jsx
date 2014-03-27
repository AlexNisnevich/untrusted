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
        [1, 5, "a game by Alex Nisnevich and Greg Shuflin"],
        [1, 7, "Special thanks to {"],
        [5, 8, "Dmitry_Mazin: 'design and code'"],
        [5, 9, "Jordan_Arnesen: 'level design'"],
        [5, 10, "Natasha_HullRichter: 'playtesting'"],
        [1, 11, "}"],
        [1, 13, "/* MUSIC BY */"],
        [5, 14, "Jonathan Holliday"],
        [5, 15, "Dmitry Mazin"],
        [5, 16, "Revolution Void"],
        [5, 17, "Fex"],
        [5, 18, "iNTRICATE"],
        [5, 19, "Tortue Super Sonic"],
        [5, 20, "Broke For Free"],
        [5, 21, "Sycamore Drive"],
        [5, 22, "Eric Skiff"],
        [30, 14, "Mike and Alan"],
        [30, 15, "RoccoW"],
        [30, 16, "That Andy Guy"],
        [30, 17, "Obsibilo"],
        [30, 18, "Radio Scotvoid"],
        [30, 19, "Rolemusic"],
        [30, 20, "Seropard"],
        [30, 21, "Vernon Lenoir"],
        [15, map.getHeight() - 2, "Thank you for playing!"]
    ];

    for (var i = 0; i < credits.length; i++) {
        setTimeout(function (i) {
            map._display.drawText(credits[i][0], credits[i][1], credits[i][2]);
        }, (i + 2) * 2000, i);
    }
#END_OF_START_LEVEL#
}
