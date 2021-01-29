#BEGIN_PROPERTIES#
{
    "version": "1.0.1",
    "nextBonusLevel": "AB_4_BatAttack.jsx"
}
#END_PROPERTIES#
/********************************
 *      BoulderMadness.js		*
 ********************************
 *
 * Getting through the ice was not easy,
 * in this section of the cave
 * some of the snowy boulders maybe be movable,
 * or maybe you can even squeeze yourself through them,
 * but be careful, pushing too hard might get you stuck,
 * or worse...
 * You need a way to distinguish danger... 
 * and danger is usually red!
 *
 * Every traveller knows that the
 * adventures never truly end.
 */

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function startLevel(map) {
#START_OF_START_LEVEL#
    
	map.placePlayer(1, 1);
	
	map.placeObject(map.getWidth()-2, map.getHeight()-2, 'exit');

	map.defineObject('boulder', {
		#{#                		 #}#	
		'symbol': String.fromCharCode(0x2617),
		'impassable': true
	});
	
	map.defineObject('movingBoulder', {
		#{#                		 #}#
		'symbol': String.fromCharCode(0x2617),
		'pushable': true,
		'type': 'dynamic',
	});	

	map.defineObject('trapBoulder', {
		#{#                		 #}#
		'symbol': String.fromCharCode(0x2617),
		'pushable': true,
		'type': 'dynamic',
        'onCollision': function (player) {
            player.killedBy('Got trapped under boulder');
        },
	});	
	
	
	for (var i = 0; i < 580; i++) {
		var player = map.getPlayer();
        var x = getRandomInt(0, map.getWidth() - 1);
        var y = getRandomInt(0, map.getHeight() - 1);
        if ((x != player.getX() || y != player.getY())
            && (x != map.getWidth()-9 || y != 7)
			&& (x != map.getWidth()-9 || y != 6)
			&& (x != player.getX() || y != map.getHeight()-2)
			&& (x != player.getX() || y != map.getHeight()-3)
			&& (x != player.getX() || y != map.getHeight()-4)) {
			var placement = getRandomInt(0,15);
			if (map.getObjectTypeAt(x, y)=== "empty") {
				if ( placement < 8) {
					map.placeObject(x, y, 'movingBoulder');
				} else if (placement < 13) {
					map.placeObject(x, y, 'boulder');
				} else {
					map.placeObject(x, y, 'trapBoulder');
				}
			} else {
				i = i -1;
			}
		}
	}


#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(0, 'phone');
    map.validateExactlyXManyObjects(0, 'theAlgorithm');
    map.validateExactlyXManyObjects(1, 'exit');
}
