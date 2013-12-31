#BEGIN_PROPERTIES#
{
    "music": "ThatAndyGuy-Chip"
}
#END_PROPERTIES#
/********************
 * crispsContest.js *
 ********************
 *
 *
 */

function startLevel(map) {
    map.defineObject('redLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': 'red',
        'impassable': function (player) {
            if (player.hasItem('redKey')) {
                player.removeItem('redKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('blueLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': '#06f',
        'impassable': function (player) {
            if (player.hasItem('blueKey')) {
                player.removeItem('blueKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('greenLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': '#0f0',
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
#BEGIN_EDITABLE#
                player.removeItem('greenKey');
#END_EDITABLE#
                return false;
            } else {
                return true;
            }
        }
    });

    map.defineObject('yellowLock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': 'yellow',
        'impassable': function (player) {
            if (player.hasItem('yellowKey')) {
                player.removeItem('yellowKey');
                return false;
            } else {
                return true;
            }
        }
    });

    map.createFromGrid(
       ['  +++++ +++++  ',
        '  + b +++ r +  ',
        '  +   +E+   +  ',
        '+++G+B+ +R+G+++',
        '+ y B     R b +',
        '+   +     +   +',
        '+++++  @  +++++',
        '+   +     +   +',
        '+ y R     B y +',
        '++++++Y+Y++++++',
        '    +  +  +    ',
        '    + ABy +    ',
        '    +++++++    '],
    {
        '@': 'player',
        'E': 'exit',
        'A': 'theAlgorithm',
        '+': 'block',
        'R': 'redLock',
        'G': 'greenLock',
        'B': 'blueLock',
        'Y': 'yellowLock',
        'r': 'redKey',
        'g': 'greenKey',
        'b': 'blueKey',
        'y': 'yellowKey'
    }, 15, 6);
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}

function onExit(map) {
    if (!map.getPlayer().hasItem('theAlgorithm')) {
        map.writeStatus("You must get that Algorithm!!");
        return false;
    } else {
        return true;
    }
}
