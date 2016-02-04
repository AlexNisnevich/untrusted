#BEGIN_PROPERTIES#
{
    "version": "0.1000002",
    "commandsIntroduced":
    [ ],
        "music": "gurh"
}
#END_PROPERTIES#
/*******************
 * 102_noWayOut.js *
 * by AGoliath     *
 *******************
 *
 *  Who builds a wall in a room anyway?
 *
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Challenge 2\nTear down this wall!');

    map.placePlayer(7, 5);

    var buildWall = function() {
        for (var i= 0; i <= map.getHeight(); i++)  map.placeObject(map.getWidth()-10, i, 'block');
    }

#BEGIN_EDITABLE#

#END_EDITABLE#

        buildWall();
        map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');
#END_OF_START_LEVEL#
}

function onExit(map) {
           return true;
}


function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
