#BEGIN_PROPERTIES#
{
    "commandsIntroduced": ["map.setSquareColor"],
    "music": "intricate_cloudy_sin"
}
#END_PROPERTIES#
/******************
 * minesweeper.js *
 ******************
 *
 * So much for Asimov's Laws. They're actually trying to kill
 * you now. Not to be alarmist, but the floor is littered
 * with mines. Rushing for the exit blindly may be unwise.
 * I need you alive, after all.
 *
 * If only there was some way you could track the positions
 * of the mines ...
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
    for (x = 0; x < map.getWidth(); x++) {
        for (y = 0; y < map.getHeight(); y++) {
            map.setSquareColor(x, y, '#f00');
        }
    }

    map.placePlayer(map.getWidth() - 5, 5);

    for (var i = 0; i < 75; i++) {
        var x = getRandomInt(0, map.getWidth() - 1);
        var y = getRandomInt(0, map.getHeight() - 1);
        if (x != 2 || y != map.getHeight() - 1) {
            // don't place mine over exit!
            map.placeObject(x, y, 'mine', '#f00');
#BEGIN_EDITABLE#

#END_EDITABLE#
        }
    }

    map.placeObject(2, map.getHeight() - 1, 'exit');
}

function validateLevel(map) {
    map.validateAtLeastXObjects(40, 'mine');
    map.validateExactlyXManyObjects(1, 'exit');
}
