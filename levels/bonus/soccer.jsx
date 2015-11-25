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
* soccer.js                  *
* by Phelan, Alex, and Daisy *
******************************
*
*/

function startLevel(map){
#START_OF_START_LEVEL#
// Create map here (or after object definitions)

var kickedDirection = 'none';
var kickedDirection = 0;


map.defineObject('enemyPlayer', {
	// Define enemy player here
	'type': 'dynamic',
	'symbol': 'P',
	//'color': 'red',
	'behaviour': function (me) {
		
	}	
});


map.defineObject('goalie', {
	// Define goalie here
	'type': 'dynamic',
	'symbol': 'G',
	'color': 'red',
	'behaviour': function (me) {
		moveGoalie(me, 'ball');
	}	
});

//should this go into objects.js?
function moveGoalie(goalieObj, type) {
	var target = goalieObj.findNearest(type);
	//should we keep goalie within the goal posts?
	goalieObj.y = target.y;
}

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

