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
		'onCollision': function(player) {
			if ( !player.hasItem('goldengun') ) {
				player.killedBy('vicious thug');
			} else {
				map.writeStatus('You are invincible!');
			}
		}
	});

	map.defineObject('bluedoor', {
		'symbol': '-',
		'color': 'blue',
		'impassable': function(player) {
			if (player.getColor() === '#0f0') {
				player.setColor('orange');
				this.color = 'red';
				return false;
			}
			return true;
		}
	});

	map.defineObject('goldengun', {
		'symbol': String.fromCharCode(0x122),
		type: 'item',
		'onPickUp': function(player) {
			map.writeStatus('You have the golden gun!');
			
			if (player.getColor() === "orange") {
				player.setColor('#0f0');
			}
		}
	});

	var alleyX = parseInt(map.getWidth() / 2);
	var alleyY = parseInt(map.getHeight() / 2) - 5;

	map.createFromGrid(['#######',
						'# 	E  #',
						'#     #',
						'#     #',
						'#     #',
						'#     #',
						'#  T  #',
						'#     T',
						'#T   ##',
						'#L#TLL#',
						'#     #',
						'###T#L#',
						'#  P  #',
						'#######'],
					{
						'E': 'exit',
						'#': 'block',
						'G': 'goldengun',
						'T': 'thug',
						'L': 'bluedoor',
						'P': 'player'
					}, alleyX, alleyY);
#BEGIN_EDITABLE#
	map.placeObject(20, 20, 'goldengun');
#END_EDITABLE#

#END_OF_START_LEVEL#
}

function onExit(map) {
	map.writeStatus("You have escaped the dark alley.");
	return true;
}

function validateLevel(map) {
	map.validateExactlyXManyObjects(1, 'exit');
}