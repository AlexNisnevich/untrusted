#BEGIN_PROPERTIES#
{
	"version": "1.0"
	"mapProperties": {
		"refreshRate": 50,
		//"quickValidateCallback": true // <-- not sure what this does or if needed
	}
}
#END_PROPERTIES#
/*****************************
* soccer.jsx                 *
* by Phelan, Alex, and Daisy *
******************************
*
*/

function startLevel(map){
#START_OF_START_LEVEL#
    map.defineObject('enemyPlayer', {
        'symbol': 'P', 'color': '#00f',
        'onCollision': function (player) {
            player.killedBy('running into one of the enemy players');
        }
    });
    map.defineObject('goalie', {
	// Define goalie here
        'symbol': 'G', 'color': '#00f',
    });
    map.defineObject('invisibleWall', {
        'impassable': function(player, me) {
            savedX = player.getX();
            savedY = player.getY();
            return false;
        },
        'onCollision': function (player) {
            savedDirection = 'left';
            dirs = ['up', 'down', 'left', 'right'];
            for (d=0;d<dirs.length;d++) {
                if (dirs[d] != savedDirection) {
                    map.overrideKey(dirs[d], function(){});
                }
            }
        }
    });
    map.defineObject('ball', {
	// Define ball here
	'type': 'dynamic',
	'symbol': 'o',
	'behaviour': function (me) {
		if (kickedDirection != 'none' && kickedDistance > 0){
			if (me.canMove(kickedDirection)){
				me.move(kickedDirection);
				kickedDistance--;
			}
			else{
				kickedDistance = 0;
			}
		}
		if (kickedDirection != 'none' && kickedDistance > 0 && me.canMove(kickedDirection))
		if (me.getX() == (map.getWidth - 1) && me.getY() < 15 && me.getY() > 10){ // <-- change to actual goal post locations
			map.placeObject(4, map.getHeight() - 4, 'exit');
		}
	}
    });
    map.startTimer(function() {
        player = map.getPlayer();
        x = player.getX(); y = player.getY();
        if (map.getObjectTypeAt(x,y) == 'invisibleWall') {
            player.move(savedDirection);
        }
        if (player.getX() == x && player.getY() == y) {
            map.overrideKey('up', null);
            map.overrideKey('down', null);
            map.overrideKey('left', null);
            map.overrideKey('right', null);
        }
    },100);
    map.createFromGrid(
       ['++++++++++++++++++++++++++++++++++++++',
        '+ @              i                   +',
        '+                i                   +',
        '+          P     i                   +',
        '+                i         P         +',
        '+                i                  ++',
        '+                i  P                +',
        '+    b           i                 G +',
        '+                i                   +',
        '+                i                  ++',
        '+                i     P      P      +',
        '+                i                   +',
        '+              P i                   +',
        '+ E             Li                   +',
        '++++++++++++++++++++++++++++++++++++++'],
    {
        '@': 'player',
        'E': 'exit',
        '+': 'block',
        'P': 'enemyPlayer',
        'L': 'phone',
        'G': 'goalie',
        'b': 'ball',
        'i': 'invisibleWall'
    }, 6, 6);

var kickedDirection = 'none';
var kickedDirection = 0;

#BEGIN_EDITABLE#

#END_EDITABLE#

     map.getPlayer().setPhoneCallback(function () {
	var x = map.getPlayer().getX();
	var y = map.getPlayer().getY();
	if (map.getObjectTypeAt(x + 1, y) == 'ball'){
		kickedDirection = 'right';
		kickedDistance = 10;
	}
	else if (map.getObjectTypeAt(x - 1, y) == 'ball'){
		kickedDirection = 'left';
		kickedDistance = 10;
	}
	else if (map.getObjectTypeAt(x, y + 1) == 'ball'){
		kickedDirection = 'up';
		kickedDistance = 10;
	}
	else if (map.getObjectTypeAt(x, y - 1) == 'ball'){
		kickedDirection = 'down';
		kickedDistance = 10;
	}
});

// More stuff probably goes here


#END_OF_START_LEVEL#
}

