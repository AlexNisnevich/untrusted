#BEGIN_PROPERTIES#
{
	"version": "1.0",
	"mapProperties": {
		"refreshRate": 50,
		"quickValidateCallback": true // <-- not sure what this does or if needed
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

	var kickedDirection = 'none';
	var kickedDistance = 0;
	var ballX = 11;
	var ballY = 13;
	var scored = false;

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
		'behavior': function (me) {
			moveEnemyPlayer(me);
		}	
	});

	map.defineObject('goalie', {
		// Define goalie here
		'type': 'dynamic',
		'symbol': 'G',
		'color': '#00f',
		'interval': 800,
		'behavior': function (me) {
			moveGoalie(me);
		}	
	});

	//should these go into objects.js?
	function moveEnemyPlayer(enemyPlayer) {
		var direction = (Math.random() > 0) ? 'up' : 'down'; //randomly set initial direction
//		console.log("initial direction: ", direction); //testing
		var maxHeight = map.getHeight();
//		console.log("maxHeight: ", maxHeight); //testing
		return function() {
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
		}
	}

	function moveGoalie(goalie) {
		var target = goalie.findNearest('ball');
		//should we keep goalie within the goal posts?
		var yDist = goalie.getY() - target.y; //relative distance
		if(yDist == 0 || target.y < 11 || target.y > 15){
			return;
		}
		var direction = 'down';
		if(yDist > 0 ){
			direction = 'up';
		}
		if(goalie.canMove(direction)){
			goalie.move(direction);
		}
	}


	map.defineObject('ball', {
		// Define ball here
		'type': 'dynamic',
		'symbol': 'o',
		'pushable': true,
		'interval': 100,
		'behavior': function (me) {
			ballX = me.getX();
			ballY = me.getY();
			if (kickedDirection != 'none' && kickedDistance > 0){
				if (me.canMove(kickedDirection)){
					me.move(kickedDirection);
					kickedDistance--;
				}
				else{
					kickedDistance = 0;
				}
			}
			if (me.getX() == 42 && me.getY() < 15 && me.getY() > 11){ // <-- change to actual goal post locations
				if (!scored) {
					map.placeObject(8, map.getHeight() - 7, 'exit');
					scored = true;
				}
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
		    '+': 'block',
		    'P': 'enemyPlayer',
		    'L': 'phone',
		    'G': 'goalie',
		    'b': 'ball',
		    'i': 'invisibleWall'
		}, 6, 6);



#BEGIN_EDITABLE#

#END_EDITABLE#

	map.getPlayer().setPhoneCallback(function () {
		var x = map.getPlayer().getX();
		var y = map.getPlayer().getY();

		if (x + 1 == ballX && y == ballY){
			kickedDirection = 'right';
			kickedDistance = 100;
		}
		else if (x - 1 == ballX && y == ballY){
			kickedDirection = 'left';
			kickedDistance = 100;
		}
		else if (x == ballX && y - 1 == ballY){
			kickedDirection = 'up';
			kickedDistance = 100;
		}
		else if (x == ballX && y + 1 == ballY){
			kickedDirection = 'down';
			kickedDistance = 100;
		}
	});

// More stuff probably goes here


#END_OF_START_LEVEL#
}

