#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["object.type", "object.behavior", "object.findNearest",
         "object.getX", "object.getY", "object.canMove", "object.move"]
}
#END_PROPERTIES#
/*
 * monster.js
 *
 * Suddenly, Dr. Eval was besieged by a swarm of angry monsters!
 */

function startLevel(map) {
    map.placePlayer(2, 2);

    map.defineObject('monster', {
        'type': 'dynamic',
        'symbol': 'M',
        'color': 'brown',
        'onCollision': function (player) {
            player.killedBy('a ferocious beast');
        },
        'behavior': function (me) {
            var target = me.findNearest(#{#'player'#}#);
            var leftDist = me.getX() - target.x;
            var upDist = me.getY() - target.y;

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

            if (me.canMove(direction)) {
                me.move(direction);
            }
        }
    });

    for (var x = 5; x < 20; x += 2) {
        map.placeObject(x, 25 - x, 'monster');
    }

    map.placeObject(map.getWidth()-2, map.getHeight()-2, 'exit');
}

function validateLevel(map) {
    validateExactlyXManyObjects(map, 1, 'exit');
}
