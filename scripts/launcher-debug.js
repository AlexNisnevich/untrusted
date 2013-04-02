
var game;
$(document).ready(function() {
	game = new Game();

	// Debug tools
	$('body').append('<button style="position: fixed; bottom: 5px; right: 5px" onclick="game.getLevel(parseInt(prompt(\'Level #\')));">Jump To Level</button>');
});
