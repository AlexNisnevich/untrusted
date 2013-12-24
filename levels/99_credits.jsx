#BEGIN_PROPERTIES#
{
    "music": "Vernon_Lenoir_-_Brazilicon_alley"
}
#END_PROPERTIES#
function startLevel(map) {
    var credits = [
    	[15, 2, "U N T R U S T E D"],
    	[20, 3, "- or -"],
    	[5, 4, "THE CONTINUING ADVENTURES OF DR. EVAL"],
    	[1, 6, "a game by Alex Nisnevich and Greg Shuflin"],
    	[1, 9, "/* MUSIC */"],
        [1, 11, "The Green - Jonathan Holliday"],
    	[1, 12, "Game Scratch - Dmitry Mazin"],
    	[1, 13, "Y - Tortue Super Sonic"],
    	[1, 14, "Come and Find Me - Eric Skiff"],
    	[1, 15, "Searching - Eric Skiff"],
        [1, 16, "The Waves Call Her Name - Sycamore Drive"],
        [1, 17, "Slimeball Vomit - Radio Scotvoid"],
        [1, 18, "Beach Wedding Dance - Rolemusic"],
    	[1, 19, "Brazilian Rhythm - Vernon Lenoir"],
    	[15, map.getHeight() - 2, "Thank you for playing!"]
    ];

    for (var i = 0; i < credits.length; i++) {
    	setTimeout(function (i) {
    		display.drawText(credits[i][0], credits[i][1], credits[i][2]);
    	}, (i + 2) * 2000, i);
    }
}
