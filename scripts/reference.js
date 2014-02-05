Game.prototype.reference = {
    'global.onExit': {
        'name': 'onExit(map)',
        'category': 'global',
        'type': 'method',
        'description': 'The player can exit the level only if this method returns true.'
    },
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

    'map.createFromGrid': {
        'name': 'map.createFromGrid(grid, tiles, xOffset, yOffset)',
        'category': 'map',
        'type': 'method',
        'description': 'Places objects on the map corresponding to their position on the grid (an array of strings), with mappings as defined in tiles (a dictionary of character -> object type mappings), at the given offset from the top-left corner of the map.'
    },
    'map.displayChapter': {
        'name': 'map.displayChapter(chapter)',
        'category': 'map',
        'type': 'method',
        'description': 'Displays the given chapter name.'
    },
    'map.defineObject': {
        'name': 'map.defineObject(type, properties)',
        'category': 'map',
        'type': 'method',
        'description': 'Defines a new type of <a onclick="$(\'#helpPaneSidebar .category#object\').click();">object</a> with the given properties. Note that type definitions created with map.defineObject only persist in the scope of the level.'
    },
    'map.getAdjacentEmptyCells': {
        'name': 'map.getAdjacentEmptyCells(x, y)',
        'category': 'map',
        'type': 'method',
        'description': 'Returns the empty cells adjacent to the cell at the given coordinates (if any), as an array of items of the form <i>[[x, y], direction]</i>, where (x, y) are the coordinates of each empty cell, and <i>direction</i> is the direction from the given cell to each empty cell ("left", "right", "up", or "down").'
    },
    'map.getCanvasContext': {
        'name': 'map.getCanvasContext()',
        'category': 'map',
        'type': 'method',
        'description': 'Returns the 2D drawing context of the canvas overlaying the map.'
    },
    'map.getCanvasCoords': {
        'name': 'map.getCanvasCoords(obj)',
        'category': 'map',
        'type': 'method',
        'description': 'Returns {"x": x, "y": y}, where x and y are the respective coordinates of the given object on the canvas returned by map.getCanvasContext().'
    },
    'map.getDynamicObjects': {
        'name': 'map.getDynamicObjects()',
        'category': 'map',
        'type': 'method',
        'description': 'Returns all dynamic objects currently on the map.'
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
    'map.getRandomColor': {
        'name': 'map.getRandomColor(start, end)',
        'category': 'map',
        'type': 'method',
        'description': 'Returns a hexadecimal string representing a random color in between the start and end colors. The start and end colors must be arrays of the form [R, G, B], where R, G, and B are decimal integers.'
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
        'name': 'map.placePlayer(x, y)',
        'category': 'map',
        'type': 'method',
        'description': 'Places the player at the given coordinates.'
    },
    'map.setSquareColor': {
        'name': 'map.setSquareColor(x, y, color)',
        'category': 'map',
        'type': 'method',
        'description': 'Sets the background color of the given square.'
    },
    'map.setSquareColor': {
        'name': 'map.setSquareColor(x, y, color)',
        'category': 'map',
        'type': 'method',
        'description': 'Sets the background color of the given square.'
    },
    'map.startTimer': {
        'name': 'map.startTimer(callback, delay)',
        'category': 'map',
        'type': 'method',
        'description': 'Starts a timer (c.f. setInterval) of the given delay, in milliseconds (minimum 25 ms).'
    },
    'map.validateAtLeastXObjects': {
        'name': 'map.validateAtLeastXObjects(num, objectType)',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are not at least num objects of type objectType on the map.'
    },
    'map.validateExactlyXManyObjects': {
        'name': 'map.validateExactlyXManyObjects(num, objectType)',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are not exactly num objects of type objectType on the map.'
    },

    'object.behavior': {
        'name': 'object.behavior = function (object)',
        'category': 'object',
        'type': 'property',
        'description': '(For dynamic objects only.) The function that is executed each time it is this object\'s turn.'
    },
    'object.canMove': {
        'name': 'object.canMove(direction)',
        'category': 'object',
        'type': 'method',
        'description': '(For dynamic objects only.) Returns true iff the object is able to move one square in the given direction, which can be "left", "right", "up", or "down".'
    },
    'object.color': {
        'name': 'object.color',
        'category': 'object',
        'type': 'property',
        'description': 'The color of the object\'s symbol on the map.'
    },
    'object.findNearest': {
        'name': 'object.findNearest(type)',
        'category': 'object',
        'type': 'method',
        'description': '(For dynamic objects only.) Returns the x and y coordinates of the nearest object of the given type to this object, as a hash.'
    },
    'object.getX': {
        'name': 'object.getX()',
        'category': 'object',
        'type': 'method',
        'description': '(For dynamic objects only.) Returns the x-coordinate of the object.'
    },
    'object.getY': {
        'name': 'object.getY()',
        'category': 'object',
        'type': 'method',
        'description': '(For dynamic objects only.) Returns the y-coordinate of the object.'
    },
    'object.giveItemTo': {
        'name': 'object.giveItemTo(target, item)',
        'category': 'object',
        'type': 'method',
        'description': '(For dynamic objects only.) Gives the given item to the target (generally, the player). Can only be done if the object and the player have just collided.'
    },
    'object.impassable': {
        'name': 'object.impassable = function (player, object)',
        'category': 'object',
        'type': 'property',
        'description': 'The function that is determines whether or not the player can pass through this object.'
    },
    'object.inventory': {
        'name': 'object.inventory',
        'category': 'object',
        'type': 'property',
        'description': '(For dynamic objects only.) The list of items that every object of this type starts with.'
    },
    'object.move': {
        'name': 'object.move(direction)',
        'category': 'object',
        'type': 'method',
        'description': '(For dynamic objects only.) Moves the object one square in the given direction, which can be "left", "right", "up", or "down". An object can only move once per turn.'
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
    'object.setTarget': {
        'name': 'object.setTarget()',
        'category': 'object',
        'type': 'method',
        'description': '(For teleporters only.) Sets the destination of this teleporter.'
    },
    'object.type': {
        'name': 'object.type',
        'category': 'object',
        'type': 'property',
        'description': 'Can be "item", "dynamic", or none. If "dynamic", then this object can move on turns that run each time that the player moves. If "item", then this object can be picked up.'
    },

    'player.atLocation': {
        'name': 'player.atLocation(x, y)',
        'category': 'player',
        'type': 'method',
        'description': 'Returns true if and only if the player is at the given location.'
    },
    'player.getColor': {
        'name': 'player.getColor()',
        'category': 'player',
        'type': 'method',
        'description': 'Returns the color of the player.'
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
    'player.move': {
        'name': 'player.move(direction)',
        'category': 'player',
        'type': 'method',
        'description': 'Moves the player one square in the given direction. The player can only move once in a given function.'
    },
    'player.removeItem': {
        'name': 'player.removeItem(itemType)',
        'category': 'player',
        'type': 'method',
        'description': 'Removes the given item from the player\'s inventory, if the player has the given item.'
    },
    'player.setColor': {
        'name': 'player.setColor(color)',
        'category': 'player',
        'type': 'method',
        'description': 'Sets the color of the player.'
    },
    'player.setPhoneCallback': {
        'name': 'player.setPhoneCallback(callback)',
        'category': 'player',
        'type': 'method',
        'description': 'Sets the function that is executed when the player uses the function phone.'
    }
};
