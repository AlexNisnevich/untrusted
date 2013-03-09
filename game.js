
// directions for moving entities
var keys = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
}

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
		display.draw(x, y, objects[type].symbol);
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
		lineNumbers: true
	});
	editor.setSize(600, 500);

	$.get('levels/blocks.js', function (lvlCode) {
		// load and initialize level
		editor.setValue(lvlCode);
		evalLevelCode();

		// get editable line ranges from level metadata
		levelMetadata = editor.getLine(0);
		editableLineRanges = JSON.parse(levelMetadata.slice(3)).editable
		editableLines = [];
		for (var j = 0; j < editableLineRanges.length; j++) {
			range = editableLineRanges[j];
			for (var i = range[0]; i <= range[1]; i++) {
				editableLines.push(i);
			}
		}
		editor.setLine(0, '');

		// set bg color for uneditable lines
		for (var i = 0; i < editor.lineCount(); i++) {
			if (editableLines.indexOf(i + 1) == -1) {
				line = $('.CodeMirror-lines').children().first().children().eq(2).children().eq(i);
				line.css('background', '#311');
			}
		}

		// only allow editing on editable lines
		editor.on('beforeChange', function (instance, change) {
			if (editableLines.indexOf(change.to.line) == -1) {
				change.cancel();
			}
		});
	});
}

function evalLevelCode() {
	eval(editor.getValue());
	map.reset();
	startLevel(map);
}
