
var game;
$(document).ready(function() {
	game = new Game();

	// Debug tools
	$('body')
		.append('<button style="position: fixed; bottom: 32px; right: 5px" onclick="jumpToLevel();">Jump To Level [Ctrl-J]</button>')
		.append('<button style="position: fixed; bottom: 5px; right: 5px" onclick="createBlankLevel()">Create Blank Level [Ctrl-B]</button>');
	shortcut.add('ctrl+j', function () { jumpToLevel(); return true; });
	shortcut.add('ctrl+b', function () { createBlankLevel(); return true; });
});

function jumpToLevel() {
	var levelNum = parseInt(prompt(""));

	// Give the player all necessary objects
	if (levelNum > 1) {
		game.addToGlobalInventory('computer');
		$('#editorPane').fadeIn();
		game.editor.refresh();
	}
	if (levelNum > 6) {
		game.addToGlobalInventory('phone');
		$('#phoneButton').show();
	}
	game.getLevel(levelNum);
}

function createBlankLevel() {
	$.get("levels/blankLevel.jsx", function (codeText) {
		game.loadLevel(codeText, -1);
		game.VERBOTEN == [];
	});
}
