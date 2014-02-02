$(document).ready(function() {
    var startLevel = getParameterByName('lvl') ? parseInt(getParameterByName('lvl')) : null;
    window.game = new Game(true, startLevel);
    window.game._initialize();
    window.eval = {};
});
