#BEGIN_PROPERTIES#
{
    "music": "Yonnie_The_Green"
}
#END_PROPERTIES#
function startLevel(map) {
    var credits = [
    	[15, 1, "U N T R U S T E D"],
    	[20, 2, "- or -"],
    	[5, 3, "THE CONTINUING ADVENTURES OF DR. EVAL"],
    	[1, 5, "a game by Alex Nisnevich and Greg Shuflin"],
    	[1, 8, "/* MUSIC */"],
    	[1, 10, "Game Scratch - Dmitry Mazin (w/ permission)"],
    	[1, 11, "Zero_One - Jackson D. (CC-BY-NC-ND)"],
    	[1, 12, "intricate - cloudy sin (CC-BY-NC-ND)"],
    	[1, 13, "System - Skizofonik (CC-BY-NC-ND)"],
    	[1, 14, "Sunset 84 - Spectrofuzz (CC-BY-ND)"],
        [1, 15, "Beach Wedding Dance - Rolemusic (CC-BY-NC-SA)"],
    	[1, 16, "The Green - Yonnie (CC-BY-ND)"],
    	[15, map.getHeight() - 2, "Thank you for playing!"]
    ];

    for (var i = 0; i < credits.length; i++) {
    	setTimeout(function (i) {
    		display.drawText(credits[i][0], credits[i][1], credits[i][2]);
    	}, (i + 1) * 2000, i);
    }
}
