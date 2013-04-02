
var game;
$(document).ready(function() {
	game = new Game();

	// Debug tools
	$('body')
		.append('<button style="position: fixed; bottom: 32px; right: 5px" onclick="game.getLevel(parseInt(prompt(\'\')));">Jump To Level</button>')
		.append('<button style="position: fixed; bottom: 5px; right: 5px" onclick="$.get(\'levels/blankLevel.jsx\', function (codeText) { game.loadLevel(codeText, -1); });">Create Blank Level</button>');
});
