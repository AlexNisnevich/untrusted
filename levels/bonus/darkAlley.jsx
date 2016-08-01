#BEGIN_PROPERTIES#
{
	"version": "1.0",
	"commandsIntroduced": ["player.encounterEnemy"]
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
			player.encounterEnemy('vicious thug');
		}
	});

	map.defineObject('wire', {
		'type': 'trap'
		'symbol': '-',
		'color': '#f6f6f6',
		'onCollision': function(player) {
			player.killedBy('razor wire');
		},
		'passableFor': ['player', 'goldengun'],
		'deactivateBy': 'goldengun',
		'onDeactivate': function() {
			map.writeStatus("The player is unstoppable with the golden gun!");
		}
	});

	map.defineObject('goldengun', {
		'type': 'item',
		'symbol': String.fromCharCode(0xD83D),
		'color': 'black'
	});

	var alleyX = parseInt(map.getWidth() / 2);
	var alleyY = parseInt(map.getHeight() / 2);

	map.createFromGrid(['#######',
						'# +E+ #',
						'#  +  #',
						'   T  G',
						'      T',
						' T   ##',
						'  ##   ',
						'       ',
						'   T   ',
						'       '],
					{
						'E': 'exit',
						'#': 'block',
						'+': 'wire',
						'G': 'goldengun',
						'T': 'thug'
					}, alleyX, alleyY);

#END_OF_START_LEVEL#
}

// onExit function
function onExit(map) {
	map.writeStatus("You have made it out of the dark alley.");

	return true;
}

// validate object counts
function validateLevel(map) {
	map.validateExactlyXManyObjects(1, 'exit');
	map.validateExactlyXManyObjects(4, 'thug');
}