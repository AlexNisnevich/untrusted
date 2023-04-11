#BEGIN_PROPERTIES#
{
    "version": "1.2.2",
    "commandsIntroduced": ['object.pushable'],
    "music": "Brazil"
}
#END_PROPERTIES#
/*******************
 * pushme.js       *
 * by benjaminpick *
 *******************
 *
 * You will need to get inside, I guess.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    function moveToward(obj, type) {
        var target = obj.findNearest(type);
        var leftDist = obj.getX() - target.x;
        var upDist = obj.getY() - target.y;

        var direction;
        if (upDist == 0 && leftDist == 0) {
        	return;
        } if (upDist > 0 && upDist >= leftDist) {
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

    map.defineObject('attackDrone', {
        'type': 'dynamic',
        'symbol': 'd',
        'color': 'red',
        'onCollision': function (player) {
            player.killedBy('an attack drone');
        },
        'behavior': function (me) {
            moveToward(me, 'player');
        }
    });

    map.defineObject('box', {
        #{#                 #}#
        'type': 'dynamic',
        'symbol': '▣',
        'behavior': null
    });

    map.placePlayer(0, 12);
    map.placeObject(map.getWidth()/2, map.getHeight()/2, 'exit');

    for (var x = map.getWidth()/2 - 1; x <= map.getWidth()/2 + 1; x++) {
        for (var y = map.getHeight()/2 - 1; y <= map.getHeight()/2 + 1; y++) {
            if (x != map.getWidth()/2 || y != map.getHeight()/2) {
                map.placeObject(x, y, 'attackDrone');
            }
        }
    }

    for (x = map.getWidth()/2 - 4; x <= map.getWidth()/2 + 4; x++) {
        for (y = map.getHeight()/2 - 4; y <= map.getHeight()/2 + 4; y++) {
            if (x < map.getWidth()/2 - 1 || x > map.getWidth()/2 + 1 || y < map.getHeight()/2 - 1 || y > map.getHeight()/2 + 1) {
                map.placeObject(x, y, 'box');
            }
        }
    }

    function validateLevel(map) {
        map.validateExactlyXManyObjects(1, 'exit');
    }
#END_OF_START_LEVEL#
}
