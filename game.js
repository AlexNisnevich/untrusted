
// directions for moving entities
var keys = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
}

var UP = "up";
var DOWN = "down";
var LEFT = "left";
var RIGHT = "right";

var display;
var map;
var player;

var dimensions = {
	width: 50,
	height: 25
};

var Map = function () {
	// Initialize with empty grid
	this._grid = new Array(dimensions.width);
	for (var x = 0; x < dimensions.width; x++) {
		this._grid[x] = new Array(dimensions.height);
		for (var y = 0; y < dimensions.height; y++) {
			this._grid[x][y] = 'empty';
		}
	}

	this.placeObject = function (x, y, type) {
		this._grid[x][y] = type;
		display.draw(x, y, objects[type].symbol);
	}
}

var objects = {
	'empty' : {
		'symbol': ' ',
		'passable': true
	},

	'block': {
		'symbol': '#',
		'passable': false
	},
	'tree': {
		'symbol': '♣',
		'passable': false
	}
};

var Player = function(x,y) {
	this._x = x;
	this._y = y;
	this._rep = "@";
	this._fgColor = "#0f0";
	this.draw();
}

Player.prototype.draw = function () {
	display.draw(this._x, this._y, this._rep, this._fgColor);
}

Player.prototype.move = function (direction) {
	var cur_x = this._x;
	var cur_y = this._y;
	var new_x;
	var new_y;

	if (direction === UP) {
		new_x = cur_x;
		new_y = cur_y - 1;
	}
	else if (direction === DOWN) {
		new_x = cur_x;
		new_y = cur_y + 1;
	}
	else if (direction === LEFT) {
		new_x = cur_x - 1;
		new_y = cur_y;
	}
	else if (direction === RIGHT) {
		new_x = cur_x + 1;
		new_y = cur_y;
	}

	if (canMoveTo(new_x,new_y)) {
		display.draw(cur_x,cur_y, objects[map._grid[cur_x][cur_y]].symbol);
		this._x = new_x;
		this._y = new_y;
		this.draw();
	}
	else {
		console.log("Can't move to " + new_x + ", " + new_y + ", reported from inside Player.move() method");
	}
};

function canMoveTo(x,y) {
	return objects[map._grid[x][y]].passable;
}

function init() {
	display = new ROT.Display({width: dimensions.width, height: dimensions.height});
	$('#screen').append(display.getContainer());

	display.setOptions( {fontSize: 20, fontStyle : "bold"});

	map = new Map();

	$.get('levels/blocks', function (lvlCode) {
		$('#editor').val(lvlCode);
		evalLevelCode();
	});
}

function evalLevelCode() {
	eval($('#editor').val());
	startLevel(map);
}

// Event listeners

document.addEventListener("keydown", function(e) {
	console.log(e.keyCode);
	if (keys[e.keyCode]) {
		map.player.move(keys[e.keyCode]);
	}
});
