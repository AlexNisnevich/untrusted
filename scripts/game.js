
var levelFileNames = [
	'blocks.js',
	'theReturnOfBlocks.js',
	'levelThree.js',
	'multiplicity.js',
	'traps.js',
    'trees.js',
];

var display;
var output;
var editor;
var map;

var currentLevel = 0; // level numbers start at 0 because coding :\

function init() {
	// Initialize map display
	display = new ROT.Display({
		width: dimensions.width,
		height: dimensions.height,
		fontFamily: '"droid sans mono", monospace',
		fontSize: 20,
		// fontStyle: "bold" // Droid Sans Mono's boldface makes many characters spill over
	});
	display.setupEventHandlers();
	$('#screen').append(display.getContainer());

	// Initialize output display
	output = new ROT.Display({
		width: dimensions.width * 1.33,
		height: 2,
		fontFamily: '"droid sans mono", monospace',
		fontSize: 15
	});
	$('#output').append(output.getContainer());

	// Start first level
	map = new Map(display);
	editor = createEditor("editor", '', 600, 500); // dummy editor
	getLevel(currentLevel);
	display.focus();

	// Enable shortcut keys
	shortcut.add('ctrl+1', display.focus);
	shortcut.add('ctrl+2', editor.focus);
	shortcut.add('ctrl+4', resetEditor);
	shortcut.add('ctrl+5', evalLevelCode);
	shortcut.add('ctrl+6', usePhone);
}

function moveToNextLevel() {
	currentLevel++;
	display.fadeOut(map, function () {
		getLevel(currentLevel);
	})
};

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
		loadLevel(codeText, levelNumber);
	});
}

function loadLevel(lvlCode, lvlNum) {
	// initialize CodeMirror editor
    editor = createEditor("editor", lvlCode, 600, 500);

	// initialize level
	editor.setValue(lvlCode);

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
	// also, set a line length limit of 80 chars
	editor.on('beforeChange', function (instance, change) {
		if (editableLines.indexOf(change.to.line) == -1 ||
				change.to.line != change.from.line ||
				(change.to.ch > 80 && change.to.ch >= change.from.ch)) {
			change.cancel();
		}
	});

	// set bg color for uneditable line
	editor.on('update', function (instance) {
		for (var i = 0; i < editor.lineCount(); i++) {
			if (editableLines.indexOf(i) == -1) {
				instance.addLineClass(i, 'wrap', 'disabled');
			}
		}
	});
	editor.refresh();

	// editor.getPlayerCode returns only the code written in editable lines
	editor.getPlayerCode = function () {
		var code = '';
		for (var i = 0; i < editor.lineCount(); i++) {
			if (editableLines.indexOf(i) > -1) {
				code += editor.getLine(i) + ' \n';
			}
		}
		return code;
	}

	// start the level and fade in
	evalLevelCode(lvlNum);
	if (lvlNum < levelFileNames.length) {
		// don't fade in for dummy level
		display.fadeIn(map);
	}

	// on first level, display intro text
	if (currentLevel == 0) {
		output.write('Dr. Eval awoke in a strange dungeon, with no apparent way out. He spied his trusty computer ...');
	}
}

function resetEditor() {
    getLevel(currentLevel);
}

function evalLevelCode(lvlNum) {
	var allCode = editor.getValue();
	var playerCode = editor.getPlayerCode();
	var validatedStartLevel = validate(allCode, playerCode, currentLevel);
	if (validatedStartLevel) {
		map.reset();
		validatedStartLevel(map);
		if (lvlNum >= levelFileNames.length) {
			// don't do this for dummy level
			return;
		}
		display.drawAll(map);
	}
}

function usePhone() {
	if (map.player._phoneFunc) {
		map.player._phoneFunc();
	} else {
		output.write('RotaryPhoneException: Your function phone is not bound to any function.')
	}
}
