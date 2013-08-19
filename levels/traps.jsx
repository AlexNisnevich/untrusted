#BEGIN_PROPERTIES#
{
    "commandsIntroduced": ["map.setSquareColor"],
    "music": "Skizofonik_System"
}
#END_PROPERTIES#
/*
 * traps.js
 *
 * Look out! There are traps scattered all about this level, but
 * you don't know where they are. Tread carefully.
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

    for (var i = 0; i < 50; i++) {
        var x = getRandomInt(0, map.getWidth() - 1);
        var y = getRandomInt(0, map.getHeight() - 1);
        if (x != map.getWidth() - 1 && y != map.getHeight() - 1) {
            // don't place trap over exit!
            map.placeObject(x, y, 'trap', '#f00');
        }
#BEGIN_EDITABLE#

#END_EDITABLE#
    }

    map.placeObject(2, map.getHeight() - 1, 'exit');
}

function validateLevel(map) {
    validateAtLeastXObjects(map, 40, 'trap');
    validateExactlyXManyObjects(map, 1, 'exit');
}
