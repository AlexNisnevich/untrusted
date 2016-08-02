#BEGIN_PROPERTIES#
{
	"version": "1.0",
	"commandsIntroduced": []
}
#END_PROPERTIES#
/******************
 * darkAlley.jsx *
 * by aquang9124 *
 ******************
 *
 * Good evening, Dr.
 *
 * You wake up in a dark alleyway and have no recollection of
 * how you got here. There's nothing in your pockets except 
 * lint. You hear footsteps closing in on your location...
 *
 */

function startLevel(map) {
#START_OF_START_LEVEL#

	map.defineObject('thug', {
		'symbol': String.fromCharCode(0x2620),
		'color': '#333333',
		'onCollision': function(player) {
			if ( !player.hasItem('goldengun') ) {
				player.killedBy('vicious thug');
			} else {
				map.writeStatus('You are invincible!');
			}
		}
	});

	map.defineObject('goldengun', {
		'symbol': String.fromCharCode(0x122),
		type: 'item',
		'onPickup': function(player, game) {
			map.writeStatus('You are invincible now!');
		}
	})

	var alleyX = parseInt(map.getWidth() / 2);
	var alleyY = parseInt(map.getHeight() / 2);

#BEGIN_EDITABLE#
	map.createFromGrid(['#######',
						'# E   #',
						'#     #',
						'#  T  #',
						'#     T',
						'#T   ##',
						'# ##  #',
						'#     #',
						'###T###',
						'#  P  #',
						'#######'],
					{
						'E': 'exit',
						'#': 'block',
						'G': 'goldengun',
						'T': 'thug',
						'P': 'player'
					}, alleyX, alleyY);

	map.placeObject(20, 20, 'goldengun');
#END_EDITABLE#

#END_OF_START_LEVEL#
}

function onExit(map) {
	map.writeStatus("You have made it out of the dark alley.");

	return true;
}

function validateLevel(map) {
	map.validateAtLeastXObjects(38, 'block');
	map.validateExactlyXManyObjects(1, 'exit');
	map.validateExactlyXManyObjects(4, 'thug');
}