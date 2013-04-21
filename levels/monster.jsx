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
            player.killedBy#{#('a ferocious beast')#}#;
        },
        'behavior': function (me, player) {
            var leftDist = me.getX() - player.getX();
            var upDist = me.getY() - player.getY();

            if (upDist > 0 && upDist > leftDist) {
                me.moveUp();
            } else if (upDist < 0 && upDist < leftDist) {
                me.moveDown();
            } else if (leftDist > 0 && leftDist > upDist) {
                me.moveLeft();
            } else {
                me.moveRight();
            }
        }
    });

    map.placeObject(10, 14, 'monster');

    map.placeObject(0, 0, 'exit');

    if (!map.getPlayer().hasItem('computer')) {
        map.placeObject(2, 3, 'computer');
    }
}
