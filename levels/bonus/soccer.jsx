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

function startLevel(map) {
#START_OF_START_LEVEL#
// Create map here (or after object definitions)
	map.defineObject('invisibleWall', {
		'impassable': function (player, me) {
		    var savedX = player.getX();
		    var savedY = player.getY();
		    return false;
		},
		'onCollision': function (player) {
                    var savedDirection = 'left';
		    var dirs = ['up', 'down', 'left', 'right'];
		    for (d=0;d<dirs.length;d++) {
		        if (dirs[d] != savedDirection) {
		            map.overrideKey(dirs[d], function(){});
		        }
		    }
		}
	});

	map.defineObject('enemyPlayer', {
		// Define enemy player here
		'type': 'dynamic',
		'symbol': 'P',
		'color': '#00f',
		'onCollision': function (player) {
		    player.killedBy('running into one of the enemy players');
		},
		'behaviour': function (me) {
			moveEnemyPlayer(me);
		}	
	});

	map.defineObject('goalie', {
		// Define goalie here
		'type': 'dynamic',
		'symbol': 'G',
		'color': '#00f',
		'behaviour': function (me) {
			moveGoalie(me, 'ball');
		}	
	});

	//should these go into objects.js?
	function moveEnemyPlayer(enemyPlayer) {
		var direction = (Math.random() > 0) ? 'up' : 'down'; //randomly go up or down
		setInterval(function(enemyPlayer) {	
			var maxHeight = map.getHeight();
			if(direction === 'up'){
				if(enemyPlayer.getY() > 0){
					if(enemyPlayer.canMove('up')){
						enemyPlayer.move('up');
					}
				}
				else {
					direction = 'down';
				}	
			}
			if(direction === 'down'){
				if(enemyPlayer.getY() < maxHeight){
					if(enemyPlayer.canMove('down')){
						enemyPlayer.move('down');
					}
				}
				else {
					direction = 'up';
				}
			}
		}, 1000); //move every 1 second
	}

	function moveGoalie(goalie, type) {
		var target = goalie.findNearest(type);
		//should we keep goalie within the goal posts?
		goalie.y = target.y;
	}

	map.defineObject('ball', {
		// Define ball here
		'type': 'dynamic',
		'symbol': 'o',
		    'pushable': true,
		    //'onCollision': function(player) {
		    //     //push the ball
		    //}
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
				map.placeObject(8, map.getHeight() - 7, 'exit');
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
		},25);
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
		    '+               Li                   +',
		    '++++++++++++++++++++++++++++++++++++++'],
		{
		    '@': 'player',
		    //'E': 'exit',
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

