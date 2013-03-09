
// directions for moving entities
var keys = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

var levelFileNames = [
	'blocks.js',
	'levelTwo.js',
	'multiplicity.js',
	'traps.js',
];

var display;
var output;
var editor;
var map;
var currentLevel = 0; //level numbers start at 0 because coding :\

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
	'trap': {
		'symbol': ' ',
		'passable': true,
		'onCollision': function (player) {
			player.killedBy('an invisible trap');
		}
	},
	'exit' : {
		'symbol' : String.fromCharCode(0x2588),
		'color': '#0ff',
		'passable': true,
		'onCollision': function (player) {
			moveToNextLevel();
		}
	},
	'player' : {
		'symbol' : '@',
		'color' : '#0f0',
		'passable' : false
	}
};

function moveToNextLevel() {
	console.log("On exit square!");
	currentLevel++;
	getLevel(currentLevel);
};

function init() {
	display = new ROT.Display({width: dimensions.width, height: dimensions.height,
		fontSize: 20, fontStyle: "bold"});

	// drawObject takes care of looking up an object's symbol and color
	// according to name (NOT according to the actual object literal!)
	display.drawObject = function (x, y, object, bgColor) {
		var symbol = objects[object].symbol;
		var color;
		if (objects[object].color) {
			color = objects[object].color;
		} else {
			color = "#fff";
		}

		if (!bgColor) {
			bgColor = "#000";
		}

		display.draw(x, y, symbol, color, bgColor);
	};

	$('#screen').append(display.getContainer());

	// required so all canvas elements can detect keyboard events
	$("canvas").first().attr("contentEditable", "true");
	display.getContainer().addEventListener("keydown", function(e) {
		if (keys[e.keyCode]) {
			map.player.move(keys[e.keyCode]);
		}
	});
	display.getContainer().addEventListener("click", function(e) {
		$(display.getContainer()).addClass('focus');
		$('.CodeMirror').removeClass('focus');
	});

	output = new ROT.Display({width: dimensions.width, height: 1, fontSize: 20});
	$('#output').append(output.getContainer());

	map = new Map(display);

	getLevel(currentLevel);
}

// makes an ajax request to get the level text file and
// then loads it into the game
function getLevel(levelNumber) {
	var fileName;
	if (levelNumber < levelFileNames.length) {
		fileName = levelFileNames[levelNumber];
	}
	else {
		fileName = "dummyLevel.js";
	}
	$.get('levels/' + fileName, function (codeText) {
		if (editor) {
			editor.toTextArea();
		}
		loadLevel(codeText);
	});
}

function loadLevel(lvlCode) {
	// initialize CodeMirror editor
	editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function () {}}
	});
	editor.setSize(600, 500);
	editor.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	// load and initialize level
	editor.setValue(lvlCode);
	evalLevelCode();

	// get editable line ranges from level metadata
	levelMetadata = editor.getLine(0);
	editableLineRanges = JSON.parse(levelMetadata.slice(3)).editable;
	editableLines = [];
	for (var j = 0; j < editableLineRanges.length; j++) {
		range = editableLineRanges[j];
		for (var i = range[0]; i <= range[1]; i++) {
			editableLines.push(i - 1);
		}
	}
	editor.removeLine(0);

	// only allow editing on editable lines, and don't allow removal of lines
	editor.on('beforeChange', function (instance, change) {
		if (editableLines.indexOf(change.to.line) == -1 || change.to.line != change.from.line) {
			change.cancel();
		}
	});

	// set bg color for uneditable line
	editor.on('update', function (instance) {
		for (var i = 0; i < editor.lineCount(); i++) {
			if (editableLines.indexOf(i) == -1) {
				line = $('.CodeMirror-lines').children().first().children().eq(2).children().eq(i);
				line.addClass('disabled');
			}
		}
	});
	editor.refresh();
}

function focusOnMap() {
	$('canvas').first().attr('tabindex', '0').click().focus();
}

function focusOnEditor() {
	editor.focus();
}

function resetEditor() {
    getLevel(currentLevel);
}

function evalLevelCode() {
	var playerCode = editor.getValue();
	var validatedStartLevel = validate(playerCode, currentLevel);
	if (validatedStartLevel) {
		map.reset();
		validatedStartLevel(map);
	}
}

shortcut.add('ctrl+1', focusOnMap);
shortcut.add('ctrl+2', focusOnEditor);
shortcut.add('ctrl+5', evalLevelCode);
shortcut.add('ctrl+4', resetEditor);
