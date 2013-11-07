#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
    	["map.defineObject", "player.getColor", "player.setColor",
    	 "object.color", "object.impassable", "object.symbol",
    	 "player.setPhoneCallback"]
}
#END_PROPERTIES#
/*************
 * colors.js *
 *************
 *
 * You're almost at the exit. You just need to get past this
 * color lock.
 *
 * Changing your environment is no longer enough. You must
 * learn to change yourself.
 *
 * I've sent a little package that should come in handy.
 * Try it and see!
 */

function startLevel(map) {
	map.placePlayer(0, 0);

	if (!map.getPlayer().hasItem('phone')) {
        map.placeObject(1, 1, 'phone');
    }

    // The function phone lets you call arbitrary functions,
    // as defined by player.setPhoneCallback() below.
    // The function phone callback is bound to Ctrl-6.
	map.getPlayer().setPhoneCallback(function () {
#BEGIN_EDITABLE#

		map.getPlayer().setColor('#f00');





#END_EDITABLE#
	});


	map.defineObject('redLock', {
		symbol: '☒',
		color: "#f00", // red
		impassable: function(player, object) {
			return player.getColor() != object.color;
		}
	});

	map.defineObject('greenLock', {
		symbol: '☒',
		color: "#0f0", // green
		impassable: function(player, object) {
			return player.getColor() != object.color;
		}
	});

	map.defineObject('yellowLock', {
		symbol: '☒',
		color: "#ff0", // yellow
		impassable: function(player, object) {
			return player.getColor() != object.color;
		}
	});

	for (var x = 6; x <= 40; x++) {
		map.placeObject(x, 5, 'block');
		map.placeObject(x, 7, 'block');
	}
	map.placeObject(9, 6, 'greenLock');
	map.placeObject(14, 6, 'redLock');
	map.placeObject(19, 6, 'yellowLock');
	map.placeObject(24, 6, 'greenLock');
	map.placeObject(29, 6, 'redLock');
	map.placeObject(34, 6, 'yellowLock');
	map.placeObject(39, 6, 'exit');
	map.placeObject(40, 6, 'block');
}

function validateLevel(map) {
    validateExactlyXManyObjects(map, 1, 'exit');
}
