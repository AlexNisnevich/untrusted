var game;
$(document).ready(function() {
	var startLevel = getParameterByName('lvl') ? parseInt(getParameterByName('lvl')) : null;
	game = new Game(true, startLevel);
	game._initialize();
});
