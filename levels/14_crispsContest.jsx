#BEGIN_PROPERTIES#
{
    "music": "ThatAndyGuy-Chip"
}
#END_PROPERTIES#
/********************
 * crispsContest.js *
 ********************
 *
 */

function startLevel(map) {
    map.defineObject('redLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': 'red',
        'selfDestructsWhenPassedThrough': true,
        'impassable': function (player) {
            if (player.hasItem('redKey')) {
                player.removeItem('redKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('greenLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': '#0f0',
        'selfDestructsWhenPassedThrough': true,
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
                player.removeItem('greenKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('blueLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': '#06f',
        'selfDestructsWhenPassedThrough': true,
        'impassable': function (player) {
            if (player.hasItem('blueKey')) {
                player.removeItem('blueKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.placePlayer(20, 10);
    map.placeObject(20, 6, 'exit');

    map.placeObject(20, 12, 'blueLock');

    for (var x = 17; x <= 23; x++) {
        map.placeObject(x, 7, 'block');
        map.placeObject(x, 13, 'block');
    }

    for (var y = 7; y <= 13; y++) {
        map.placeObject(17, y, 'block');
        map.placeObject(23, y, 'block');
    }

}

#BEGIN_EDITABLE#
#END_EDITABLE#
