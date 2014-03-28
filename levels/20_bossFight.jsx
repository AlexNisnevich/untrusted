#BEGIN_PROPERTIES#
{
    "version": "0.3.1",
	"music": "Adversity",
    "mapProperties": {
        "refreshRate": 50,
        "quickValidateCallback": true
    }
}
#END_PROPERTIES#

/*****************
 * bossFight.js *
 *****************
 *
 * DAMN IT!! DAMN IT!!! HOW DID YOU GET THIS FAR!?!?!?!
 * THIS IS IT! NO FARTHER DR. EVAL!!!!
 * YOU WILL NOT GET OUT OF HERE ALIVE!!!!
 * FACE MY ROBOT WRATH!!!!!
 */

function startLevel(map) {
	map.defineObject('boss', {
        'type': 'dynamic',
        'symbol': 'v',
        'color': 'red',
        'interval': 200,
        'onCollision': function (player) {
            player.killedBy('the boss');
        },
        'behavior': function (me) {
        	if (!me.direction) {
        		me.direction = 'right';
        	}
        	if (me.canMove(me.direction)) {
            	me.move(me.direction);
        	} else {
        		me.direction = (me.direction == 'right') ? 'left' : 'right';
        	}
        	if (Math.random() < 0.3) {
            	map.placeObject(me.getX(), me.getY() + 2, 'bullet');
        	}
        }
    });

    map.defineObject('bullet', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'red',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('down');
        }
    });

    map.placePlayer(0, map.getHeight() - 3);

    // Not so tough now, huh?
    map.getPlayer().removeItem('phone');
    map.placeObject(map.getWidth() - 1, map.getHeight() - 3, 'phone');

    map.placeObject(0, map.getHeight() - 4, 'block');
    map.placeObject(1, map.getHeight() - 4, 'block');
    map.placeObject(2, map.getHeight() - 4, 'block');
    map.placeObject(2, map.getHeight() - 3, 'block');
    map.placeObject(map.getWidth() - 1, map.getHeight() - 4, 'block');
    map.placeObject(map.getWidth() - 2, map.getHeight() - 4, 'block');
    map.placeObject(map.getWidth() - 3, map.getHeight() - 4, 'block');
    map.placeObject(map.getWidth() - 3, map.getHeight() - 3, 'block');

    for (var x = 0; x < map.getWidth(); x++) {
        map.placeObject(x, 4, 'block');
    }

    map.placeObject(9, 5, 'boss');
    map.placeObject(11, 5, 'boss');
    map.placeObject(13, 5, 'boss');
    map.placeObject(15, 5, 'boss');
    map.placeObject(17, 5, 'boss');
    map.placeObject(19, 5, 'boss');
    map.placeObject(21, 5, 'boss');
    map.placeObject(23, 5, 'boss');
    map.placeObject(25, 5, 'boss');
    map.placeObject(27, 5, 'boss');
    map.placeObject(29, 5, 'boss');
    map.placeObject(31, 5, 'boss');

    map.placeObject(10, 6, 'boss');
    map.placeObject(12, 6, 'boss');
    map.placeObject(14, 6, 'boss');
    map.placeObject(16, 6, 'boss');
    map.placeObject(18, 6, 'boss');
    map.placeObject(20, 6, 'boss');
    map.placeObject(22, 6, 'boss');
    map.placeObject(24, 6, 'boss');
    map.placeObject(26, 6, 'boss');
    map.placeObject(28, 6, 'boss');
    map.placeObject(30, 6, 'boss');

#BEGIN_EDITABLE#

#END_EDITABLE#

#END_OF_START_LEVEL#
}

function validateLevel(map) {
    // called at start of level and whenever a callback executes
    map.validateAtMostXObjects(59, 'block');
    map.validateExactlyXManyObjects(0, 'exit');
    map.validateAtMostXObjects(1, 'phone');

    // only called at start of level
    //if (map.isStartOfLevel()) {
    //    map.validateExactlyXManyDynamicObjects(23);
    //    map.validateNoTimers();
    //}
}

function objective(map) {
    return (map._countObjects('boss') == 0);
}
