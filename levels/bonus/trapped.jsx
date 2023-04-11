#BEGIN_PROPERTIES#
{
    "version": "1.2.2",
    "commandsIntroduced": ['object.pushable','player.getLastMoveDirection'],
    "music": "Brazil"
}
#END_PROPERTIES#
/*******************
 * trapped.js      *
 * by benjaminpick *
 *******************
 *
 * oh look! aren't they cute??
 *
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
        } if (upDist > 0 && upDist >= leftDist && obj.canMove('up')) {
            direction = 'up';
        } else if (upDist < 0 && upDist < leftDist && obj.canMove('down')) {
            direction = 'down';
        } else if (leftDist > 0 && leftDist >= upDist && obj.canMove('left')) {
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
        'pushable': true,
        'type': 'dynamic',
        'symbol': '▣',
        'onCollision': function (player, me) {
            if (!me.canMove(player.getLastMoveDirection()))
                player.killedBy('a trap');
        },
        'behavior': function(me) {
            if (!me.canMove('left') && !me.canMove('right'))
                return;
            if (me.canMove('down'))
                me.move('down');
        }
    });

    map.placeObject(5, 10, 'box');
    map.placeObject(5, 11, 'block');

    map.placePlayer(0, 12);
    map.placeObject(map.getWidth() - 1, 12, 'exit');


    for (var y = 0; y < map.getHeight(); y++)
    {
        map.placeObject(15, y, Math.random() > .4 ? 'block' : 'box');
        map.placeObject(25, y, Math.random() > .4 ? 'block' : 'box');
    }
    for (var y = 0; y < map.getHeight(); y+= 3)
    {
        for (var x = 16; x <= 25; x++) {
            map.placeObject(x, y, Math.random() > .1 ? 'block' : 'box');
        }
        map.placeObject(24, y + 1, 'attackDrone');
    }
#BEGIN_EDITABLE#






#END_EDITABLE#
    function validateLevel(map) {
        map.validateExactlyXManyObjects(1, 'exit');
    }
#END_OF_START_LEVEL#
}
