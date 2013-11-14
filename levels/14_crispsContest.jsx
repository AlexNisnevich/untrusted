#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["object.type", "object.behavior", "object.findNearest",
         "object.getX", "object.getY", "object.canMove", "object.move"]
}
#END_PROPERTIES#
/*
 * ambush.js
 *
 * [This one's still in progress.]
 */

function startLevel(map) {
    function moveToward(obj, type) {
        var target = obj.findNearest(type);
        var leftDist = obj.getX() - target.x;
        var upDist = obj.getY() - target.y;

        var direction;
        if (upDist > 0 && upDist >= leftDist) {
            direction = 'up';
        } else if (upDist < 0 && upDist < leftDist) {
            direction = 'down';
        } else if (leftDist > 0 && leftDist >= upDist) {
            direction = 'left';
        } else {
            direction = 'right';
        }

        if (obj.canMove(direction)) {
            obj.move(direction);
        }
    }

    map.placePlayer(2, 2);

    map.defineObject('attackDrone', {
        'type': 'dynamic',
        'symbol': 'd',
        'color': 'red',
        'onCollision': function (player) {
            player.killedBy('an attack drone');
        },
        'behavior': function (me) {
#BEGIN_EDITABLE#
            moveToward(me, 'player');
#END_EDITABLE#
        }
    });

    map.defineObject('defenseDrone', {
        'type': 'dynamic',
        'symbol': 'd',
        'color': 'green',
        'onCollision': function (player) {
            player.killedBy('a defense drone');
        },
        'behavior': function (me) {
#BEGIN_EDITABLE#

#END_EDITABLE#
        }
    });

    for (var x = 0; x <= 20; x++) {
        map.placeObject(x, 20 - x, 'attackDrone');
    }

    for (var x = 30; x < 50; x++) {
        map.placeObject(x, 55 - x, 'defenseDrone');
    }

    map.placeObject(map.getWidth()-2, map.getHeight()-2, 'exit');
}

function validateLevel(map) {
    validateExactlyXManyObjects(map, 1, 'exit');
}
