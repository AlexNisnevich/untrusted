#BEGIN_PROPERTIES#
{
	"version": "1.0.2",
	"mapProperties": {
		"refreshRate": 50
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
	var kickedDirection = 'none';
	var ballX = 11;
	var ballY = 13;
	var scored = false;

	map.defineObject('invisibleWall', {
		'color': '#333',
		'symbol': '|'
	});

	map.defineObject('enemyPlayer', {
		'type': 'dynamic',
		'symbol': 'P',
		'color': '#ff0',
		'interval': 200,
		'onCollision': function (player) {
		    player.killedBy('an enemy player');
		},
		'behavior': function (me) {
			var direction = (Math.round(Math.random()) > 0) ? 'up' : 'down';
			moveEnemyPlayer(me, direction)
		}	
	});

	map.defineObject('goalie', {
		'type': 'dynamic',
		'symbol': 'G',
		'color': '#0ff',
		'interval': 100,
		'behavior': function (me) {
			moveGoalie(me);
		}	
	});

	function moveEnemyPlayer(enemyPlayer, direction) {
		if (enemyPlayer.canMove(direction))
			enemyPlayer.move(direction)
		else
			enemyPlayer.move((direction === 'up') ? 'down' : 'up');
	}

	function moveGoalie(goalie) {
		var target = goalie.findNearest('ball');
		var yDist = goalie.getY() - target.y;
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
		'type': 'dynamic',
		'symbol': 'o',
		'pushable': true,
		'interval': 100,
		'behavior': function (me) {
			ballX = me.getX();
			ballY = me.getY();
			if (kickedDirection != 'none'){
				if (me.canMove(kickedDirection)){
					me.move(kickedDirection);
				}
				else{
					kickedDirection = 'none';
				}
			}
		}
	});

	map.defineObject('gate', {
		'type': 'dynamic',
		'symbol': '=',
		'color': '#f00',
		'interval': 500,
		'behavior': function(me) {
			var ball = me.findNearest('ball');
			if (ball.x == 42 && ball.y < 15 && ball.y > 11){
				if (me.getY() > 11){
					if (me.canMove('up'))
						me.move('up');
					else
						me.move('left');
				}
				map.writeStatus("GOOOOOOOOOOOOAAAAAAAAAAAL!")
			}
		},
		'onCollision': function (player) {
			map.placeObject(5,12,'block');
			map.placeObject(5,13,'block');
			map.placeObject(5,14,'block');
			map.writeStatus("You must score a goal first!");
		}
	});

	map.startTimer(function() {
	    var player = map.getPlayer();
	    var x = player.getX();
	    if (x > 23){
	    	map.overrideKey('right', function(){});
		    player.move('left');
	    }
	    else {
	    	map.overrideKey('right', null);
	    }
	},25);

	map.createFromGrid(
	   ['++++++++++++++++++++++++++++++++++++++',
	    '+ @               i                  +',
	    '+                 i                  +',
	    '+          P      i                  +',
	    '+                 i        P         +',
	    '+                 i                 ++',
	    '=                 i P                +',
	    '=    b            i                G +',
	    '=                 i                  +',
	    '+                 i                 ++',
	    '+                 i    P      P      +',
	    '+                 i                  +',
	    '+              P  i                  +',
	    '+               L i                  +',
	    '++++++++++++++++++++++++++++++++++++++'],
	{
	    '@': 'player',
	    '+': 'block',
	    'P': 'enemyPlayer',
	    'L': 'phone',
	    'G': 'goalie',
	    'b': 'ball',
	    'i': 'invisibleWall',
	    '=': 'gate'
	}, 6, 6);

	map.placeObject(3, 13, 'exit');

	// Kick the ball!
	map.getPlayer().setPhoneCallback(function () {

		var x = map.getPlayer().getX();
		var y = map.getPlayer().getY();

		if (x + 1 == ballX && y == ballY)
			kickedDirection = 'right';
		else if (x - 1 == ballX && y == ballY)
			kickedDirection = 'left';
		else if (x == ballX && y - 1 == ballY)
			kickedDirection = 'up';
		else if (x == ballX && y + 1 == ballY)
			kickedDirection = 'down';
		

	});
#BEGIN_EDITABLE#
	
	
	
	

#END_EDITABLE#

#END_OF_START_LEVEL#
}
function validateLevel(map) {
	map.validateAtMostXObjects(1, 'exit');
  	map.validateAtLeastXObjects(6, 'enemyPlayer');
  	map.validateAtLeastXObjects(1, 'goalie');
  	map.validateAtMostXObjects(1, 'ball');
}

