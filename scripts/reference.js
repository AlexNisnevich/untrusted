Game.prototype.reference = {
	'global.startLevel': {
		'name': 'startLevel(map)',
		'category': 'global',
		'type': 'method',
		'description': 'This method is called when the level loads.'
	},
	'global.validateLevel': {
		'name': 'validateLevel(map)',
		'category': 'global',
		'type': 'method',
		'description': 'The level can be loaded only if this method returns true.'
	},
	'ROT.Map.DividedMaze': {
		'name': 'ROT.Map.DividedMaze(width, height)',
		'category': 'global',
		'type': 'method',
		'description': 'Instantiates a Maze object of given width and height. The Maze object can create a maze by calling maze.create(callback), where the callback is a function that accepts (x, y, mapValue) and performs some action for each point in a grid, where mapValue is a boolean that is true if and only if the given point is part of the maze.'
	},

	'game.validateAtLeastXObjects': {
		'name': 'game.validateAtLeastXObjects(map, num, objectType)',
		'category': 'game',
		'type': 'method',
		'description': 'Raises an exception if there are not at least num objects of type objectType on the map.'
	},
	'game.validateExactlyXManyObjects': {
		'name': 'game.validateExactlyXManyObjects(map, num, objectType)',
		'category': 'game',
		'type': 'method',
		'description': 'Raises an exception if there are not exactly num objects of type objectType on the map.'
	},

	'map.createNewObject': {
		'name': 'map.createNewObject(type, properties)',
		'category': 'map',
		'type': 'method',
		'description': 'Creates a new type of <a onclick="$(\'#helpPaneSidebar .category#object\').click();">object</a> with the given properties.'
	},
	'map.getHeight': {
		'name': 'map.getHeight()',
		'category': 'map',
		'type': 'method',
		'description': 'Returns the height of the map, in pixels.'
	},
	'map.getObjectTypeAt': {
		'name': 'map.getObjectTypeAt(x, y)',
		'category': 'map',
		'type': 'method',
		'description': 'Returns the type of the object at the given coordinates (or "empty" if there is no object there).'
	},
	'map.getPlayer': {
		'name': 'map.getPlayer()',
		'category': 'map',
		'type': 'method',
		'description': 'Returns the Player object.'
	},
	'map.getWidth': {
		'name': 'map.getWidth()',
		'category': 'map',
		'type': 'method',
		'description': 'Returns the width of the map, in pixels.'
	},
	'map.placeObject': {
		'name': 'map.placeObject(x, y, objectType)',
		'category': 'map',
		'type': 'method',
		'description': 'Places an object of the given type at the given coordinates.'
	},
	'map.placePlayer': {
		'name': 'map.placePlayer(x, y, color)',
		'category': 'map',
		'type': 'method',
		'description': 'Sets the background color of the given square.'
	},
	'map.setSquareColor': {
		'name': 'map.setSquareColor(x, y)',
		'category': 'map',
		'type': 'method',
		'description': 'Places the player at the given coordinates.'
	},

	'object.color': {
		'name': 'object.color',
		'category': 'object',
		'type': 'property',
		'description': 'The color of the object\'s symbol on the map.'
	},
	'object.onCollision': {
		'name': 'object.onCollision = function (player)',
		'category': 'object',
		'type': 'property',
		'description': 'The function that is executed when this object touches the player.'
	},
	'object.symbol': {
		'name': 'object.symbol',
		'category': 'object',
		'type': 'property',
		'description': 'The object\'s symbol on the map.'
	},

	'output.write': {
		'name': 'output.write(text)',
		'category': 'output',
		'type': 'method',
		'description': 'Writes the given text in the output area underneath the map.'
	},

	'player.atLocation': {
		'name': 'player.atLocation(x, y)',
		'category': 'player',
		'type': 'method',
		'description': 'Returns true if and only if the player is at the given location.'
	},
	'player.getX': {
		'name': 'player.getX()',
		'category': 'player',
		'type': 'method',
		'description': 'Returns the x-coordinate of the player.'
	},
	'player.getY': {
		'name': 'player.getY()',
		'category': 'player',
		'type': 'method',
		'description': 'Returns the y-coordinate of the player.'
	},
	'player.hasItem': {
		'name': 'player.hasItem(itemType)',
		'category': 'player',
		'type': 'method',
		'description': 'Returns true if and only if the player has the given item.'
	},
	'player.killedBy': {
		'name': 'player.killedBy(text)',
		'category': 'player',
		'type': 'method',
		'description': 'Kills the player and displays the given text as the cause of death.'
	},
	'player.setPhoneCallback': {
		'name': 'player.setPhoneCallback(callback)',
		'category': 'player',
		'type': 'method',
		'description': 'Sets the function that is executed when the player uses the function phone.'
	}
}
