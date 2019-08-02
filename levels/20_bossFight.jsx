#BEGIN_PROPERTIES#
{
    "version": "1.2.1",
    "commandsIntroduced":
        ["object.onDestroy", "object.projectile",
         "map.countObjects", "map.isStartOfLevel",
         "map.validateAtMostXDynamicObjects", "map.validateNoTimers"],
	"music": "Adversity",
    "mapProperties": {
        "refreshRate": 50
    }
}
#END_PROPERTIES#

/*****************
 * bossFight.js *
 *****************
 *
 * NO FARTHER, DR. EVAL!!!!
 * YOU WILL NOT GET OUT OF HERE ALIVE!!!!
 * IT'S TIME YOU SEE MY TRUE FORM!!!!
 * FACE MY ROBOT WRATH!!!!!
 */

function startLevel(map) {
#START_OF_START_LEVEL#
	map.defineObject('boss', {
        'type': 'dynamic',
        'symbol': '⊙',
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
        },
        'onDestroy': function (me) {
            if (map.countObjects('boss') == 0) {
                map.placeObject(me.getX(), me.getY(), 'theAlgorithm');
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
    map.placeObject(map.getWidth() - 1, map.getHeight() - 1, 'exit');

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
    map.validateAtMostXObjects(1, 'phone');

    if (map.countObjects('theAlgorithm') > 0 && map.countObjects('boss') > 0) {
        throw "The Algorithm can only be dropped by the boss!";
    }

    // only called at start of level
    if (map.isStartOfLevel()) {
        map.validateAtMostXDynamicObjects(23);
        map.validateNoTimers();
    }
}

function onExit(map) {
    if (!map.getPlayer().hasItem('theAlgorithm')) {
        map.writeStatus("You must take back the Algorithm!!");
        return false;
    } else if (!map.getPlayer().hasItem('phone')) {
        map.writeStatus("We need the phone!");
        return false;
    } else {
        return true;
    }
}
