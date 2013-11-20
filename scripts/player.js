function Player(x, y, map) {
	var _x = x;
	var _y = y;
	var _color = "#0f0";
	var _inventory = [];

	this.rep = "@";

	this.map = map;
	this.display = map.display;
	this.game = map.game;

	this.canMove = false;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }

	this.getColor = function () { return _color; }
	this.setColor = function (c) {
		_color = c;
		this.draw();
	}

	this.init = function () {
	}

	this.draw = function () {
		var bgColor = this.map.getGrid()[_x][_y].bgColor
		this.display.draw(_x, _y, this.rep, _color, bgColor);
	}

	this.atLocation = function (x, y) {
		return (_x === x && _y === y);
	}

	this.move = function (direction, fromKeyboard) {
        // are we allowing keyboard input right now?
		if (!this.canMove && fromKeyboard) {
			return false;
		}

		var cur_x = _x;
		var cur_y = _y;
		var new_x;
		var new_y;

		if (direction === 'up') {
			new_x = cur_x;
			new_y = cur_y - 1;
		}
		else if (direction === 'down') {
			new_x = cur_x;
			new_y = cur_y + 1;
		}
		else if (direction === 'left') {
			new_x = cur_x - 1;
			new_y = cur_y;
		}
		else if (direction === 'right') {
			new_x = cur_x + 1;
			new_y = cur_y;
		}
		else if (direction === 'rest') {
			new_x = cur_x;
			new_y = cur_y;
		}

		if (this.map.canMoveTo(new_x, new_y)) {
			this.display.drawObject(map, cur_x, cur_y, this.map.getGrid()[cur_x][cur_y].type, this.map.getGrid()[cur_x][cur_y].bgColor);
			_x = new_x;
			_y = new_y;
			this.draw();

            if (fromKeyboard) {
                this.canMove = false;
            }

			this.afterMove(_x, _y);

            if (fromKeyboard) {
            	// called from map to take into account key delay
            	map.reenableMovementForPlayer(this);
            }
		}
	};

	this.afterMove = function (x, y) {
		player = this;

		this.map.moveAllDynamicObjects();
		this.map.hideChapter();

		var onTransport = false;

		// check for collision with dynamic object
		for (var i = 0; i < this.map.getDynamicObjects().length; i++) {
			var object = this.map.getDynamicObjects()[i];
			if (object.getX() === x && object.getY() === y) {
				var objDef = this.map.getObjectDefinition(object.getType());
				if (objDef.onCollision) {
					objDef.onCollision(player, object);
				}
				if (objDef.transport) {
					onTransport = true;
				}
			}
		}

		if (!onTransport) {
			// check for collision with static object
			var objectName = this.map.getGrid()[x][y].type;
			var object = this.map.getObjectDefinition(objectName);
			if (object.type == 'item') {
				this.pickUpItem(objectName, object);
			} else if (object.onCollision) {
				this.game.validateCallback(function () {
					object.onCollision(player, player.game)
				});
			}
		}

		this.game.display.drawAll(this.map); // in case there are any artifacts

        if (this.map.afterMoveCallback) {
            this.map.afterMoveCallback();
        }
	}

	this.killedBy = function (killer) {
		this.game.sound.playSound('hurt');
		this.game.restartLevel();
		this.game.output.write('You have been killed by ' + killer + '!');
	}

	this.pickUpItem = function (objectName, object) {
		player = this;

		if (object.isGlobal) {
			this.game.addToGlobalInventory(objectName);
		} else {
			_inventory.push(objectName);
		}
		map.removeItemFromMap(_x, _y, objectName);
		map.refresh();
		this.game.sound.playSound('pickup');

		if (object.onPickUp) {
			this.game.validateCallback(function () {
				object.onPickUp(player, player.game)
			});
		}
	}

	this.hasItem = function (item) {
		return (_inventory.indexOf(item) > -1) || (this.game.checkGlobalInventory(item));
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}

    this.falling = false;

	// Constructor
	this.init();
}
