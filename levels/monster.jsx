/*
 * monster.js
 */

function startLevel(map) {
    map.placePlayer(2, 2);

    map.createNewObject('monster', {
        'type': 'animate',
        'symbol': 'M',
        'color': 'brown',
        'onCollision': function (player) {
            player.killedBy('a ferocious beast');
        },
        'behavior': function (me) {
            var target = me.findNearest(#{#'player'#}#);
            var leftDist = me.getX() - target.x;
            var upDist = me.getY() - target.y;

            if (upDist > 0 && upDist >= leftDist) {
                me.moveUp();
            } else if (upDist < 0 && upDist < leftDist) {
                me.moveDown();
            } else if (leftDist > 0 && leftDist >= upDist) {
                me.moveLeft();
            } else {
                me.moveRight();
            }
        }
    });

    for (var x = 5; x < 20; x += 2) {
        map.placeObject(x, 25 - x, 'monster');
    }

    map.placeObject(map.getWidth()-2, map.getHeight()-2, 'exit');

    if (!map.getPlayer().hasItem('computer')) {
        map.placeObject(2, 3, 'computer');
    }
}
