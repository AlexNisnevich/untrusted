
/*
 * colors.js
 *
 * As he observed the obstacles before him,
 * Dr. Eval realized that changing the world
 * around him wasn't enough. Now he needed to
 * change himself.
 */

function startLevel(map) {
	map.placePlayer(0, 0);

	map.getPlayer().setPhoneCallback(function () {
#BEGIN_EDITABLE#

		map.getPlayer().setColor('f00');





#END_EDITABLE#
	});


	map.createNewObject('redLock', {
		symbol: '☒',
		color: "#f00", // red
		impassable: function(player, object) {
			return player.getColor() != object.color;
		}
	});

	map.createNewObject('greenLock', {
		symbol: '☒',
		color: "#0f0", // green
		impassable: function(player, object) {
			return player.getColor() != object.color;
		}
	});

	map.createNewObject('yellowLock', {
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
