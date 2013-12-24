function Player(x, y, map) {
	var _x = x;
	var _y = y;
	var _color = "#0f0";

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
		this.display.drawAll(this.map);
	}

	this.init = function () {
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
		else if (direction === 'funcPhone') {
			game.sound.playSound('select');
			game.usePhone();
			return;
		}

		if (this.map.canMoveTo(new_x, new_y)) {
			_x = new_x;
			_y = new_y;
			this.display.drawAll(this.map);

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

	// NOT exposed to player, used for teleporters
	this.moveTo = function (dynamicObject) {
		_x = dynamicObject.getX();
		_y = dynamicObject.getY();
		this.display.drawAll(this.map);
	}

	this.afterMove = function (x, y) {
		player = this;

        this.hasTeleported = false; //necessary to prevent bugs with teleportation

		this.map.hideChapter();
		this.map.moveAllDynamicObjects();

		var onTransport = false;

		// check for collision with transport object
		for (var i = 0; i < this.map.getDynamicObjects().length; i++) {
			var object = this.map.getDynamicObjects()[i];
			if (object.getX() === x && object.getY() === y) {
				var objDef = this.map.getObjectDefinition(object.getType());
				if (objDef.transport) {
					onTransport = true;
				}
			}
		}

        // check for collision with static object UNLESS
        // we are on a transport
		if (!onTransport) {
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
	}

	this.killedBy = function (killer) {
		this.game.sound.playSound('hurt');
		this.game.restartLevel();

		this.map.displayChapter('You have been killed by \n' + killer + '!', 'death');
	}

	this.pickUpItem = function (itemName, object) {
		player = this;

		this.game.addToInventory(itemName);
		map.removeItemFromMap(_x, _y, itemName);
		map.refresh();
		this.game.sound.playSound('pickup');

		if (object.onPickUp) {
			this.game.validateCallback(function () {
				setTimeout(function () {
					object.onPickUp(player, player.game);
				}, 100);
				// timeout is so that written text is not immediately overwritten
				// TODO: play around with Display.writeStatus so that this is
				// not necessary
			});
		}
	}

	this.hasItem = function (itemName) {
		return this.game.checkInventory(itemName);
	}

	this.removeItem = function (itemName) {
		var object = this.game.objects[itemName];

		this.game.removeFromInventory(itemName);
		object.onDrop(this, this.game);
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}

    this.falling = false;

	// Constructor
	this.init();
}
