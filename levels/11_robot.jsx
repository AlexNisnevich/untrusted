#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["object.inventory", "object.giveItemTo", "object.passableFor"],
    "itemsIntroduced": ["redKey"]
}
#END_PROPERTIES#
/*
 * robot.js
 *
 *
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
}

function validateLevel(map, validators) {
    validators.validateExactlyXManyObjects(map, 1, 'exit');
}

function onExit(map) {
    if (!map.getPlayer().hasItem('redKey')) {
        map.writeStatus("We need to get that key!");
        return false;
    } else {
        return true;
    }
}
