ROT.Display.create = function(game, opts) {
	opts['fontFamily'] = '"droid sans mono", monospace';
	var display = new ROT.Display(opts);
	display.game = game;
	return display;
};

ROT.Display.prototype.setupEventHandlers = function() {
	var display = this;
	var game = this.game;

	// directions for moving entities
	var keys = {
		37: 'left', // left arrow
		38: 'up', // up arrow
		39: 'right', // right arrow
		40: 'down', // down arrow
		65: 'left', // A
		68: 'right', // D
		72: 'left', // H
		74: 'down', // J
		75: 'up', // K
		76: 'right', // L
		81: 'funcPhone', // Q
		82: 'rest', // R
		83: 'down', // S
		87: 'up' // W
	};

	// contentEditable is required for canvas elements to detect keyboard events
	$(this.getContainer()).attr("contentEditable", "true");
	this.getContainer().addEventListener("keydown", function(e) {
		if (display.intro == true) {
			game.start();
			display.intro = false;
		} else if (keys[e.keyCode] && game.map.getPlayer()) {
			game.map.getPlayer().move(keys[e.keyCode], true);
		}
	});

	this.getContainer().addEventListener("click", function(e) {
		$(this).addClass('focus');
		$('.CodeMirror').removeClass('focus');

		$('#helpPane').hide();
        $('#menuPane').hide();
	});
};

// drawObject takes care of looking up an object's symbol and color
// according to name (NOT according to the actual object literal!)
ROT.Display.prototype.drawObject = function (map, x, y, object) {
	var type = object.type;
	var definition = map.getObjectDefinition(type) || this.savedDefinitions[type];

	var symbol = definition.symbol;
	var color = object.color || definition.color || "#fff";
	var bgColor = object.bgColor || "#000";

	this.draw(x, y, symbol, color, bgColor);
};

ROT.Display.prototype.drawAll = function(map) {
	if (!this.offset) {this.offset = 0;}

	var game = this.game;

	// initialize grid
	var grid = new Array(game.dimensions.width);
	for (var x = 0; x < game.dimensions.width; x++) {
		grid[x] = new Array(game.dimensions.height);
		for (var y = 0; y < game.dimensions.height; y++) {
			grid[x][y] = {
				type: 'empty',
				bgColor: 'black'
			};
		}
	}

	// place static objects
	for (var x = 0; x < game.dimensions.width; x++) {
		for (var y = 0; y < game.dimensions.height; y++) {
			grid[x][y] = {
				type: map.getGrid()[x][y].type,
				bgColor: map.getGrid()[x][y].bgColor
			};
		}
	}

	// place dynamic objects
	for (var i = 0; i < map.getDynamicObjects().length; i++) {
		var obj = map.getDynamicObjects()[i];
		grid[obj.getX()][obj.getY()] = {
			type: obj.getType(),
			bgColor: map.getGrid()[obj.getX()][obj.getY()].bgColor
		};
	}

	// place player
	if (map.getPlayer()) {
		var player = map.getPlayer();
		grid[player.getX()][player.getY()] = {
			type: 'player',
			color: player.getColor(),
			bgColor: map.getGrid()[player.getX()][player.getY()].bgColor
		}
	}

	// draw grid
	for (var x = 0; x < game.dimensions.width; x++) {
		for (var y = Math.max(0, this.offset - map.getHeight()); y < game.dimensions.height; y++) {
			this.drawObject(map, x, y + this.offset, grid[x][y]);
		}
	}

	// write error messages, if any
	if (this.errors && this.errors.length > 0) {
		for (var i = 0; i < this.errors.length; i++) {
			var y = this.game.dimensions.height - this.errors.length + i;
			this.drawText(0, y, this.errors[i]);
		}
	}

	// store for potential later use
	this.grid = grid;
};

ROT.Display.prototype.drawPreviousLevel = function(map, offset) {
	if (!offset) {offset = 0;}

	var game = this.game;
	var grid = this.savedGrid;

	if (grid) {
		for (var x = 0; x < game.dimensions.width; x++) {
			for (var y = 0; y < game.dimensions.height; y++) {
				this.drawObject(map, x, y + offset, grid[x][y]);
			}
		}
	}
};

ROT.Display.prototype.saveGrid = function (map) {
	this.savedGrid = this.grid;
	this.savedDefinitions = map.getObjectDefinitions();
}

ROT.Display.prototype.playIntro = function (map, i) {
	display = this;

	if (i < 0) {
		this.intro = true;
	} else {
		if (typeof i === 'undefined') { i = map.getHeight(); }
		this.clear();
		this.drawText(0, i - 2, "%c{#0f0}> initialize")
		this.drawText(15, i + 3, "U N T R U S T E D");
		this.drawText(20, i + 5, "- or - ");
		this.drawText(5, i + 7, "THE CONTINUING ADVENTURES OF DR. EVAL");
		this.drawText(10, i + 20, "Press any key to begin ...")
		setTimeout(function () {
			display.playIntro(map, i - 1);
		}, 100);
	}
};

ROT.Display.prototype.fadeIn = function (map, speed, callback, i) {
	var display = this;
	var game = this.game;
	var command = "%c{#0f0}> run " + game.levelFileNames[game.currentLevel - 1];

	if (i < -3) {
		if (callback) { callback(); }
	} else {
		if (typeof i === 'undefined') { i = map.getHeight(); }
		this.clear();
		this.errors = [];
		this.drawPreviousLevel(map, i - map.getHeight());

		this.offset = i + 3;
		this.drawAll(map);

		this.drawText(0, i + 1, command);

		setTimeout(function () {
			display.fadeIn(map, speed, callback, i - 1);
		}, speed);
	}
};

ROT.Display.prototype.write = function(text) {
	this.clear();
	this.drawText(0, 0, text);
};

ROT.Display.prototype.writeStatus = function(text) {
	var map = this.game.map;
	var x = Math.floor((map.getWidth() - text.length) / 2);
	var y = map.getHeight() - 2;
	this.drawText(x, y, text);
};

ROT.Display.prototype.appendError = function(errorText) {
	var map = this.game.map;
	var command = "%c{#0f0}> run " + game.levelFileNames[game.currentLevel - 1];

	this.offset -= 3;
	this.errors = this.errors.concat([command, errorText, ""]);
	this.clear();
	this.drawAll(map);
};

ROT.Display.prototype.focus = function() {
	$('#screen').show();
	$(this.getContainer()).attr('tabindex', '0').click().focus();
};
