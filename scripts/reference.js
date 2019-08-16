Game.prototype.reference = {
    'canvas.beginPath': {
        'name': 'canvasContext.beginPath()',
        'category': 'canvas',
        'type': 'method',
        'description': 'Begins drawing a new shape.'
    },
    'canvas.lineTo': {
        'name': 'canvasContext.lineTo(x, y)',
        'category': 'canvas',
        'type': 'method',
        'description': 'Sets the end coordinates of a line.'
    },
    'canvas.lineWidth': {
        'name': 'canvasContext.lineWidth',
        'category': 'canvas',
        'type': 'property',
        'description': 'Determines the width of the next lines drawn.'
    },
    'canvas.moveTo': {
        'name': 'canvasContext.moveTo(x, y)',
        'category': 'canvas',
        'type': 'method',
        'description': 'Sets the start coordinates of a line.'
    },
    'canvas.stroke': {
        'name': 'canvasContext.stroke()',
        'category': 'canvas',
        'type': 'method',
        'description': 'Draws a line whose coordinates have been defined by <b>lineTo</b> and <b>moveTo</b>.'
    },
    'canvas.strokeStyle': {
        'name': 'canvasContext.strokeStyle',
        'category': 'canvas',
        'type': 'property',
        'description': 'Determines the color (and, optionally, other properties) of the next lines drawn.'
    },
    'canvas.fillStyle': {
        'name': 'canvasContext.fillStyle',
        'category': 'canvas',
        'type': 'property',
        'description': 'Determines the color (and, optionally, other properties) of the text drawn with <b>fillText</b>.'
    },
    'canvas.fillText': {
        'name': 'canvasContext.fillText(text, x, y)',
        'category': 'canvas',
        'type': 'method',
        'description': 'Draws a given piece of text, starting at specified coordinates, to to the canvas',
    },
    'global.$': {
        'name': '$(html)',
        'category': 'global',
        'type': 'method',
        'description': 'When passed an HTML string, $ returns a corresponding <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance.'
    },
    'global.objective': {
        'name': 'objective(map)',
        'category': 'global',
        'type': 'method',
        'description': 'The player exits the level as soon as this method returns true.'
    },
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

    'jQuery.addClass': {
        'name': 'jQueryObject.addClass(class)',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Adds the given CSS class to the DOM element(s) specified by the jQuery object.'
    },
    'jQuery.children': {
        'name': 'jQueryObject.children()',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Returns the children of the DOM element specified by the jQuery object, as a jQuery array.'
    },
    'jQuery.find': {
        'name': 'jQueryObject.find(selector)',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Returns all elements in the DOM tree specified by the jQuery object that match the given CSS selector, as a jQuery array.'
    },
    'jQuery.first': {
        'name': 'jQueryObject.first()',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Returns the first element of a jQuery array.'
    },
    'jQuery.hasClass': {
        'name': 'jQueryObject.hasClass(class)',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Returns true if and only if the DOM element specified by the jQuery object has the given CSS class.'
    },
    'jQuery.length': {
        'name': 'jQueryObject.length',
        'category': 'jQuery',
        'type': 'property',
        'description': 'Returns the number of elements in a jQuery array.'
    },
    'jQuery.next': {
        'name': 'jQueryObject.next()',
        'category': 'jQuery',
        'type': 'property',
        'description': 'Returns the next sibling of the DOM element specified by the jQuery object.'
    },
    'jQuery.parent': {
        'name': 'jQueryObject.parent()',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Returns the parent of the DOM element specified by the jQuery object.'
    },
    'jQuery.prev': {
        'name': 'jQueryObject.prev()',
        'category': 'jQuery',
        'type': 'property',
        'description': 'Returns the previous sibling of the DOM element specified by the jQuery object.'
    },
    'jQuery.removeClass': {
        'name': 'jQueryObject.removeClass(class)',
        'category': 'jQuery',
        'type': 'method',
        'description': 'Removes the given CSS class from the DOM element(s) specified by the jQuery object.'
    },

    'map.countObjects': {
        'name': 'map.countObjects(objectType)',
        'category': 'map',
        'type': 'method',
        'description': 'Returns the number of objects of the given type on the map.'
    },
    'map.createFromDOM': {
        'name': 'map.createFromDOM($html)',
        'category': 'map',
        'type': 'method',
        'description': 'Creates the map from a <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance, rendering the map as a DOM (document object model) rather than a grid.'
    },
    'map.createFromGrid': {
        'name': 'map.createFromGrid(grid, tiles, xOffset, yOffset)',
        'category': 'map',
        'type': 'method',
        'description': 'Places objects on the map corresponding to their position on the grid (an array of strings), with mappings as defined in tiles (a dictionary of character -> object type mappings), at the given offset from the top-left corner of the map.'
    },
    'map.createLine': {
        'name': 'map.createLine([x1, x2], [y1 y2], callback)',
        'category': 'map',
        'type': 'method',
        'description': 'Places a line on the map between the given points, that triggers the given callback when the player touches it. (Note that the line is invisible: createLine does <i>not</i> draw anything to the <a onclick="$(\'#helpPaneSidebar .category#canvas\').click();">canvas</a>.)'
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
        'description': 'Returns the 2D drawing context of the <a onclick="$(\'#helpPaneSidebar .category#canvas\').click();">canvas</a> overlaying the map.'
    },
    'map.getCanvasCoords': {
        'name': 'map.getCanvasCoords(obj) / map.getCanvasCoords(x, y)',
        'category': 'map',
        'type': 'method',
        'description': 'Returns {"x": x, "y": y}, where x and y are the respective coordinates of the given object or grid position on the canvas returned by map.getCanvasContext().'
    },
    'map.getDOM': {
        'name': 'map.getDOM()',
        'category': 'map',
        'type': 'method',
        'description': 'Returns the <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance representing the map.'
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
        'description': 'Returns the height of the map, in cells.'
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
        'description': 'Returns the width of the map, in cells.'
    },
    'map.isStartOfLevel': {
        'name': 'map.isStartOfLevel()',
        'category': 'map',
        'type': 'method',
        'description': 'Returns true if called while a level is starting.'
    },
    'map.overrideKey': {
        'name': 'map.overrideKey(key, callback)',
        'category': 'map',
        'type': 'method',
        'description': 'Overrides the action performed by pressing the given key (<i>left</i>, <i>right</i>, <i>up</i>, or <i>down</i>).'
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
    'map.timeout': {
        'name': 'map.timeout(callback, delay)',
        'category': 'map',
        'type': 'method',
        'description': 'Starts a timer (c.f. setTimeout) of the given delay, in milliseconds (minimum 25 ms). Unlike map.startTimer, the callback will only run once.'
    },
    'map.startTimer': {
        'name': 'map.startTimer(callback, delay)',
        'category': 'map',
        'type': 'method',
        'description': 'Starts a timer (c.f. setInterval) of the given delay, in milliseconds (minimum 25 ms).'
    },
    'map.updateDOM': {
        'name': 'map.updateDOM($html)',
        'category': 'map',
        'type': 'method',
        'description': 'Updates the <a onclick="$(\'#helpPaneSidebar .category#jQuery\').click();">jQuery</a> instance representing the map.'
    },
    'map.validateAtLeastXLines': {
        'name': 'map.validateAtLeastXLines(num)',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are not at least num lines (created by map.createLine) on the map.'
    },
    'map.validateAtLeastXObjects': {
        'name': 'map.validateAtLeastXObjects(num, objectType)',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are not at least num objects of type objectType on the map.'
    },
    'map.validateAtMostXDynamicObjects': {
        'name': 'map.validateExactlyXManyObjects(num)',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are more than num dynamic objects on the map.'
    },
    'map.validateExactlyXManyObjects': {
        'name': 'map.validateExactlyXManyObjects(num, objectType)',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are not exactly num objects of type objectType on the map.'
    },
    'map.validateNoTimers': {
        'name': 'map.validateNoTimers()',
        'category': 'map',
        'type': 'method',
        'description': 'Raises an exception if there are any timers currently set with map.startTimer.'
    },
    'map.writeStatus': {
        'name': 'map.writeStatus(message)',
        'category': 'map',
        'type': 'method',
        'description': 'Displays a message at the bottom of the map.'
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
        'description': '(For dynamic objects only.) Returns true if (and only if) the object is able to move one square in the given direction, which can be "left", "right", "up", or "down".'
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
        'description': '(For non-dynamic objects only.) The function that determines whether or not the player can pass through this object.'
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
    'object.onDestroy': {
        'name': 'object.onDestroy = function (object)',
        'category': 'object',
        'type': 'property',
        'description': '(For dynamic objects only.) The function that is executed when this object is destroyed.'
    },
    'object.projectile': {
        'name': 'object.projectile',
        'category': 'object',
        'type': 'property',
        'description': '(For dynamic objects only.) If true, this object destroys any dynamic object (or player) that it collides with, and is itself destroyed when it collides with anything.'
    },
    'object.pushable': {
        'name': 'object.pushable',
        'category': 'object',
        'type': 'property',
        'description': '(For dynamic objects only.) If true, this object can be pushed by the player.'
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
    'player.getLastMoveDirection': {
        'name': 'player.getLastMoveDirection()',
        'category': 'player',
        'type': 'method',
        'description': 'Returns the direction of last move by the player.'
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
