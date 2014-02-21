#BEGIN_PROPERTIES#
{
    "music": "Vernon_Lenoir_-_Brazilicon_alley"
}
#END_PROPERTIES#
function startLevel(map) {
    var credits = [
        [15, 1, "U N T R U S T E D"],
        [20, 2, "- or -"],
        [5, 3, "THE CONTINUING ADVENTURES OF DR. EVAL"],
        [1, 5, "a game by Alex Nisnevich and Greg Shuflin"],
        [1, 8, "/* MUSIC */"],
        [1, 10, "The Green - Jonathan Holliday"],
        [1, 11, "Game Scratch - Dmitry Mazin"],
        [1, 12, "Y - Tortue Super Sonic"],
        [1, 13, "Come and Find Me - Eric Skiff"],
        [1, 14, "Searching - Eric Skiff"],
        [1, 15, "cloudy sin - intricate"],
        [1, 16, "The Waves Call Her Name - Sycamore Drive"],
        [1, 17, "Slimeball Vomit - Radio Scotvoid"],
        [1, 18, "Beach Wedding Dance - Rolemusic"],
        [1, 19, "Brazilian Rhythm - Vernon Lenoir"],
        [1, 20, "Soixante-8 - Obsibilo"],
        [1, 21, "Da Funk Do You Know 'bout Chip? - That Andy Guy"],
        [15, map.getHeight() - 2, "Thank you for playing!"]
    ];

    for (var i = 0; i < credits.length; i++) {
        setTimeout(function (i) {
            map._display.drawText(credits[i][0], credits[i][1], credits[i][2]);
        }, (i + 2) * 2000, i);
    }
#END_OF_START_LEVEL#
}
