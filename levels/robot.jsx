#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["object.inventory", "object.giveItemTo", "object.passableFor"]
}
#END_PROPERTIES#
/*
 * robot.js
 *
 * Dr. Eval had nowhere to go. The door was locked.
 * Fortunately, his trusty robot companion showed up
 * just in the nick of time with the key that he needed.
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
    map.placePlayer(map.getWidth()-2, map.getHeight()-2);

    map.defineObject('robot', {
        'type': 'dynamic',
        'symbol': 'R',
        'color': 'gray',
        'inventory': ['key'],
        'onCollision': function (player, me) {
            me.giveItemTo(player, 'key');
        },
        'behavior': function (me) {
#BEGIN_EDITABLE#





#END_EDITABLE#
        }
    });

    map.defineObject('barrier', {
        'symbol': '░',
        'color': 'purple',
        'impassable': true,
        'passableFor': ['robot']
    });

    map.defineObject('lock', {
        'symbol': String.fromCharCode(0x13cc),
        'color': 'gray',
        'impassable': function (player) {
            return !player.hasItem('key');
        }
    });

    map.placeObject(0, map.getHeight() - 1, 'exit');
    map.placeObject(0, map.getHeight() - 2, 'lock');
    map.placeObject(1, map.getHeight() - 1, 'lock');
    map.placeObject(1, 1, 'robot');
    map.placeObject(map.getWidth() - 2, 9, 'barrier');

    for (var x = 0; x < map.getWidth(); x++) {
        map.placeObject(x, 0, 'block');
        if (x != map.getWidth() - 2) {
            map.placeObject(x, 9, 'block');
        }
    }

    for (var y = 1; y < 9; y++) {
        map.placeObject(0, y, 'block');
        map.placeObject(map.getWidth() - 1, y, 'block');
    }
}
