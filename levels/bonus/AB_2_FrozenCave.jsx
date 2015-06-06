#BEGIN_PROPERTIES#
{
    "version": "1.0",
    "mapProperties": {
        "allowOverwrite": true
    }	
}
#END_PROPERTIES#
/**************************
 *      FrozenCave.js     *
 **************************
 * So you did it.
 * 
 * You found the cave.
 * 
 * To be frank I didn't think
 * you had it in you.
 * 
 * Lets see you in this challenge.
 * 
 * And no my name is not Frank.
 * 
 * Every traveller knows that the
 * adventures never truly end.
 */

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function startLevel(map) {
#START_OF_START_LEVEL#
    var savedX, savedY, savedDirection;
    map.defineObject('ice', {
      'symbol': String.fromCharCode(0x2630), 'color': '#75D1FF',
      'impassable': function(player, me) {
        savedX = player.getX();
        savedY = player.getY();
        return false;
      },
      'onCollision': function(player) {
        if (player.getX() == savedX) {
          if (player.getY() > savedY) {
            savedDirection = 'down';
          } else {
            savedDirection = 'up';
          }
        } else {
          if (player.getX() > savedX) {
            savedDirection = 'right';
          } else {
            savedDirection = 'left';
          }
        }
        dirs = ['up', 'down', 'left', 'right'];
        for (d=0;d<dirs.length;d++) {
          if (dirs[d] != savedDirection) {
            map.overrideKey(dirs[d], function(){});
          }
        }
      }
    });
	
    map.startTimer(function() {
      player = map.getPlayer();
      x = player.getX(); y = player.getY();
      if (map.getObjectTypeAt(x,y) == 'ice') {
        player.move(savedDirection);
      }
      if (player.getX() == x && player.getY() == y) {
        map.overrideKey('up', null);
        map.overrideKey('down', null);
        map.overrideKey('left', null);
        map.overrideKey('right', null);
      }
    },200);
	
	map.defineObject('boulder', {
		'symbol': String.fromCharCode(0x2617),
		'color' : '#5C1F00',
		'impassable': true
	});
	
    map.createFromGrid(
['##################################################',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#E#xxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx###xxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'##xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'###xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx##',
'#####C#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx###',
'####   ###########################################',
'#### @ ###########################################'],
    {
        '@': 'player',
        'E': 'exit',
        '#': 'boulder',
        'x': 'ice',
        'C': 'computer',
    }, 0, 0);
	
	for (var i = 0; i < 75; i++) {
		player = map.getPlayer();
        var x = getRandomInt(0, map.getWidth() - 1);
        var y = getRandomInt(0, map.getHeight() - 1);
        if ((x != player.getX() || y != player.getY())
            && (x != map.getWidth()-9 || y != 7)
			&& (x != map.getWidth()-9 || y != 6)
			&& (x != player.getX() || y != map.getHeight()-2)
			&& (x != player.getX() || y != map.getHeight()-3)
			&& (x != player.getX() || y != map.getHeight()-4)) {
            map.placeObject(x, y, 'boulder');
		}
	}
#BEGIN_EDITABLE#

#END_EDITABLE#

#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(0, 'phone');
    map.validateExactlyXManyObjects(0, 'theAlgorithm');
    map.validateExactlyXManyObjects(1, 'exit');
    map.validateAtMostXDynamicObjects(0);
}
