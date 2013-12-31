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

    map.createFromGrid(
        [' +++ ',
         ' +@+ ',
         ' +E+ ',
         ' +++ '],
    {
        '@': 'player',
        'E': 'exit',
        '+': 'block'
    }, 15, 10);
}
