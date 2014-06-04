#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced": ['canBePushed'],
    "music": "Brazil"
}
#END_PROPERTIES#
/*************
 * trapped.js *
 *************
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
#BEGIN_EDITABLE#

















  
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
    
 /*   
    for (y = 0; y < map.getHeight(); y++)
    {
        map.placeObject(25, y, 'box');
        map.placeObject(35, y, 'box');
    }
    for (y = 0; y < map.getHeight(); y+= 3)
    {
        for (x = 26; x <= 35; x++) {
            map.placeObject(x, y, 'box');
        }
        map.placeObject(34, y + 1, 'attackDrone');
    }
*/
#END_EDITABLE#  
    function validateLevel(map) {
        map.validateExactlyXManyObjects(1, 'exit');
    }
#END_OF_START_LEVEL#
}