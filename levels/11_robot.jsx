#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["object.giveItemTo", "object.passableFor",
         "map.validateAtMostXObjects"],
    "music": "conspiracy"
}
#END_PROPERTIES#
/*
 * robot.js
 *
 * You'll need three keys in order to unlock the
 * Algorithm: the red key, the green key, and the
 * blue key. Unfortunately, all three of them are
 * behind human-proof barriers.
 *
 * The plan is simple: reprogram the maintenance
 * robots to grab the key and bring it through
 * the barrier to us.
 *
 * Let's try it on the red key first.
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLevel(map) {
#START_OF_START_LEVEL#
    // Hint: you can press R or 5 to "rest" and not move the
    // player, while the robot moves around.

    map.placePlayer(map.getWidth()-2, map.getHeight()-2);
    var player = map.getPlayer();

    map.defineObject('robot', {
        'type': 'dynamic',
        'symbol': 'R',
        'color': 'gray',
        'onCollision': function (player, me) {
            me.giveItemTo(player, 'redKey');
        },
        'behavior': function (me) {
#BEGIN_EDITABLE#
            // Available commands: me.move(direction)
            //                 and me.canMove(direction)



#END_EDITABLE#
        }
    });

    map.defineObject('barrier', {
        'symbol': '░',
        'color': 'purple',
        'impassable': true,
        'passableFor': ['robot']
    });

    map.placeObject(0, map.getHeight() - 1, 'exit');
    map.placeObject(1, 1, 'robot');
    map.placeObject(map.getWidth() - 2, 8, 'redKey');
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
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateExactlyXManyObjects(1, 'robot');
    map.validateAtMostXObjects(1, 'redKey');
}

function onExit(map) {
    if (!map.getPlayer().hasItem('redKey')) {
        map.writeStatus("We need to get that key!");
        return false;
    } else {
        return true;
    }
}
