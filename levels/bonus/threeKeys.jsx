#BEGIN_PROPERTIES#
{
    "version": "0.1",
    "commandsIntroduced": []
}
#END_PROPERTIES#
/******************
 *  threeKeys.js  *
 * by paulcdejean *
 ******************
 * Here's the first non trivial level I was able to think of.
 * You can beat this without overwriting functions or any other
 * funny business so try and stay honest!
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.placePlayer(7, 5);

    // The basic level layout.
    for (var y = 0; y <= map.getHeight(); y++) {
        map.placeObject(16, y, 'block');
        map.placeObject(32, y, 'block');
    }

    for (var x = 17; x <= 31; x++) {
        map.placeObject(x, 7, 'block');
        map.placeObject(x, 17, 'block');
    }

    map.placeObject(24, 3, 'redKey');
    map.placeObject(24, 12, 'greenKey');
    map.placeObject(24, 21, 'blueKey');

    map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');

#BEGIN_EDITABLE#
    // You might find this useful.
    map.placeObject(8, 6, 'phone');
#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    // No creating exits!
    map.validateExactlyXManyObjects(1, 'exit');

    // No cheating please!
    map.validateExactlyXManyObjects(0, 'theAlgorithm');

    // You need to pick up the keys, not create them.
    map.validateAtMostXObjects(1, 'redKey');
    map.validateAtMostXObjects(1, 'greenKey');
    map.validateAtMostXObjects(1, 'blueKey');

    // This is the puzzle :)
    map.validateAtMostXDynamicObjects(3);
}


function onExit(map) {
    if (!map.getPlayer().hasItem('redKey')
        || !map.getPlayer().hasItem('greenKey')
        || !map.getPlayer().hasItem('blueKey')) {
        map.writeStatus("Collect all 3 keys before exiting!");
        return false;
    } else {
        return true;
    }
}
