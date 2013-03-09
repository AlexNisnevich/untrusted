
// directions for moving entities
var keys = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

var display;
var editor;
var map;
var player;

var dimensions = {
	width: 50,
	height: 25
};

var Map = function () {
	this.reset = function () {
		display.clear();
		this._grid = new Array(dimensions.width);
		for (var x = 0; x < dimensions.width; x++) {
			this._grid[x] = new Array(dimensions.height);
			for (var y = 0; y < dimensions.height; y++) {
				this._grid[x][y] = 'empty';
			}
		}
	};

	this.placeObject = function (x, y, type) {
		this._grid[x][y] = type;
		display.drawObject(x, y, type);
	};

	// Initialize with empty grid
	this.reset();
};

var objects = {
	'empty' : {
		'symbol': ' ',
		'passable': true
	},
	'block': {
		'symbol': '#',
		'color': '#f00',
		'passable': false
	},
	'tree': {
		'symbol': '♣',
		'color': '#080',
		'passable': false
	},
    'exit' : {
        'symbol' : String.fromCharCode(0x2588),
        'color': '#0ff',
        'passable': true
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

	if (canMoveTo(new_x,new_y)) {
		display.drawObject(cur_x,cur_y, map._grid[cur_x][cur_y]);
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

    // drawObject takes care of looking up an object's symbol and color
    // according to name (NOT according to the actual object literal!)
    display.drawObject = function (x,y, object) {  
        var symbol = objects[object].symbol;
        var color; 
        if (objects[object].color) {
            color = objects[object].color;
        }
        else {
            color = "#fff";
        }

        display.draw(x, y, symbol, color);
    };

	display.setOptions({
		fontSize: 20,
		fontStyle: "bold"
	});
	$('#screen').append(display.getContainer());

	$("canvas").attr("contentEditable", "true");
	display.getContainer().addEventListener("keydown", function(e) {
		console.log(e.keyCode);
		if (keys[e.keyCode]) {
			map.player.move(keys[e.keyCode]);
		}
	});

	map = new Map();

	editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		matchBrackets: true
	});
	editor.setSize(600, 500);

	$.get('levels/blocks.js', function (lvlCode) {
		editor.setValue(lvlCode);
		evalLevelCode();
	});
}

function evalLevelCode() {
	eval(editor.getValue());
	map.reset();
	startLevel(map);
}
