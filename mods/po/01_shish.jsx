#BEGIN_PROPERTIES#
{
    "version": "1.0",
    "commandsIntroduced":
        ["global.startLevel", "global.onExit", "map.placePlayer",
         "map.placeObject", "map.getHeight", "map.getWidth",
         "map.displayChapter", "map.getPlayer", "player.hasItem"],
    "music": "The Green"
}
#END_PROPERTIES#
/*****************
 * shish.js *
 *****************
 *
 * BREAK OUT! MAN!
 *
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Chapter 1\nUne assiette mixte svp');

    map.placePlayer(14, 12);

    for (x = 0; x < map.getWidth(); x++) {
		if ((x % 10) < 5 ) {
        	map.placeObject(x, 5, 'block');
		} else {
        	map.placeObject(x, 7, 'block');
			for (y = 0; y < 3; y ++) {
	        	map.placeObject(x, 7 - y, 'block');				
			}
		}
        map.placeObject(x, 10, 'block');
    }

#BEGIN_EDITABLE#

#END_EDITABLE#

    map.placeObject(15, 12, 'computer');
    map.placeObject(25, 0, 'exit');
#END_OF_START_LEVEL#
}

function onExit(map) {
    if (!map.getPlayer().hasItem('computer')) {
        map.writeStatus("Don't forget to pick up the computer!");
        return false;
    } else {
        return true;
    }
}
