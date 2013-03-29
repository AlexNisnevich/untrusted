ROT.Display.create = function(game, opts) {
	opts['fontFamily'] = '"droid sans mono", monospace';
	var display = new ROT.Display(opts);
	display.game = game;
	return display;
}

// multiplicand is used for fading effects
// [255, 255, 255]: fully displayed
// [0, 0, 0]: completely hidden
ROT.Display.prototype.multiplicand = [255, 255, 255];

ROT.Display.prototype.setupEventHandlers = function() {
	var game = this.game;

	// directions for moving entities
	var keys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	// contentEditable is required for canvas elements to detect keyboard events
	$(this.getContainer()).attr("contentEditable", "true");
	this.getContainer().addEventListener("keydown", function(e) {
		if (keys[e.keyCode]) {
			game.map.getPlayer().move(keys[e.keyCode]);
		}
	});

	this.getContainer().addEventListener("click", function(e) {
		$(this).addClass('focus');
		$('.CodeMirror').removeClass('focus');
	});
}

// drawObject takes care of looking up an object's symbol and color
// according to name (NOT according to the actual object literal!)
ROT.Display.prototype.drawObject = function (x, y, object, bgColor) {
	var symbol = this.game.objects[object].symbol;
	var color;
	if (this.game.objects[object].color) {
		color = this.game.objects[object].color;
	} else {
		color = "#fff";
	}

	if (!bgColor) {
		bgColor = "#000";
	}

	color = ROT.Color.toHex(ROT.Color.multiply(this.multiplicand, ROT.Color.fromString(color)));
	bgColor = ROT.Color.toHex(ROT.Color.multiply(this.multiplicand, ROT.Color.fromString(bgColor)));

	this.draw(x, y, symbol, color, bgColor);
};

ROT.Display.prototype.drawAll = function(map) {
	var game = this.game;
	for (var x = 0; x < game.dimensions.width; x++) {
		for (var y = 0; y < game.dimensions.height; y++) {
			this.drawObject(x, y, map.getGrid()[x][y].type, map.getGrid()[x][y].bgColor);
		}
	}
	if (map.getPlayer()) { map.getPlayer().draw(); }
}

ROT.Display.prototype.drawAround = function(map, xCenter, yCenter) {
	var game = this.game;
	var xStart = Math.max(0, xCenter - 2);
	var xEnd = Math.min(game.dimensions.width - 1, xCenter + 2);
	var yStart = Math.max(0, yCenter - 2);
	var yEnd = Math.min(game.dimensions.height - 1, yCenter + 2);

	for (var x = xStart; x <= xEnd; x++) {
		for (var y = yStart; y <= yEnd; y++) {
			this.drawObject(x, y, map.getGrid()[x][y].type, map.getGrid()[x][y].bgColor);
		}
	}
	if (map.getPlayer()) { map.getPlayer().draw(); }
}

ROT.Display.prototype.fadeOut = function (map, callback, i) {
	var display = this;
	if (i <= 0) {
		if (callback) { callback(); }
	} else {
		if (!i) { i = 255; }
		this.multiplicand = [i, i, i];
		this.drawAll(map);
		setTimeout(function () {
			display.fadeOut(map, callback, i-10);
		}, 10);
	}
};

ROT.Display.prototype.fadeIn = function (map, callback, i) {
	var display = this;
	if (i > 255) {
		if (callback) { callback(); }
	} else {
		if (!i) { i = 0; }
		this.multiplicand = [i, i, i];
		this.drawAll(map);
		setTimeout(function () {
			display.fadeIn(map, callback, i+5);
		}, 10);
	}
};

ROT.Display.prototype.write = function(text) {
	this.clear();
	this.drawText(0, 0, text);
}

ROT.Display.prototype.focus = function() {
	$(this.getContainer()).attr('tabindex', '0').click().focus();
}
