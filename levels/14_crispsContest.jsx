#BEGIN_PROPERTIES#
{

}
#END_PROPERTIES#

/********************
 * crispsContest.js *
 ********************
 *
 * Do you remember, dear Professor, a certain introductary class you taught long ago?
 * Perhaps some 'reeducation' is apropos.
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

    map.defineObject('yellowLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': 'yellow',
        'selfDestructsWhenPassedThrough': true,
        'impassable': function (player) {
            if (player.hasItem('yellowLock')) {
                player.removeItem('yellowLock');
                return false;
            } else {
                return true;
            }
        }
    });

    var grid = [
        [0, 4, 'block'],
        [0, 5, 'block'],
        [0, 6, 'block'],
        [0, 7, 'block'],
        [0, 8, 'block'],
        [0, 9, 'block'],
        [0, 10, 'block'],
        [1, 4, 'block'],
        [1, 7, 'block'],
        [1, 10, 'block'],
        [2, 1, 'block'],
        [2, 2, 'block'],
        [2, 3, 'block'],
        [2, 4, 'block'],
        [2, 7, 'block'],
        [2, 10, 'block'],
        [3, 1, 'block'],
        [3, 4, 'block'],
        [3, 7, 'block'],
        [3, 10, 'block'],
        [4, 1, 'block'],
        [4, 4, 'block'],
        [4, 5, 'blueLock'],
        [4, 6, 'block'],
        [4, 7, 'block'],
        [4, 8, 'block'],
        [4, 9, 'redLock'],
        [4, 10, 'block'],
        [4, 11, 'block'],
        [4, 12, 'block'],
        [4, 13, 'block'],
        [4, 14, 'block'],
        [5, 1, 'block'],
        [5, 4, 'greenLock'],
        [5, 10, 'block'],
        [5, 14, 'block'],
        [6, 1, 'block'],
        [6, 2, 'block'],
        [6, 3, 'block'],
        [6, 4, 'block'],
        [6, 10, 'yellowLock'],
        [6, 14, 'block'],
        [7, 2, 'block'],
        [7, 3, 'exit'],
    //  [7, 7, 'player'],
        [7, 10, 'block'],
        [7, 11, 'block'],
        [7, 12, 'block'],
        [7, 13, 'block'],
        [7, 14, 'block'],
        [8, 1, 'block'],
        [8, 2, 'block'],
        [8, 3, 'block'],
        [8, 4, 'block'],
        [8, 10, 'yellowLock'],
        [8, 14, 'block'],
        [9, 1, 'block'],
        [9, 4, 'greenLock'],
        [9, 10, 'block'],
        [9, 14, 'block'],
        [10, 1, 'block'],
        [10, 4, 'block'],
        [10, 5, 'redLock'],
        [10, 6, 'block'],
        [10, 7, 'block'],
        [10, 8, 'block'],
        [10, 9, 'blueLock'],
        [10, 10, 'block'],
        [10, 11, 'block'],
        [10, 12, 'block'],
        [10, 13, 'block'],
        [10, 14, 'block'],
        [11, 1, 'block'],
        [11, 4, 'block'],
        [11, 7, 'block'],
        [11, 10, 'block'],
        [12, 1, 'block'],
        [12, 2, 'block'],
        [12, 3, 'block'],
        [12, 4, 'block'],
        [12, 7, 'block'],
        [12, 10, 'block'],
        [13, 4, 'block'],
        [13, 7, 'block'],
        [13, 10, 'block'],
        [14, 4, 'block'],
        [14, 5, 'block'],
        [14, 6, 'block'],
        [14, 7, 'block'],
        [14, 8, 'block'],
        [14, 9, 'block'],
        [14, 10, 'block']
    ];

    map.placePlayer(20, 10);

    grid.forEach(function (obj) {
        map.placeObject(obj[0] + 13, obj[1] + 3, obj[2]);
    });

}

function onExit(map) {
    if (!map.getPlayer().hasItem('algorithm')) {
        map.writeStatus("We need to get the Algorithm!");
        return false;
    } else {
        return true;
    }
}
